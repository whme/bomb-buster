import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import type { CreateGameRequest } from "../_shared/contracts.ts";
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
  void supabaseClient;

  // TODO: Create the game row with default settings.
  // TODO: Create the host game_player row in the same transaction.
  // TODO: Set host_player_id and captain_player_id to the host player.
  // TODO: Return the lobby snapshot and host player session.
  return createErrorResponse(
    501,
    "not_implemented",
    "create_game has been scaffolded but is not implemented yet.",
    { function_name: "create_game" },
  );
});
