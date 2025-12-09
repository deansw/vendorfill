// types/supabase.ts — GENERATED SUPABASE TYPES
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
      // Add your tables here when you create them in Supabase
      // For now it's empty — that's fine
    }
    Views: {
      [key: string]: {
        Row: {
          [key: string]: unknown
        }
      }
    }
    Functions: {
      [key: string]: {
        Args: {
          [key: string]: unknown
        }
        Returns: unknown
      }
    }
    Enums: {
      [key: string]: string
    }
  }
}
