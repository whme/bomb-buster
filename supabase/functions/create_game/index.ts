import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import type {
  CreateGameLobbyResultRow,
  CreateGameRequest,
} from "../_shared/contracts.ts";
import {
  createErrorResponse,
  createMethodNotAllowedResponse,
  createOptionsResponse,
  createSuccessResponse,
  readJsonRequestBody,
} from "../_shared/http.ts";
import { createServiceRoleClient } from "../_shared/supabase-admin.ts";
import { isNonEmptyString } from "../_shared/validation.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return createOptionsResponse();
  }

  if (request.method !== "POST") {
    return createMethodNotAllowedResponse();
  }

  let requestBody: CreateGameRequest;

  try {
    requestBody = await readJsonRequestBody<CreateGameRequest>(request);
  } catch {
    return createErrorResponse(
      400,
      "invalid_json",
      "Request body must be valid JSON.",
    );
  }

  if (!isNonEmptyString(requestBody.display_name)) {
    return createErrorResponse(
      400,
      "display_name_invalid",
      "display_name must be a non-empty string.",
    );
  }

  const supabaseClient = createServiceRoleClient();
  const trimmedDisplayName = requestBody.display_name.trim();

  const {
    data: createGameLobbyResult,
    error: createGameLobbyError,
  } = await supabaseClient
    .rpc("create_game_lobby", {
      display_name_input: trimmedDisplayName,
    })
    .single<CreateGameLobbyResultRow>();

  if (createGameLobbyError) {
    if (
      createGameLobbyError.code === "P0001" &&
      createGameLobbyError.message === "display_name_invalid"
    ) {
      return createErrorResponse(
        400,
        "display_name_invalid",
        "display_name must be a non-empty string.",
      );
    }

    console.error("create_game RPC failed", createGameLobbyError);
    return createErrorResponse(
      500,
      "invalid_request",
      "Failed to create game.",
      {
        code: createGameLobbyError.code,
        details: createGameLobbyError.details,
        hint: createGameLobbyError.hint,
        message: createGameLobbyError.message,
      },
    );
  }

  return createSuccessResponse({
    game: {
      game_id: createGameLobbyResult.game_id,
      invite_code: createGameLobbyResult.invite_code,
      status: createGameLobbyResult.status,
      settings: {
        captain_player_id: createGameLobbyResult.captain_player_id,
        red_wire_count: createGameLobbyResult.red_wire_count,
        yellow_wire_count: createGameLobbyResult.yellow_wire_count,
      },
    },
    player: {
      player_id: createGameLobbyResult.player_id,
      display_name: createGameLobbyResult.display_name,
      seat_index: createGameLobbyResult.seat_index,
    },
  });
});
