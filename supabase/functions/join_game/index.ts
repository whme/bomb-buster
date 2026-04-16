import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import type {
  JoinGameLobbyResultRow,
  JoinGameRequest,
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

  let requestBody: JoinGameRequest;

  try {
    requestBody = await readJsonRequestBody<JoinGameRequest>(request);
  } catch {
    return createErrorResponse(
      400,
      "invalid_json",
      "Request body must be valid JSON.",
    );
  }

  if (!isNonEmptyString(requestBody.invite_code)) {
    return createErrorResponse(
      400,
      "invalid_request",
      "invite_code must be a non-empty string.",
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
  const normalizedInviteCode = requestBody.invite_code.trim().toUpperCase();
  const trimmedDisplayName = requestBody.display_name.trim();

  const {
    data: joinGameLobbyResult,
    error: joinGameLobbyError,
  } = await supabaseClient
    .rpc("join_game_lobby", {
      invite_code_input: normalizedInviteCode,
      display_name_input: trimmedDisplayName,
    })
    .single<JoinGameLobbyResultRow>();

  if (joinGameLobbyError) {
    if (joinGameLobbyError.code === "P0001") {
      if (joinGameLobbyError.message === "game_not_found") {
        return createErrorResponse(
          404,
          "game_not_found",
          "No game exists for the provided invite code.",
        );
      }

      if (joinGameLobbyError.message === "invalid_status") {
        return createErrorResponse(
          409,
          "invalid_status",
          "The game is no longer joinable.",
        );
      }

      if (joinGameLobbyError.message === "game_full") {
        return createErrorResponse(
          409,
          "game_full",
          "The game already has the maximum number of players.",
        );
      }

      if (joinGameLobbyError.message === "display_name_taken") {
        return createErrorResponse(
          409,
          "display_name_taken",
          "That display name is already taken in this game.",
        );
      }

      if (joinGameLobbyError.message === "display_name_invalid") {
        return createErrorResponse(
          400,
          "display_name_invalid",
          "display_name must be a non-empty string.",
        );
      }
    }

    if (joinGameLobbyError.code === "23505") {
      return createErrorResponse(
        409,
        "display_name_taken",
        "That display name is already taken in this game.",
      );
    }

    console.error("join_game RPC failed", joinGameLobbyError);
    return createErrorResponse(
      500,
      "invalid_request",
      "Failed to join game.",
      {
        code: joinGameLobbyError.code,
        details: joinGameLobbyError.details,
        hint: joinGameLobbyError.hint,
        message: joinGameLobbyError.message,
      },
    );
  }

  return createSuccessResponse({
    game: {
      game_id: joinGameLobbyResult.game_id,
      invite_code: joinGameLobbyResult.invite_code,
      status: joinGameLobbyResult.status,
      settings: {
        captain_player_id: joinGameLobbyResult.captain_player_id,
        red_wire_count: joinGameLobbyResult.red_wire_count,
        yellow_wire_count: joinGameLobbyResult.yellow_wire_count,
      },
    },
    player: {
      player_id: joinGameLobbyResult.player_id,
      display_name: joinGameLobbyResult.display_name,
      seat_index: joinGameLobbyResult.seat_index,
    },
  });
});
