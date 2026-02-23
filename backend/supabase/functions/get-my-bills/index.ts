import { handleCors } from "./cors.ts";
import { verifyAuth } from "./auth.ts";
import { formatBillsResponse, createErrorResponse } from "./response.ts";

// @ts-ignore - Deno is available in Supabase Edge Functions runtime
Deno.serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Verify authentication
  const authResult = await verifyAuth(req);
  if ("error" in authResult) {
    return authResult.error;
  }

  const { user, supabase } = authResult;

  // Make the RPC call
  const { data, error } = await supabase.rpc("get_my_bills");

  if (error) {
    return createErrorResponse(error.message, 400);
  }

  return formatBillsResponse(data);
});
