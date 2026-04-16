import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import type { UpdateGameSettingsRequest } from "../_shared/contracts.ts";
import {
  createErrorResponse,
  createMethodNotAllowedResponse,
  createOptionsResponse,
  readJsonRequestBody,
} from "../_shared/http.ts";
import { createServiceRoleClient } from "../_shared/supabase-admin.ts";
import {
  isIntegerWithinRange,
  isNonEmptyString,
} from "../_shared/validation.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return createOptionsResponse();
  }

  if (request.method !== "POST") {
    return createMethodNotAllowedResponse();
  }

  let requestBody: UpdateGameSettingsRequest;

  try {
    requestBody =
      await readJsonRequestBody<UpdateGameSettingsRequest>(request);
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

  if (!isNonEmptyString(requestBody.captain_player_id)) {
    return createErrorResponse(
      400,
      "invalid_captain_player",
      "captain_player_id must be a non-empty string.",
    );
  }

  if (
    !isIntegerWithinRange(requestBody.red_wire_count, 0, 11) ||
    !isIntegerWithinRange(requestBody.yellow_wire_count, 0, 11)
  ) {
    return createErrorResponse(
      400,
      "invalid_settings",
      "red_wire_count and yellow_wire_count must be integers between 0 and 11.",
    );
  }

  const supabaseClient = createServiceRoleClient();
  void supabaseClient;

  // TODO: Lock the game row and verify the caller is the host.
  // TODO: Validate the game is still in lobby.
  // TODO: Verify captain_player_id belongs to the same game.
  // TODO: Persist the new settings and return the normalized lobby settings snapshot.
  return createErrorResponse(
    501,
    "not_implemented",
    "update_game_settings has been scaffolded but is not implemented yet.",
    { function_name: "update_game_settings" },
  );
});
