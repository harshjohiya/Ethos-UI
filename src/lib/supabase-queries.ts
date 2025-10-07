import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database.types';

// Type helpers
type Tables = Database['public']['Tables'];
type TableName = keyof Tables;

// Profile queries
export const profileQueries = {
  getAll: async (): Promise<Tables['profiles']['Row'][]> => {
    // Fetch all profiles without limit (Supabase default is 1000, so we need to paginate)
    let allData: Tables['profiles']['Row'][] = [];
    let from = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, from + pageSize - 1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        allData = [...allData, ...(data as Tables['profiles']['Row'][])];
        from += pageSize;
        hasMore = data.length === pageSize;
      } else {
        hasMore = false;
      }
    }
    
    return allData;
  },

  getById: async (entityId: string): Promise<Tables['profiles']['Row']> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('entity_id', entityId)
      .single();
    
    if (error) throw error;
    return data as Tables['profiles']['Row'];
  },

  search: async (query: string): Promise<Tables['profiles']['Row'][]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,student_id.ilike.%${query}%,staff_id.ilike.%${query}%,card_id.ilike.%${query}%`)
      .limit(50);
    
    if (error) throw error;
    return (data || []) as Tables['profiles']['Row'][];
  },

  create: async (profile: Tables['profiles']['Insert']): Promise<Tables['profiles']['Row']> => {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile as any)
      .select()
      .single();
    
    if (error) throw error;
    return data as Tables['profiles']['Row'];
  },

  update: async (entityId: string, updates: Tables['profiles']['Update']): Promise<Tables['profiles']['Row']> => {
    const { data, error } = await supabase
      .from('profiles')
      // @ts-expect-error - Supabase type inference issue with Update types
      .update(updates)
      .eq('entity_id', entityId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Tables['profiles']['Row'];
  },

  delete: async (entityId: string) => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('entity_id', entityId);
    
    if (error) throw error;
  },
};

// Campus card swipes queries
export const cardSwipeQueries = {
  getAll: async (limit = 100): Promise<Tables['campus_card_swipes']['Row'][]> => {
    const { data, error } = await supabase
      .from('campus_card_swipes')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return (data || []) as Tables['campus_card_swipes']['Row'][];
  },

  getByCardId: async (cardId: string, limit = 50): Promise<Tables['campus_card_swipes']['Row'][]> => {
    const { data, error } = await supabase
      .from('campus_card_swipes')
      .select('*')
      .eq('card_id', cardId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return (data || []) as Tables['campus_card_swipes']['Row'][];
  },

  getByLocationId: async (locationId: string, limit = 50): Promise<Tables['campus_card_swipes']['Row'][]> => {
    const { data, error } = await supabase
      .from('campus_card_swipes')
      .select('*')
      .eq('location_id', locationId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return (data || []) as Tables['campus_card_swipes']['Row'][];
  },

  getRecent: async (hours = 24): Promise<Tables['campus_card_swipes']['Row'][]> => {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('campus_card_swipes')
      .select('*')
      .gte('timestamp', since)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return (data || []) as Tables['campus_card_swipes']['Row'][];
  },
};

// Bookings queries
export const bookingQueries = {
  getAll: async (limit = 100): Promise<Tables['bookings']['Row'][]> => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('start_time', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return (data || []) as Tables['bookings']['Row'][];
  },

  getByEntityId: async (entityId: string): Promise<Tables['bookings']['Row'][]> => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('entity_id', entityId)
      .order('start_time', { ascending: false });
    
    if (error) throw error;
    return (data || []) as Tables['bookings']['Row'][];
  },

  getUpcoming: async (): Promise<Tables['bookings']['Row'][]> => {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .gte('start_time', now)
      .order('start_time', { ascending: true });
    
    if (error) throw error;
    return (data || []) as Tables['bookings']['Row'][];
  },

  create: async (booking: Tables['bookings']['Insert']): Promise<Tables['bookings']['Row']> => {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking as any)
      .select()
      .single();
    
    if (error) throw error;
    return data as Tables['bookings']['Row'];
  },

  updateAttendance: async (bookingId: string, attended: boolean): Promise<Tables['bookings']['Row']> => {
    const { data, error } = await supabase
      .from('bookings')
      // @ts-expect-error - Supabase type inference issue with Update types
      .update({ attended })
      .eq('booking_id', bookingId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Tables['bookings']['Row'];
  },
};

// WiFi associations queries
export const wifiQueries = {
  getAll: async (limit = 100): Promise<Tables['wifi_associations_logs']['Row'][]> => {
    const { data, error } = await supabase
      .from('wifi_associations_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return (data || []) as Tables['wifi_associations_logs']['Row'][];
  },

  getByDeviceHash: async (deviceHash: string, limit = 50): Promise<Tables['wifi_associations_logs']['Row'][]> => {
    const { data, error } = await supabase
      .from('wifi_associations_logs')
      .select('*')
      .eq('device_hash', deviceHash)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return (data || []) as Tables['wifi_associations_logs']['Row'][];
  },

  getByApId: async (apId: string, limit = 50): Promise<Tables['wifi_associations_logs']['Row'][]> => {
    const { data, error } = await supabase
      .from('wifi_associations_logs')
      .select('*')
      .eq('ap_id', apId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return (data || []) as Tables['wifi_associations_logs']['Row'][];
  },
};

// Library checkouts queries
export const libraryQueries = {
  getAll: async (limit = 100): Promise<Tables['library_checkouts']['Row'][]> => {
    const { data, error } = await supabase
      .from('library_checkouts')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return (data || []) as Tables['library_checkouts']['Row'][];
  },

  getByEntityId: async (entityId: string): Promise<Tables['library_checkouts']['Row'][]> => {
    const { data, error } = await supabase
      .from('library_checkouts')
      .select('*')
      .eq('entity_id', entityId)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return (data || []) as Tables['library_checkouts']['Row'][];
  },

  create: async (checkout: Tables['library_checkouts']['Insert']): Promise<Tables['library_checkouts']['Row']> => {
    const { data, error } = await supabase
      .from('library_checkouts')
      .insert(checkout as any)
      .select()
      .single();
    
    if (error) throw error;
    return data as Tables['library_checkouts']['Row'];
  },
};

// CCTV frames queries
export const cctvQueries = {
  getAll: async (limit = 100): Promise<Tables['cctv_frames']['Row'][]> => {
    const { data, error } = await supabase
      .from('cctv_frames')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return (data || []) as Tables['cctv_frames']['Row'][];
  },

  getByLocationId: async (locationId: string, limit = 50): Promise<Tables['cctv_frames']['Row'][]> => {
    const { data, error } = await supabase
      .from('cctv_frames')
      .select('*')
      .eq('location_id', locationId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return (data || []) as Tables['cctv_frames']['Row'][];
  },

  getByFaceId: async (faceId: string, limit = 50): Promise<Tables['cctv_frames']['Row'][]> => {
    const { data, error } = await supabase
      .from('cctv_frames')
      .select('*')
      .eq('face_id', faceId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return (data || []) as Tables['cctv_frames']['Row'][];
  },
};

// Face embeddings queries
export const faceQueries = {
  getByEntityId: async (entityId: string): Promise<Tables['face_embeddings']['Row'][]> => {
    const { data, error } = await supabase
      .from('face_embeddings')
      .select('*')
      .eq('entity_id', entityId);
    
    if (error) throw error;
    return (data || []) as Tables['face_embeddings']['Row'][];
  },

  getById: async (faceId: string): Promise<Tables['face_embeddings']['Row']> => {
    const { data, error } = await supabase
      .from('face_embeddings')
      .select('*')
      .eq('face_id', faceId)
      .single();
    
    if (error) throw error;
    return data as Tables['face_embeddings']['Row'];
  },
};

// Free text notes queries
export const notesQueries = {
  getByEntityId: async (entityId: string): Promise<Tables['free_text_notes']['Row'][]> => {
    const { data, error } = await supabase
      .from('free_text_notes')
      .select('*')
      .eq('entity_id', entityId)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return (data || []) as Tables['free_text_notes']['Row'][];
  },

  create: async (note: Tables['free_text_notes']['Insert']): Promise<Tables['free_text_notes']['Row']> => {
    const { data, error } = await supabase
      .from('free_text_notes')
      .insert(note as any)
      .select()
      .single();
    
    if (error) throw error;
    return data as Tables['free_text_notes']['Row'];
  },
};

// Entity resolution map queries
export const entityResolutionQueries = {
  getBySourceId: async (sourceTable: string, sourceId: string): Promise<Tables['entity_resolution_map']['Row'][]> => {
    const { data, error } = await supabase
      .from('entity_resolution_map')
      .select('*')
      .eq('source_table', sourceTable)
      .eq('source_id', sourceId)
      .order('confidence', { ascending: false });
    
    if (error) throw error;
    return (data || []) as Tables['entity_resolution_map']['Row'][];
  },

  getByCanonicalId: async (canonicalEntityId: string): Promise<Tables['entity_resolution_map']['Row'][]> => {
    const { data, error } = await supabase
      .from('entity_resolution_map')
      .select('*')
      .eq('canonical_entity_id', canonicalEntityId)
      .order('resolved_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as Tables['entity_resolution_map']['Row'][];
  },
};

// Unified timeline query - aggregates all activities for an entity
export const getEntityTimeline = async (entityId: string, limit = 100) => {
  try {
    const profile = await profileQueries.getById(entityId);
    
    if (!profile) {
      return [];
    }
    
    const timeline: Array<{
      source: string;
      timestamp: string;
      entity_id: string;
      location_id?: string;
      card_id?: string;
      ap_id?: string;
      device_hash?: string;
      room_id?: string;
      book_id?: string;
      description?: string;
    }> = [];

    // Get card swipes
    if (profile.card_id) {
      try {
        const swipes = await cardSwipeQueries.getByCardId(profile.card_id, 50);
        if (swipes) {
          swipes.forEach(s => {
            if (s && s.timestamp) {
              timeline.push({
                source: 'card_swipe',
                timestamp: s.timestamp,
                entity_id: entityId,
                location_id: s.location_id || undefined,
                card_id: s.card_id || undefined,
                description: `Card swipe at ${s.location_id || 'unknown location'}`,
              });
            }
          });
        }
      } catch (err) {
        console.error('Error fetching card swipes:', err);
      }
    }

    // Get WiFi associations
    if (profile.device_hash) {
      try {
        const wifi = await wifiQueries.getByDeviceHash(profile.device_hash, 50);
        if (wifi) {
          wifi.forEach(w => {
            if (w && w.timestamp) {
              timeline.push({
                source: 'wifi',
                timestamp: w.timestamp,
                entity_id: entityId,
                ap_id: w.ap_id || undefined,
                device_hash: w.device_hash || undefined,
                description: `WiFi connection to ${w.ap_id || 'unknown AP'}`,
              });
            }
          });
        }
      } catch (err) {
        console.error('Error fetching wifi logs:', err);
      }
    }

    // Get bookings
    try {
      const bookings = await bookingQueries.getByEntityId(entityId);
      if (bookings) {
        bookings.forEach(b => {
          if (b && b.start_time) {
            timeline.push({
              source: 'booking',
              timestamp: b.start_time,
              entity_id: entityId,
              room_id: b.room_id || undefined,
              description: `Room booking: ${b.room_id} (${b.attended ? 'attended' : 'not attended'})`,
            });
          }
        });
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }

    // Get library checkouts
    try {
      const checkouts = await libraryQueries.getByEntityId(entityId);
      if (checkouts) {
        checkouts.forEach(c => {
          if (c && c.timestamp) {
            timeline.push({
              source: 'library',
              timestamp: c.timestamp,
              entity_id: entityId,
              book_id: c.book_id || undefined,
              description: `Library checkout: ${c.book_id}`,
            });
          }
        });
      }
    } catch (err) {
      console.error('Error fetching library checkouts:', err);
    }

    // Get CCTV frames
    if (profile.face_id) {
      try {
        const frames = await cctvQueries.getByFaceId(profile.face_id, 50);
        if (frames) {
          frames.forEach(f => {
            if (f && f.timestamp) {
              timeline.push({
                source: 'cctv',
                timestamp: f.timestamp,
                entity_id: entityId,
                location_id: f.location_id || undefined,
                description: `CCTV detection at ${f.location_id || 'unknown location'}`,
              });
            }
          });
        }
      } catch (err) {
        console.error('Error fetching CCTV frames:', err);
      }
    }

    // Sort by timestamp descending
    timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return timeline.slice(0, limit);
  } catch (error) {
    console.error('Error in getEntityTimeline:', error);
    return [];
  }
};
