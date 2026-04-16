import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import type { JoinGameRequest } from "../_shared/contracts.ts";
import {
  createErrorResponse,
  createMethodNotAllowedResponse,
  createOptionsResponse,
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
  void supabaseClient;

  // TODO: Look up the game by invite_code and lock it for join/start coordination.
  // TODO: Validate the game is still in lobby and has capacity for another player.
  // TODO: Enforce normalized display_name uniqueness within the game.
  // TODO: Insert the next game_player row and return the updated lobby snapshot.
  return createErrorResponse(
    501,
    "not_implemented",
    "join_game has been scaffolded but is not implemented yet.",
    { function_name: "join_game" },
  );
});
