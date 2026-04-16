import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import type { BeginPlayRequest } from "../_shared/contracts.ts";
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

  let requestBody: BeginPlayRequest;

  try {
    requestBody = await readJsonRequestBody<BeginPlayRequest>(request);
  } catch {
    return createErrorResponse(
      400,
      "invalid_json",
      "Request body must be valid JSON.",
    );
  }

  if (!isNonEmptyString(requestBody.game_id)) {
    return createErrorResponse(
      400,
      "invalid_request",
      "game_id must be a non-empty string.",
    );
  }

  if (!isNonEmptyString(requestBody.player_id)) {
    return createErrorResponse(
      400,
      "invalid_request",
      "player_id must be a non-empty string.",
    );
  }

  const supabaseClient = createServiceRoleClient();
  void supabaseClient;

  // TODO: Lock the game row and verify the caller is the host.
  // TODO: Verify the game is in setup and every rack has exactly one starting hint.
  // TODO: Set current_turn_player_id to captain_player_id, turn_number to 1, and started_at.
  // TODO: Move the game to in_progress and return the first-turn snapshot.
  return createErrorResponse(
    501,
    "not_implemented",
    "begin_play has been scaffolded but is not implemented yet.",
    { function_name: "begin_play" },
  );
});
