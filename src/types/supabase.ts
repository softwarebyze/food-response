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
            foreignKeyName: 'food_category_ratings_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
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
          user_id?: string
        }
        Update: {
          food_id?: number
          id?: number
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'food_ratings_food_id_fkey'
            columns: ['food_id']
            isOneToOne: false
            referencedRelation: 'foods'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'food_ratings_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
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
      question_responses: {
        Row: {
          created_at: string
          id: number
          question: string | null
          response: string | null
          type: Database['public']['Enums']['question_type'] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          question?: string | null
          response?: string | null
          type?: Database['public']['Enums']['question_type'] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          question?: string | null
          response?: string | null
          type?: Database['public']['Enums']['question_type'] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'question_responses_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      task_responses: {
        Row: {
          assessment: string | null
          border_delta: number | null
          commission_resp_delta: number | null
          correct_resp_delta: number | null
          game_slug: string | null
          gsession_created_at: string | Date | null
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
          priming_category: number | null
          priming_dur: number | null
          priming_picture: string | null
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
          gsession_created_at?: string | Date | null
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
          priming_category?: number | null
          priming_dur?: number | null
          priming_picture?: string | null
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
          gsession_created_at?: string | Date | null
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
          priming_category?: number | null
          priming_dur?: number | null
          priming_picture?: string | null
          sort?: number | null
          target_index?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'task_responses_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
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
      question_type:
        | 'benefits'
        | 'costs'
        | 'reframing'
        | 'goals'
        | 'implementations'
        | 'circumnavigating'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
      Database['public']['Views'])
  ? (Database['public']['Tables'] &
      Database['public']['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
  ? Database['public']['Enums'][PublicEnumNameOrOptions]
  : never
