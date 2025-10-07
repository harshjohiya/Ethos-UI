import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function TestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function test() {
      console.log('=== SUPABASE TEST ===');
      console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Key:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.substring(0, 20) + '...');
      
      try {
        // Test 1: List all tables
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .limit(5);

        console.log('Profiles query result:', { profiles, profileError });

        const { data: swipes, error: swipeError } = await supabase
          .from('campus_card_swipes')
          .select('*')
          .limit(5);

        console.log('Swipes query result:', { swipes, swipeError });

        setResult({
          profiles: { data: profiles, error: profileError },
          swipes: { data: swipes, error: swipeError },
        });
      } catch (err) {
        console.error('Test error:', err);
        setResult({ error: err });
      } finally {
        setLoading(false);
      }
    }

    test();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Supabase Connection Test</h1>
      
      <div className="space-y-2">
        <p><strong>URL:</strong> {import.meta.env.VITE_SUPABASE_URL}</p>
        <p><strong>Key (first 20 chars):</strong> {import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.substring(0, 20)}...</p>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Results:</h2>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-bold">Profiles:</h3>
          {result?.profiles?.error ? (
            <p className="text-red-500">Error: {result.profiles.error.message}</p>
          ) : (
            <p className="text-green-500">Found {result?.profiles?.data?.length || 0} profiles</p>
          )}
        </div>

        <div>
          <h3 className="font-bold">Card Swipes:</h3>
          {result?.swipes?.error ? (
            <p className="text-red-500">Error: {result.swipes.error.message}</p>
          ) : (
            <p className="text-green-500">Found {result?.swipes?.data?.length || 0} swipes</p>
          )}
        </div>
      </div>
    </div>
  );
}
