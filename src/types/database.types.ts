export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_id: string
          room_id: string
          entity_id: string | null
          start_time: string
          end_time: string
          attended: boolean | null
          created_at: string | null
        }
        Insert: {
          booking_id: string
          room_id: string
          entity_id?: string | null
          start_time: string
          end_time: string
          attended?: boolean | null
          created_at?: string | null
        }
        Update: {
          booking_id?: string
          room_id?: string
          entity_id?: string | null
          start_time?: string
          end_time?: string
          attended?: boolean | null
          created_at?: string | null
        }
      }
      campus_card_swipes: {
        Row: {
          swipe_id: number
          card_id: string | null
          location_id: string | null
          timestamp: string | null
        }
        Insert: {
          swipe_id?: number
          card_id?: string | null
          location_id?: string | null
          timestamp?: string | null
        }
        Update: {
          swipe_id?: number
          card_id?: string | null
          location_id?: string | null
          timestamp?: string | null
        }
      }
      cctv_frames: {
        Row: {
          frame_id: string
          location_id: string | null
          timestamp: string | null
          face_id: string | null
        }
        Insert: {
          frame_id: string
          location_id?: string | null
          timestamp?: string | null
          face_id?: string | null
        }
        Update: {
          frame_id?: string
          location_id?: string | null
          timestamp?: string | null
          face_id?: string | null
        }
      }
      entity_resolution_map: {
        Row: {
          source_table: string | null
          source_id: string | null
          canonical_entity_id: string | null
          confidence: number | null
          provenance: Json | null
          resolved_at: string | null
        }
        Insert: {
          source_table?: string | null
          source_id?: string | null
          canonical_entity_id?: string | null
          confidence?: number | null
          provenance?: Json | null
          resolved_at?: string | null
        }
        Update: {
          source_table?: string | null
          source_id?: string | null
          canonical_entity_id?: string | null
          confidence?: number | null
          provenance?: Json | null
          resolved_at?: string | null
        }
      }
      face_embeddings: {
        Row: {
          face_id: string
          entity_id: string | null
          embedding: Json | null
          created_at: string | null
        }
        Insert: {
          face_id: string
          entity_id?: string | null
          embedding?: Json | null
          created_at?: string | null
        }
        Update: {
          face_id?: string
          entity_id?: string | null
          embedding?: Json | null
          created_at?: string | null
        }
      }
      face_images: {
        Row: {
          face_id: string
          url: string | null
          uploaded_at: string | null
        }
        Insert: {
          face_id: string
          url?: string | null
          uploaded_at?: string | null
        }
        Update: {
          face_id?: string
          url?: string | null
          uploaded_at?: string | null
        }
      }
      free_text_notes: {
        Row: {
          note_id: string
          entity_id: string | null
          category: string | null
          text: string | null
          timestamp: string | null
        }
        Insert: {
          note_id: string
          entity_id?: string | null
          category?: string | null
          text?: string | null
          timestamp?: string | null
        }
        Update: {
          note_id?: string
          entity_id?: string | null
          category?: string | null
          text?: string | null
          timestamp?: string | null
        }
      }
      library_checkouts: {
        Row: {
          checkout_id: string
          entity_id: string | null
          book_id: string
          timestamp: string
          created_at: string | null
        }
        Insert: {
          checkout_id: string
          entity_id?: string | null
          book_id: string
          timestamp?: string
          created_at?: string | null
        }
        Update: {
          checkout_id?: string
          entity_id?: string | null
          book_id?: string
          timestamp?: string
          created_at?: string | null
        }
      }
      profiles: {
        Row: {
          entity_id: string
          name: string | null
          role: string | null
          email: string | null
          department: string | null
          student_id: string | null
          staff_id: string | null
          card_id: string | null
          device_hash: string | null
          face_id: string | null
          created_at: string | null
        }
        Insert: {
          entity_id: string
          name?: string | null
          role?: string | null
          email?: string | null
          department?: string | null
          student_id?: string | null
          staff_id?: string | null
          card_id?: string | null
          device_hash?: string | null
          face_id?: string | null
          created_at?: string | null
        }
        Update: {
          entity_id?: string
          name?: string | null
          role?: string | null
          email?: string | null
          department?: string | null
          student_id?: string | null
          staff_id?: string | null
          card_id?: string | null
          device_hash?: string | null
          face_id?: string | null
          created_at?: string | null
        }
      }
      wifi_associations_logs: {
        Row: {
          id: number
          device_hash: string | null
          ap_id: string | null
          timestamp: string | null
        }
        Insert: {
          id?: number
          device_hash?: string | null
          ap_id?: string | null
          timestamp?: string | null
        }
        Update: {
          id?: number
          device_hash?: string | null
          ap_id?: string | null
          timestamp?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
