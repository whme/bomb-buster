export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      game: {
        Row: {
          captain_player_id: string
          created_at: string
          current_turn_player_id: string | null
          detonator_limit: number | null
          detonator_step: number
          ended_at: string | null
          host_player_id: string
          id: string
          invite_code: string
          next_yellow_rank: number
          red_wire_count: number
          started_at: string | null
          status: Database["public"]["Enums"]["game_status"]
          turn_number: number
          updated_at: string
          yellow_wire_count: number
        }
        Insert: {
          captain_player_id: string
          created_at?: string
          current_turn_player_id?: string | null
          detonator_limit?: number | null
          detonator_step?: number
          ended_at?: string | null
          host_player_id: string
          id?: string
          invite_code: string
          next_yellow_rank?: number
          red_wire_count?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["game_status"]
          turn_number?: number
          updated_at?: string
          yellow_wire_count?: number
        }
        Update: {
          captain_player_id?: string
          created_at?: string
          current_turn_player_id?: string | null
          detonator_limit?: number | null
          detonator_step?: number
          ended_at?: string | null
          host_player_id?: string
          id?: string
          invite_code?: string
          next_yellow_rank?: number
          red_wire_count?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["game_status"]
          turn_number?: number
          updated_at?: string
          yellow_wire_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_captain_player_fkey"
            columns: ["id", "captain_player_id"]
            isOneToOne: false
            referencedRelation: "game_player"
            referencedColumns: ["game_id", "id"]
          },
          {
            foreignKeyName: "game_current_turn_player_fkey"
            columns: ["id", "current_turn_player_id"]
            isOneToOne: false
            referencedRelation: "game_player"
            referencedColumns: ["game_id", "id"]
          },
          {
            foreignKeyName: "game_host_player_fkey"
            columns: ["id", "host_player_id"]
            isOneToOne: false
            referencedRelation: "game_player"
            referencedColumns: ["game_id", "id"]
          },
        ]
      }
      game_action: {
        Row: {
          action_type: Database["public"]["Enums"]["game_action_type"]
          actor_player_id: string
          actor_rack_id: string | null
          affected_tiles: Json
          created_at: string
          declared_wire_rank: number | null
          declared_wire_type: Database["public"]["Enums"]["wire_type"] | null
          detonator_step_change: number
          game_id: string
          id: string
          outcome: Database["public"]["Enums"]["action_outcome"] | null
          target_rack_id: string | null
          target_tile_id: string | null
          turn_number: number
        }
        Insert: {
          action_type: Database["public"]["Enums"]["game_action_type"]
          actor_player_id: string
          actor_rack_id?: string | null
          affected_tiles?: Json
          created_at?: string
          declared_wire_rank?: number | null
          declared_wire_type?: Database["public"]["Enums"]["wire_type"] | null
          detonator_step_change?: number
          game_id: string
          id?: string
          outcome?: Database["public"]["Enums"]["action_outcome"] | null
          target_rack_id?: string | null
          target_tile_id?: string | null
          turn_number: number
        }
        Update: {
          action_type?: Database["public"]["Enums"]["game_action_type"]
          actor_player_id?: string
          actor_rack_id?: string | null
          affected_tiles?: Json
          created_at?: string
          declared_wire_rank?: number | null
          declared_wire_type?: Database["public"]["Enums"]["wire_type"] | null
          detonator_step_change?: number
          game_id?: string
          id?: string
          outcome?: Database["public"]["Enums"]["action_outcome"] | null
          target_rack_id?: string | null
          target_tile_id?: string | null
          turn_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_action_actor_rack_id_actor_player_id_fkey"
            columns: ["actor_rack_id", "actor_player_id"]
            isOneToOne: false
            referencedRelation: "game_rack"
            referencedColumns: ["id", "controller_player_id"]
          },
          {
            foreignKeyName: "game_action_game_id_actor_player_id_fkey"
            columns: ["game_id", "actor_player_id"]
            isOneToOne: false
            referencedRelation: "game_player"
            referencedColumns: ["game_id", "id"]
          },
          {
            foreignKeyName: "game_action_game_id_actor_rack_id_fkey"
            columns: ["game_id", "actor_rack_id"]
            isOneToOne: false
            referencedRelation: "game_rack"
            referencedColumns: ["game_id", "id"]
          },
          {
            foreignKeyName: "game_action_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "game"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_action_game_id_target_rack_id_fkey"
            columns: ["game_id", "target_rack_id"]
            isOneToOne: false
            referencedRelation: "game_rack"
            referencedColumns: ["game_id", "id"]
          },
          {
            foreignKeyName: "game_action_game_id_target_tile_id_fkey"
            columns: ["game_id", "target_tile_id"]
            isOneToOne: false
            referencedRelation: "game_tile"
            referencedColumns: ["game_id", "id"]
          },
          {
            foreignKeyName: "game_action_target_rack_id_target_tile_id_fkey"
            columns: ["target_rack_id", "target_tile_id"]
            isOneToOne: false
            referencedRelation: "game_tile"
            referencedColumns: ["rack_id", "id"]
          },
        ]
      }
      game_player: {
        Row: {
          display_name: string
          game_id: string
          id: string
          joined_at: string
          seat_index: number
          turn_order_index: number | null
        }
        Insert: {
          display_name: string
          game_id: string
          id?: string
          joined_at?: string
          seat_index: number
          turn_order_index?: number | null
        }
        Update: {
          display_name?: string
          game_id?: string
          id?: string
          joined_at?: string
          seat_index?: number
          turn_order_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "game_player_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "game"
            referencedColumns: ["id"]
          },
        ]
      }
      game_rack: {
        Row: {
          controller_player_id: string
          created_at: string
          game_id: string
          id: string
          rack_index: number
        }
        Insert: {
          controller_player_id: string
          created_at?: string
          game_id: string
          id?: string
          rack_index: number
        }
        Update: {
          controller_player_id?: string
          created_at?: string
          game_id?: string
          id?: string
          rack_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_rack_game_id_controller_player_id_fkey"
            columns: ["game_id", "controller_player_id"]
            isOneToOne: false
            referencedRelation: "game_player"
            referencedColumns: ["game_id", "id"]
          },
          {
            foreignKeyName: "game_rack_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "game"
            referencedColumns: ["id"]
          },
        ]
      }
      game_tile: {
        Row: {
          cut_at: string | null
          game_id: string
          id: string
          is_cut: boolean
          is_revealed: boolean
          rack_id: string
          rack_position: number
          revealed_at: string | null
          wire_rank: number
          wire_type: Database["public"]["Enums"]["wire_type"]
        }
        Insert: {
          cut_at?: string | null
          game_id: string
          id?: string
          is_cut?: boolean
          is_revealed?: boolean
          rack_id: string
          rack_position: number
          revealed_at?: string | null
          wire_rank: number
          wire_type: Database["public"]["Enums"]["wire_type"]
        }
        Update: {
          cut_at?: string | null
          game_id?: string
          id?: string
          is_cut?: boolean
          is_revealed?: boolean
          rack_id?: string
          rack_position?: number
          revealed_at?: string | null
          wire_rank?: number
          wire_type?: Database["public"]["Enums"]["wire_type"]
        }
        Relationships: [
          {
            foreignKeyName: "game_tile_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "game"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_tile_game_id_rack_id_fkey"
            columns: ["game_id", "rack_id"]
            isOneToOne: false
            referencedRelation: "game_rack"
            referencedColumns: ["game_id", "id"]
          },
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
      action_outcome: "correct" | "incorrect" | "hit_red" | "win" | "lose"
      game_action_type: "starting_hint" | "guess" | "solo_cut"
      game_status:
        | "lobby"
        | "setup"
        | "in_progress"
        | "won"
        | "lost"
        | "cancelled"
      wire_type: "blue" | "yellow" | "red"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

