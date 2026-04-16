import { supabase } from "./supabase";
import {
  gameEdgeFunctionNames,
  type BeginPlayRequest,
  type BeginPlayResponse,
  type CreateGameRequest,
  type CreateGameResponse,
  type JoinGameRequest,
  type JoinGameResponse,
  type StartGameRequest,
  type StartGameResponse,
  type SubmitStartingHintRequest,
  type SubmitStartingHintResponse,
  type UpdateGameSettingsRequest,
  type UpdateGameSettingsResponse,
  type GameEdgeFunctionName,
} from "../shared/supabase-edge-functions.ts";

async function invokeGameEdgeFunction<RequestBody, ResponseBody>(
  functionName: GameEdgeFunctionName,
  requestBody: RequestBody,
): Promise<ResponseBody> {
  const { data, error } = await supabase.functions.invoke<ResponseBody>(
    functionName,
    { body: requestBody as Record<string, unknown> },
  );

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(`Edge function ${functionName} returned no data.`);
  }

  return data;
}

export function invokeCreateGame(
  requestBody: CreateGameRequest,
): Promise<CreateGameResponse> {
  return invokeGameEdgeFunction<CreateGameRequest, CreateGameResponse>(
    gameEdgeFunctionNames.create_game,
    requestBody,
  );
}

export function invokeJoinGame(
  requestBody: JoinGameRequest,
): Promise<JoinGameResponse> {
  return invokeGameEdgeFunction<JoinGameRequest, JoinGameResponse>(
    gameEdgeFunctionNames.join_game,
    requestBody,
  );
}

export function invokeUpdateGameSettings(
  requestBody: UpdateGameSettingsRequest,
): Promise<UpdateGameSettingsResponse> {
  return invokeGameEdgeFunction<
    UpdateGameSettingsRequest,
    UpdateGameSettingsResponse
  >(gameEdgeFunctionNames.update_game_settings, requestBody);
}

export function invokeStartGame(
  requestBody: StartGameRequest,
): Promise<StartGameResponse> {
  return invokeGameEdgeFunction<StartGameRequest, StartGameResponse>(
    gameEdgeFunctionNames.start_game,
    requestBody,
  );
}

export function invokeSubmitStartingHint(
  requestBody: SubmitStartingHintRequest,
): Promise<SubmitStartingHintResponse> {
  return invokeGameEdgeFunction<
    SubmitStartingHintRequest,
    SubmitStartingHintResponse
  >(gameEdgeFunctionNames.submit_starting_hint, requestBody);
}

export function invokeBeginPlay(
  requestBody: BeginPlayRequest,
): Promise<BeginPlayResponse> {
  return invokeGameEdgeFunction<BeginPlayRequest, BeginPlayResponse>(
    gameEdgeFunctionNames.begin_play,
    requestBody,
  );
}
