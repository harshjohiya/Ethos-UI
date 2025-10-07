import dotenv from 'dotenv';
(async () => {
  dotenv.config({ path: './.env' });
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env');
      process.exit(2);
    }
    const supabase = createClient(url, key);
    console.log('Querying information_schema.tables for public schema...');
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(200);
    if (error) {
      console.error('Error querying information_schema.tables:', error.message || error);
      process.exit(1);
    }
    console.log('Tables in public schema:', (data || []).map(r => r.table_name));
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
})();
