// Type definitions to replace next-auth types

export type UserType = "guest" | "regular";

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  type?: UserType;
}

export interface Session {
  user: User;
  expires?: string;
}

// Re-export useAuth as useSession for compatibility
export { useAuth as useSession } from "./auth-context";

// Sign out function
export async function signOut(options?: {
  redirect?: boolean;
  callbackUrl?: string;
  redirectTo?: string;
}) {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  const redirectUrl = options?.callbackUrl || options?.redirectTo || "/login";

  if (options?.redirect !== false) {
    window.location.href = redirectUrl;
  }
}
