import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get saved providers
    const { data: saved, error: savedError } = await supabase
      .from('saved_providers')
      .select('provider_id')
      .eq('customer_id', session.user.id);

    if (savedError) {
      return NextResponse.json(
        { error: savedError.message },
        { status: 400 }
      );
    }

    if (!saved || saved.length === 0) {
      return NextResponse.json({ providers: [] });
    }

    const providerIds = saved.map((s) => s.provider_id);

    // Get provider details
    const { data: providers, error: providersError } = await supabase
      .from('service_providers')
      .select(`
        *,
        profiles (
          id,
          full_name,
          village
        )
      `)
      .in('id', providerIds);

    if (providersError) {
      return NextResponse.json(
        { error: providersError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ providers: providers || [] });
  } catch (error: any) {
    console.error('Get saved providers error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch saved providers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider_id } = body;

    const supabase = createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Save provider
    const { data, error } = await supabase
      .from('saved_providers')
      .insert({
        customer_id: session.user.id,
        provider_id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Save provider error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save provider' },
      { status: 500 }
    );
  }
}

