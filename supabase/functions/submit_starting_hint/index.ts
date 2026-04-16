import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import type { SubmitStartingHintRequest } from "../_shared/contracts.ts";
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

  let requestBody: SubmitStartingHintRequest;

  try {
    requestBody =
      await readJsonRequestBody<SubmitStartingHintRequest>(request);
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

  if (!isNonEmptyString(requestBody.tile_id)) {
    return createErrorResponse(
      400,
      "invalid_request",
      "tile_id must be a non-empty string.",
    );
  }

  const supabaseClient = createServiceRoleClient();
  void supabaseClient;

  // TODO: Validate the game is in setup and the tile belongs to a rack controlled by the player.
  // TODO: Ensure the rack has not already submitted its starting hint.
  // TODO: Reveal the tile and write a starting_hint game_action with turn_number = 0.
  // TODO: Return the affected tile and rack identifiers.
  return createErrorResponse(
    501,
    "not_implemented",
    "submit_starting_hint has been scaffolded but is not implemented yet.",
    { function_name: "submit_starting_hint" },
  );
});
