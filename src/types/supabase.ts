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
      food_category_ratings: {
        Row: {
          created_at: string | null
          food_category: string | null
          id: number
          rating: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          food_category?: string | null
          id?: number
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          food_category?: string | null
          id?: number
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_category_ratings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      food_ratings: {
        Row: {
          food_id: number
          id: number
          rating: number | null
          user_id: string
        }
        Insert: {
          food_id: number
          id?: number
          rating?: number | null
          user_id: string
        }
        Update: {
          food_id?: number
          id?: number
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_ratings_food_id_fkey"
            columns: ["food_id"]
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_ratings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      foods: {
        Row: {
          foodType: string | null
          id: number
          src: string | null
          type: string | null
        }
        Insert: {
          foodType?: string | null
          id?: number
          src?: string | null
          type?: string | null
        }
        Update: {
          foodType?: string | null
          id?: number
          src?: string | null
          type?: string | null
        }
        Relationships: []
      }
      task_responses: {
        Row: {
          assessment: string | null
          border_delta: number | null
          commission_resp_delta: number | null
          correct_resp_delta: number | null
          game_slug: string | null
          gsession_created_at: string | null
          has_selection: number | null
          id: number
          is_commission: number | null
          is_omission: number | null
          is_valid: number | null
          jitter_dur: number | null
          phase: number | null
          picture_delta: number | null
          picture_dur: number | null
          picture_list: string | null
          picture_offset: string | null
          sort: number | null
          target_index: number | null
          user_id: string | null
        }
        Insert: {
          assessment?: string | null
          border_delta?: number | null
          commission_resp_delta?: number | null
          correct_resp_delta?: number | null
          game_slug?: string | null
          gsession_created_at?: string | null
          has_selection?: number | null
          id?: number
          is_commission?: number | null
          is_omission?: number | null
          is_valid?: number | null
          jitter_dur?: number | null
          phase?: number | null
          picture_delta?: number | null
          picture_dur?: number | null
          picture_list?: string | null
          picture_offset?: string | null
          sort?: number | null
          target_index?: number | null
          user_id?: string | null
        }
        Update: {
          assessment?: string | null
          border_delta?: number | null
          commission_resp_delta?: number | null
          correct_resp_delta?: number | null
          game_slug?: string | null
          gsession_created_at?: string | null
          has_selection?: number | null
          id?: number
          is_commission?: number | null
          is_omission?: number | null
          is_valid?: number | null
          jitter_dur?: number | null
          phase?: number | null
          picture_delta?: number | null
          picture_dur?: number | null
          picture_list?: string | null
          picture_offset?: string | null
          sort?: number | null
          target_index?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_responses_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
