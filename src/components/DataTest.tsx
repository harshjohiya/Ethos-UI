import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  entity_id: string;
  name: string | null;
  role: string | null;
  email: string | null;
}

interface CardSwipe {
  swipe_id: number;
  card_id: string | null;
  location_id: string | null;
  timestamp: string | null;
}

export function DataTest() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [cardSwipes, setCardSwipes] = useState<CardSwipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('entity_id, name, role, email')
          .limit(10);

        if (profilesError) throw profilesError;

        // Fetch recent card swipes
        const { data: swipesData, error: swipesError } = await supabase
          .from('campus_card_swipes')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10);

        if (swipesError) throw swipesError;

        setProfiles(profilesData);
        setCardSwipes(swipesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Set up real-time subscription for card swipes
    const subscription = supabase
      .channel('campus_card_swipes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'campus_card_swipes' },
        (payload) => {
          setCardSwipes((current) => [payload.new as CardSwipe, ...current].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Data Integration Test</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Profiles</h3>
        <div className="grid gap-4">
          {profiles.map((profile) => (
            <div key={profile.entity_id} className="p-4 border rounded">
              <p>ID: {profile.entity_id}</p>
              <p>Name: {profile.name}</p>
              <p>Role: {profile.role}</p>
              <p>Email: {profile.email}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Recent Card Swipes</h3>
        <div className="grid gap-4">
          {cardSwipes.map((swipe) => (
            <div key={swipe.swipe_id} className="p-4 border rounded">
              <p>Swipe ID: {swipe.swipe_id}</p>
              <p>Card ID: {swipe.card_id}</p>
              <p>Location: {swipe.location_id}</p>
              <p>Time: {new Date(swipe.timestamp || '').toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}