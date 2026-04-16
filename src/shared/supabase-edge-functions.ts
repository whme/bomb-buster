import type {
  GamePlayerRow,
  GameRow,
  GameStatus,
  GameTileRow,
  LobbyGameSnapshot,
  GamePlayerSessionSnapshot,
  GameSettingsSnapshot,
  SupabaseJson,
} from "./supabase-schema.ts";

export const gameEdgeFunctionNames = {
  create_game: "create_game",
  join_game: "join_game",
  update_game_settings: "update_game_settings",
  start_game: "start_game",
  submit_starting_hint: "submit_starting_hint",
  begin_play: "begin_play",
} as const;

export type GameEdgeFunctionName =
  (typeof gameEdgeFunctionNames)[keyof typeof gameEdgeFunctionNames];

export type CommonEdgeFunctionErrorCode =
  | "method_not_allowed"
  | "invalid_json"
  | "invalid_request"
  | "not_implemented";

export interface EdgeFunctionErrorPayload<ErrorCode extends string = string> {
  code: ErrorCode;
  message: string;
  details?: SupabaseJson;
}

export interface EdgeFunctionSuccessResponse<ResponseData> {
  ok: true;
  data: ResponseData;
}

export interface EdgeFunctionErrorResponse<ErrorCode extends string = string> {
  ok: false;
  error: EdgeFunctionErrorPayload<ErrorCode>;
}

export type EdgeFunctionResponse<
  ResponseData,
  ErrorCode extends string = string,
> =
  | EdgeFunctionSuccessResponse<ResponseData>
  | EdgeFunctionErrorResponse<ErrorCode>;

export interface CreateGameRequest {
  display_name: GamePlayerRow["display_name"];
}

export interface CreateGameResponseData {
  game: LobbyGameSnapshot;
  player: GamePlayerSessionSnapshot;
}

export type CreateGameErrorCode =
  | CommonEdgeFunctionErrorCode
  | "display_name_invalid";

export type CreateGameResponse = EdgeFunctionResponse<
  CreateGameResponseData,
  CreateGameErrorCode
>;

export interface JoinGameRequest {
  invite_code: GameRow["invite_code"];
  display_name: GamePlayerRow["display_name"];
}

export interface JoinGameResponseData {
  game: LobbyGameSnapshot;
  player: GamePlayerSessionSnapshot;
}

export type JoinGameErrorCode =
  | CommonEdgeFunctionErrorCode
  | "game_not_found"
  | "invalid_status"
  | "display_name_invalid"
  | "display_name_taken"
  | "game_full";

export type JoinGameResponse = EdgeFunctionResponse<
  JoinGameResponseData,
  JoinGameErrorCode
>;

export interface UpdateGameSettingsRequest extends GameSettingsSnapshot {
  game_id: GameRow["id"];
  player_id: GamePlayerRow["id"];
}

export interface UpdateGameSettingsResponseData {
  game_id: GameRow["id"];
  status: Extract<GameStatus, "lobby">;
  settings: GameSettingsSnapshot;
}

export type UpdateGameSettingsErrorCode =
  | CommonEdgeFunctionErrorCode
  | "game_not_found"
  | "not_host"
  | "invalid_status"
  | "invalid_settings"
  | "invalid_captain_player";

export type UpdateGameSettingsResponse = EdgeFunctionResponse<
  UpdateGameSettingsResponseData,
  UpdateGameSettingsErrorCode
>;

export interface StartGameRequest {
  game_id: GameRow["id"];
  player_id: GamePlayerRow["id"];
}

export interface StartGameResponseData {
  game_id: GameRow["id"];
  status: Extract<GameStatus, "setup">;
  player_count: number;
  rack_count: number;
}

export type StartGameErrorCode =
  | CommonEdgeFunctionErrorCode
  | "game_not_found"
  | "not_host"
  | "invalid_status"
  | "invalid_player_count"
  | "invalid_captain_player"
  | "invalid_settings";

export type StartGameResponse = EdgeFunctionResponse<
  StartGameResponseData,
  StartGameErrorCode
>;

export interface SubmitStartingHintRequest {
  game_id: GameRow["id"];
  player_id: GamePlayerRow["id"];
  tile_id: GameTileRow["id"];
}

export interface SubmitStartingHintResponseData {
  game_id: GameRow["id"];
  status: Extract<GameStatus, "setup">;
  actor_player_id: GamePlayerRow["id"];
  actor_rack_id: string;
  tile_id: GameTileRow["id"];
}

export type SubmitStartingHintErrorCode =
  | CommonEdgeFunctionErrorCode
  | "game_not_found"
  | "invalid_status"
  | "tile_not_found"
  | "not_tile_controller"
  | "tile_already_revealed"
  | "starting_hint_already_submitted";

export type SubmitStartingHintResponse = EdgeFunctionResponse<
  SubmitStartingHintResponseData,
  SubmitStartingHintErrorCode
>;

export interface BeginPlayRequest {
  game_id: GameRow["id"];
  player_id: GamePlayerRow["id"];
}

export interface BeginPlayResponseData {
  game_id: GameRow["id"];
  status: Extract<GameStatus, "in_progress">;
  turn_number: GameRow["turn_number"];
  current_turn_player_id: GameRow["current_turn_player_id"];
}

export type BeginPlayErrorCode =
  | CommonEdgeFunctionErrorCode
  | "game_not_found"
  | "not_host"
  | "invalid_status"
  | "missing_starting_hints";

export type BeginPlayResponse = EdgeFunctionResponse<
  BeginPlayResponseData,
  BeginPlayErrorCode
>;
