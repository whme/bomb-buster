import type {
  EdgeFunctionErrorResponse,
  EdgeFunctionSuccessResponse,
  SupabaseJson,
} from "./contracts.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
} as const;

export function createOptionsResponse(): Response {
  return new Response("ok", { headers: corsHeaders });
}

export function createJsonResponse(
  responseBody: unknown,
  statusCode = 200,
): Response {
  return new Response(JSON.stringify(responseBody), {
    status: statusCode,
    headers: corsHeaders,
  });
}

export function createSuccessResponse<ResponseData>(
  responseData: ResponseData,
  statusCode = 200,
): Response {
  const responseBody: EdgeFunctionSuccessResponse<ResponseData> = {
    ok: true,
    data: responseData,
  };

  return createJsonResponse(responseBody, statusCode);
}

export function createErrorResponse<ErrorCode extends string>(
  statusCode: number,
  errorCode: ErrorCode,
  errorMessage: string,
  errorDetails?: SupabaseJson,
): Response {
  const responseBody: EdgeFunctionErrorResponse<ErrorCode> = {
    ok: false,
    error:
      errorDetails === undefined
        ? { code: errorCode, message: errorMessage }
        : { code: errorCode, message: errorMessage, details: errorDetails },
  };

  return createJsonResponse(responseBody, statusCode);
}

export function createMethodNotAllowedResponse(): Response {
  return createErrorResponse(
    405,
    "method_not_allowed",
    "Only POST requests are supported.",
  );
}

export async function readJsonRequestBody<RequestBody>(
  request: Request,
): Promise<RequestBody> {
  return (await request.json()) as RequestBody;
}
