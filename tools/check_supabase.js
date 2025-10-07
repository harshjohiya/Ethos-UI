// Simple check script to verify Supabase connectivity and fetch sample rows
// Usage: node tools/check_supabase.js

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

    console.log('Supabase URL:', url);
    const { data: profiles, error: pErr } = await supabase.from('profiles').select('*').limit(5);
    if (pErr) {
      console.error('Error fetching profiles:', pErr.message || pErr);
    } else {
      console.log('Profiles (sample):', profiles?.length ?? 0);
      console.dir(profiles, { depth: 2 });
    }

    const { data: swipes, error: sErr } = await supabase.from('campus_card_swipes').select('*').limit(5);
    if (sErr) {
      console.error('Error fetching campus_card_swipes:', sErr.message || sErr);
    } else {
      console.log('Campus card swipes (sample):', swipes?.length ?? 0);
      console.dir(swipes, { depth: 2 });
    }

    process.exit(0);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
})();
