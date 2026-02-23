// @ts-ignore - Deno-style import works in Supabase Edge Functions runtime
import { createClient, type User, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "./cors.ts";

export async function verifyAuth(req: Request): Promise<{ user: User; supabase: SupabaseClient } | { error: Response }> {
  const authHeader = req.headers.get("Authorization") || 
                     req.headers.get("authorization") ||
                     "";

  if (!authHeader) {
    return {
      error: new Response(
        JSON.stringify({ error: "Missing Authorization header" }), 
        {
          status: 401,
          headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        }
      )
    };
  }

  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    return {
      error: new Response(
        JSON.stringify({ error: "Invalid token format" }), 
        {
          status: 401,
          headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        }
      )
    };
  }

  // @ts-ignore - Deno is available in Supabase Edge Functions runtime
  const supabase = createClient(
    // @ts-ignore
    Deno.env.get("SUPABASE_URL")!,
    // @ts-ignore
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return {
      error: new Response(
        JSON.stringify({ 
          error: "Invalid or expired token",
          details: authError?.message 
        }), 
        {
          status: 401,
          headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        }
      )
    };
  }

  return { user, supabase };
}
