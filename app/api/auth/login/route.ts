import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, phone } = body;

    const supabase = createServerSupabaseClient();

    // Support both email and phone login
    let identifier = email;
    
    // If phone is provided, find user by phone
    if (phone && !email) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', phone)
        .single();

      if (!profile) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // For phone login, we'll need to use a different approach
      // For now, return error suggesting email login
      return NextResponse.json(
        { error: 'Please use email to login. Phone login coming soon.' },
        { status: 400 }
      );
    }

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: identifier,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: data.user,
      session: data.session,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}

