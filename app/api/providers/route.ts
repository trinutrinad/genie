import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const available = searchParams.get('available');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sort = searchParams.get('sort') || 'rating';

    const supabase = createServerSupabaseClient();

    // Start building query
    let query = supabase
      .from('service_providers')
      .select(`
        *,
        profiles:user_id (
          id,
          full_name,
          phone,
          whatsapp_number,
          village,
          block,
          district
        )
      `);

    // Apply filters
    if (category) {
      query = query.eq('service_category', category);
    }

    if (location) {
      query = query.contains('service_area', [location]);
    }

    if (available === 'true') {
      query = query.eq('is_available', true);
    }

    if (search) {
      query = query.or(`about.ilike.%${search}%,specific_services.cs.{${search}}`);
    }

    // Apply sorting
    if (sort === 'rating') {
      query = query.order('rating_avg', { ascending: false });
    } else if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sort === 'price_low') {
      query = query.order('price_min', { ascending: true });
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      providers: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: any) {
    console.error('Get providers error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // Create service provider profile
    const { data, error } = await supabase
      .from('service_providers')
      .insert({
        user_id: session.user.id,
        service_category: body.service_category,
        specific_services: body.specific_services || [],
        experience_years: body.experience_years || 0,
        price_min: body.price_min,
        price_max: body.price_max,
        service_area: Array.isArray(body.service_area) ? body.service_area : (body.service_area ? body.service_area.split(',').map((s: string) => s.trim()) : []),
        about: body.about,
        profile_photo_url: body.profile_photo_url,
        work_photos: body.work_photos || [],
        aadhaar_number: body.aadhaar_number,
        is_available: body.is_available !== undefined ? body.is_available : true,
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
    console.error('Create provider error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create provider' },
      { status: 500 }
    );
  }
}

