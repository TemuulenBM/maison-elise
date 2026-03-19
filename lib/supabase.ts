import { createClient } from "@supabase/supabase-js"

// Server-side Supabase client (service role — full access, bypasses RLS)
// Do NOT use for auth — admin operations only (webhooks, cron, seed)
// For auth, use lib/supabase/server.ts or lib/supabase/client.ts
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
