// Test Supabase connection
// Run with: npx tsx scripts/test-connection.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    console.log('URL:', supabaseUrl);
    
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('✅ Connection successful!');
        console.log('ℹ️  Database tables not created yet - this is expected.');
        console.log('📝 Next step: Run the SQL schema from lib/database-schema.md in Supabase SQL Editor');
      } else {
        console.error('❌ Connection error:', error.message);
      }
    } else {
      console.log('✅ Connection successful!');
      console.log('✅ Database tables exist');
    }
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

testConnection();

