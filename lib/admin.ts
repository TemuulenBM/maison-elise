import { createServerClient } from "@/lib/supabase/server";

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);
}

/**
 * Returns the authenticated user if they are an admin, otherwise null.
 * Fails closed: if ADMIN_EMAILS is not set, no one is granted admin access.
 */
export async function requireAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const adminEmails = getAdminEmails();
  if (!adminEmails.includes(user.email ?? "")) return null;
  return user;
}
