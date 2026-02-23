import { handleCors } from "./cors.ts";
import { verifyAuth } from "./auth.ts";
import { formatBillsResponse, createErrorResponse } from "./response.ts";

// @ts-ignore - Deno is available in Supabase Edge Functions runtime
Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const authResult = await verifyAuth(req);
  if ("error" in authResult) {
    return authResult.error;
  }

  const { user, supabase } = authResult;

  const { data, error } = await supabase.rpc("get_my_bills");

  if (error) {
    return createErrorResponse(error.message, 400, req);
  }

  return formatBillsResponse(data, req);
});
