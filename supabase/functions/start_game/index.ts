import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import type { StartGameRequest } from "../_shared/contracts.ts";
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

  let requestBody: StartGameRequest;

  try {
    requestBody = await readJsonRequestBody<StartGameRequest>(request);
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
  // TODO: Validate the final player count, captain assignment, and lobby settings.
  // TODO: Derive turn_order_index, rack allocation, and detonator_limit.
  // TODO: Create game_rack and game_tile rows, then move the game to setup.
  return createErrorResponse(
    501,
    "not_implemented",
    "start_game has been scaffolded but is not implemented yet.",
    { function_name: "start_game" },
  );
});
