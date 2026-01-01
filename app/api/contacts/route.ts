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

    // Get user profile to determine role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    let query;

    if (profile.role === 'provider') {
      // Providers see leads they received
      query = supabase
        .from('contacts')
        .select(`
          *,
          customer:customer_id (
            id,
            full_name,
            phone,
            village
          )
        `)
        .eq('provider_id', session.user.id)
        .order('created_at', { ascending: false });
    } else {
      // Customers see providers they contacted
      query = supabase
        .from('contacts')
        .select(`
          *,
          provider:provider_id (
            id,
            service_category,
            profiles:user_id (
              full_name,
              phone
            )
          )
        `)
        .eq('customer_id', session.user.id)
        .order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ contacts: data || [] });
  } catch (error: any) {
    console.error('Get contacts error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider_id, service_type, message, contact_method } = body;

    const supabase = createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create contact record
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        customer_id: session.user.id,
        provider_id,
        service_type,
        message,
        contact_method: contact_method || 'whatsapp',
        status: 'new',
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
    console.error('Create contact error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create contact' },
      { status: 500 }
    );
  }
}

