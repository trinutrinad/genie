import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();

    // Get provider with profile
    const { data: provider, error: providerError } = await supabase
      .from('service_providers')
      .select(`
        *,
        profiles (
          id,
          full_name,
          phone,
          whatsapp_number,
          village,
          block,
          district
        )
      `)
      .eq('id', id)
      .single();

    if (providerError || !provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await supabase.rpc('increment_view_count', { provider_uuid: id });

    // Get reviews
    const { data: reviews } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles (
          full_name
        )
      `)
      .eq('provider_id', id)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      ...provider,
      reviews: reviews || [],
    });
  } catch (error: any) {
    console.error('Get provider error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch provider' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = createServerSupabaseClient();

    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify ownership
    const { data: provider } = await supabase
      .from('service_providers')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!provider || provider.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Update provider
    const { data, error } = await supabase
      .from('service_providers')
      .update({
        service_category: body.service_category,
        specific_services: body.specific_services,
        experience_years: body.experience_years,
        price_min: body.price_min,
        price_max: body.price_max,
        service_area: body.service_area,
        about: body.about,
        profile_photo_url: body.profile_photo_url,
        work_photos: body.work_photos,
        is_available: body.is_available,
      })
      .eq('id', id)
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
    console.error('Update provider error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update provider' },
      { status: 500 }
    );
  }
}

