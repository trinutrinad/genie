import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ providerId: string }> }
) {
  try {
    const { providerId } = await params;
    const supabase = createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Remove saved provider
    const { error } = await supabase
      .from('saved_providers')
      .delete()
      .eq('customer_id', session.user.id)
      .eq('provider_id', providerId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete saved provider error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove saved provider' },
      { status: 500 }
    );
  }
}

