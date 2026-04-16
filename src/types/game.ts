export type GameStatus =
  | "lobby"
  | "in_progress"
  | "won"
  | "lost"
  | "cancelled";

export type WireType = "blue" | "yellow" | "red";

export type ActionType = "hint" | "guess" | "solo_cut";

export type ActionOutcome =
  | "correct"
  | "incorrect"
  | "hit_red"
  | "win"
  | "lose";

export interface Game {
  id: string;
  invite_code: string;
  host_user_id: string;
  status: GameStatus;
  current_turn_rack_id: string | null;
  turn_number: number;
  detonator_step: number;
  detonator_limit: number;
  red_wire_count: number;
  yellow_wire_count: number;
  next_yellow_rank: number;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GameUser {
  game_id: string;
  user_id: string;
  seat_index: number;
  joined_at: string;
}

export interface GameRack {
  id: string;
  game_id: string;
  rack_index: number;
  controller_user_id: string;
  created_at: string;
}

export interface GameTile {
  id: string;
  game_id: string;
  rack_id: string;
  rack_position: number;
  wire_type: WireType;
  wire_rank: number;
  is_revealed: boolean;
  is_cut: boolean;
  revealed_at: string | null;
  cut_at: string | null;
}

export interface GameAction {
  id: string;
  game_id: string;
  turn_number: number;
  actor_user_id: string;
  actor_rack_id: string;
  action_type: ActionType;
  target_rack_id: string;
  target_tile_id: string;
  declared_wire_type: WireType | null;
  declared_wire_rank: number | null;
  outcome: ActionOutcome;
  detonator_step_change: number;
  affected_tiles: AffectedTile[];
  created_at: string;
}

export interface AffectedTile {
  tile_id: string;
  effect: "targeted" | "revealed" | "cut";
}

export interface AppUser {
  id: string;
  display_name: string;
  created_at: string;
}

export interface GameUserWithName extends GameUser {
  app_user: Pick<AppUser, "display_name">;
}

export interface GameSettings {
  red_wire_count: number;
  yellow_wire_count: number;
}
