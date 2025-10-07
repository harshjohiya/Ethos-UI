import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database.types';

// Type definitions
type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type CampusCardSwipe = Database['public']['Tables']['campus_card_swipes']['Row'];
type CCTVFrame = Database['public']['Tables']['cctv_frames']['Row'];

// Bookings hooks
export function useBookings(entityId?: string) {
  return useQuery({
    queryKey: ['bookings', entityId],
    queryFn: async () => {
      let query = supabase.from('bookings').select('*');
      if (entityId) {
        query = query.eq('entity_id', entityId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Booking[];
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: BookingInsert) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert([booking] as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      if (variables.entity_id) {
        queryClient.invalidateQueries({ queryKey: ['bookings', variables.entity_id] });
      }
    },
  });
}

// Campus Card Swipes hooks
export function useCardSwipes(cardId?: string, limit = 10) {
  return useQuery({
    queryKey: ['campus_card_swipes', cardId, limit],
    queryFn: async () => {
      let query = supabase.from('campus_card_swipes').select('*');
      if (cardId) {
        query = query.eq('card_id', cardId);
      }
      query = query.order('timestamp', { ascending: false }).limit(limit);
      
      const { data, error } = await query;
      if (error) throw error;
      return data as CampusCardSwipe[];
    },
  });
}

// CCTV Frames hooks
export function useCCTVFrames(locationId?: string, limit = 10) {
  return useQuery({
    queryKey: ['cctv_frames', locationId, limit],
    queryFn: async () => {
      let query = supabase.from('cctv_frames').select('*');
      if (locationId) {
        query = query.eq('location_id', locationId);
      }
      query = query.order('timestamp', { ascending: false }).limit(limit);
      
      const { data, error } = await query;
      if (error) throw error;
      return data as CCTVFrame[];
    },
  });
}

// Real-time subscriptions hooks
export function useCardSwipesSubscription(onSwipe: (swipe: CampusCardSwipe) => void) {
  useEffect(() => {
    const subscription = supabase
      .channel('campus_card_swipes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'campus_card_swipes' },
        (payload) => onSwipe(payload.new as CampusCardSwipe)
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [onSwipe]);
}

export function useCCTVFramesSubscription(onFrame: (frame: CCTVFrame) => void) {
  useEffect(() => {
    const subscription = supabase
      .channel('cctv_frames')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'cctv_frames' },
        (payload) => onFrame(payload.new as CCTVFrame)
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [onFrame]);
}