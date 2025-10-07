import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type CardSwipe = Database['public']['Tables']['campus_card_swipes']['Row'];

export function SupabaseTest() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [cardSwipes, setCardSwipes] = useState<CardSwipe[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Test database connection
        const { data, error } = await supabase.from('profiles').select('*').limit(1);
        if (error) throw error;

        // Fetch data if connection is successful
        const [profilesRes, swipesRes] = await Promise.all([
          supabase.from('profiles').select('*').limit(10),
          supabase.from('campus_card_swipes').select('*').order('timestamp', { ascending: false }).limit(10)
        ]);

        if (profilesRes.error) throw profilesRes.error;
        if (swipesRes.error) throw swipesRes.error;

        setProfiles(profilesRes.data || []);
        setCardSwipes(swipesRes.data || []);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Set up real-time subscription
    const subscription = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public' }, (payload) => {
        console.log('Change received!', payload);
        // Handle different table updates
        if (payload.table === 'campus_card_swipes') {
          setCardSwipes(current => [payload.new as CardSwipe, ...current].slice(0, 10));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="p-4">Testing Supabase connection...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Supabase Integration Test</h2>
        <div className="p-2 bg-green-100 text-green-800 rounded">
          ✓ Successfully connected to Supabase
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Recent Profiles ({profiles.length})</h3>
        <div className="grid gap-4">
          {profiles.map((profile) => (
            <div key={profile.entity_id} className="p-4 border rounded">
              <p><strong>ID:</strong> {profile.entity_id}</p>
              <p><strong>Name:</strong> {profile.name || 'N/A'}</p>
              <p><strong>Role:</strong> {profile.role || 'N/A'}</p>
              <p><strong>Email:</strong> {profile.email || 'N/A'}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Recent Card Swipes ({cardSwipes.length})</h3>
        <div className="grid gap-4">
          {cardSwipes.map((swipe) => (
            <div key={swipe.swipe_id} className="p-4 border rounded">
              <p><strong>Swipe ID:</strong> {swipe.swipe_id}</p>
              <p><strong>Card ID:</strong> {swipe.card_id || 'N/A'}</p>
              <p><strong>Location:</strong> {swipe.location_id || 'N/A'}</p>
              <p><strong>Time:</strong> {swipe.timestamp ? new Date(swipe.timestamp).toLocaleString() : 'N/A'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}