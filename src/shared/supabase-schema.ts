import type {
  Database,
  Enums,
  Json,
  Tables,
} from "../../supabase/database.types.ts";

export type SupabaseDatabase = Database;
export type SupabaseJson = Json;
export type PublicSchema = SupabaseDatabase["public"];

export type GameRow = Tables<"game">;
export type GamePlayerRow = Tables<"game_player">;
export type GameRackRow = Tables<"game_rack">;
export type GameTileRow = Tables<"game_tile">;
export type GameActionRow = Tables<"game_action">;

export type GameStatus = Enums<"game_status">;
export type WireType = Enums<"wire_type">;
export type GameActionType = Enums<"game_action_type">;
export type ActionOutcome = Enums<"action_outcome">;

export type PublicFunctionResultRow<
  FunctionName extends keyof PublicSchema["Functions"],
> = PublicSchema["Functions"][FunctionName]["Returns"] extends Array<
  infer ResultRow
>
  ? ResultRow
  : never;

export type CreateGameLobbyResultRow =
  PublicFunctionResultRow<"create_game_lobby">;
export type JoinGameLobbyResultRow = PublicFunctionResultRow<"join_game_lobby">;

export interface GameSettingsSnapshot {
  captain_player_id: GameRow["captain_player_id"];
  red_wire_count: GameRow["red_wire_count"];
  yellow_wire_count: GameRow["yellow_wire_count"];
}

export interface LobbyGameSnapshot {
  game_id: GameRow["id"];
  invite_code: GameRow["invite_code"];
  status: GameRow["status"];
  settings: GameSettingsSnapshot;
}

export interface GamePlayerSessionSnapshot {
  player_id: GamePlayerRow["id"];
  display_name: GamePlayerRow["display_name"];
  seat_index: GamePlayerRow["seat_index"];
}
