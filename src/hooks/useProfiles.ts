import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export function useProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
  const { data, error } = await (supabase as any).from('profiles').select('*');
      if (error) throw error;
      return data as Profile[];
    },
  });
}

export function useProfile(entityId: string) {
  return useQuery({
    queryKey: ['profile', entityId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('entity_id', entityId)
        .single();
      if (error) throw error;
      return data as Profile;
    },
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: ProfileInsert) => {
  const { data, error } = await (supabase as any).from('profiles').insert([profile] as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entityId, updates }: { entityId: string; updates: ProfileUpdate }) => {
      const { data, error } = await (supabase as any)
        .from('profiles')
  .update(updates as any)
        .eq('entity_id', entityId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data: unknown, variables: { entityId: string }) => {
      const { entityId } = variables;
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['profile', entityId] });
    },
  });
}