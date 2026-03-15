import { createClient } from "@supabase/supabase-js"

// Server-side Supabase client (service role — бүрэн эрхтэй, RLS алгасна)
// Auth-д ХЭРЭГЛЭХГҮЙ — зөвхөн admin operations-д (webhook, cron, seed)
// Auth-д lib/supabase/server.ts эсвэл lib/supabase/client.ts ашиглана
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
