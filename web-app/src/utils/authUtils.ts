// authUtils.ts - Supports both local development switch and Azure managed auth
import Cookies from "js-cookie";

export interface UserInfo {
  first_name?: string;
  last_name?: string;
  email?: string;
}

/**
 * Local auth switch helper:
 * Returns true if running locally (localhost / 127.0.0.1) or if VITE_ENABLE_LOCAL_AUTH=true.
 * Can be explicitly disabled by setting VITE_ENABLE_LOCAL_AUTH=false.
 */
export function isLocalAuth(): boolean {
  if (typeof window !== "undefined") {
    // Check runtime window config if injected
    const winConfig = window.config?.VITE_ENABLE_LOCAL_AUTH;
    if (winConfig === "false") return false;
    if (winConfig === "true") return true;

    // Check Vite environment variable
    const envVal = import.meta.env?.VITE_ENABLE_LOCAL_AUTH;
    if (envVal === "false") return false;
    if (envVal === "true") return true;

    // Fall back to detecting localhost / 127.0.0.1
    const host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1";
  }
  return false;
}

export const MOCK_LOCAL_USER: UserInfo = {
  first_name: "Local",
  last_name: "Admin",
  email: "admin@sjdsf.local",
};

export function login() {
  if (isLocalAuth()) {
    storeUserInfo(MOCK_LOCAL_USER);
    window.location.href = "/dashboard";
    return;
  }
  // On Azure Static Web Apps, the native Microsoft Entra ID route is /.auth/login/aad
  window.location.href = "/.auth/login/aad?post_login_redirect_uri=/dashboard";
}

export function logout() {
  clearStoredUserInfo();

  if (isLocalAuth()) {
    window.location.href = "/";
    return;
  }

  // On Azure Static Web Apps, native logout route is /.auth/logout
  window.location.href = "/.auth/logout?post_logout_redirect_uri=/";
}

export function getUserInfoFromCookie(): UserInfo | null {
  const encodedUserInfo = Cookies.get("userinfo");
  if (encodedUserInfo) {
    try {
      const userInfo = JSON.parse(atob(encodedUserInfo));
      Cookies.remove("userinfo", { path: "/" });
      return userInfo;
    } catch {
      Cookies.remove("userinfo", { path: "/" });
      return null;
    }
  }

  return null;
}

export async function getUserInfoFromEndpoint(): Promise<UserInfo | null> {
  if (isLocalAuth()) {
    return MOCK_LOCAL_USER;
  }

  // 1. Try Azure Static Web Apps built-in auth endpoint (/.auth/me)
  try {
    const res = await fetch("/.auth/me");
    if (res.ok) {
      const data = await res.json();
      if (data?.clientPrincipal) {
        const principal = data.clientPrincipal;
        const email = principal.userDetails || "";
        const nameClaim = principal.claims?.find(
          (c: any) => c.typ === "name" || c.typ?.endsWith("/name")
        )?.val || "";
        const givenName = principal.claims?.find(
          (c: any) => c.typ === "given_name" || c.typ?.endsWith("/givenname")
        )?.val || "";
        const surname = principal.claims?.find(
          (c: any) => c.typ === "family_name" || c.typ?.endsWith("/surname")
        )?.val || "";

        const nameParts = nameClaim ? nameClaim.split(" ") : [];
        const firstName = givenName || nameParts[0] || (email ? email.split("@")[0] : "User");
        const lastName = surname || nameParts.slice(1).join(" ") || "";

        return {
          first_name: firstName,
          last_name: lastName,
          email: email,
        };
      }
    }
  } catch (err) {
    console.debug("Failed to fetch from /.auth/me:", err);
  }

  // 2. Fall back to /auth/userinfo endpoint (Azure or local proxy)
  try {
    const response = await fetch("/auth/userinfo");
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch {
    return null;
  }
}

// Utility functions for user info persistence
export function storeUserInfo(userInfo: UserInfo): void {
  const userInfoString = JSON.stringify(userInfo);
  localStorage.setItem("userInfo", userInfoString);
  sessionStorage.setItem("userInfo", userInfoString);
}

export function getStoredUserInfo(): UserInfo | null {
  // Try localStorage first
  let userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    try {
      return JSON.parse(userInfo);
    } catch {
      localStorage.removeItem("userInfo");
    }
  }

  // Try sessionStorage as fallback
  userInfo = sessionStorage.getItem("userInfo");
  if (userInfo) {
    try {
      return JSON.parse(userInfo);
    } catch {
      sessionStorage.removeItem("userInfo");
    }
  }

  return null;
}

export function clearStoredUserInfo(): void {
  localStorage.removeItem("userInfo");
  sessionStorage.removeItem("userInfo");
}

// Main function to get user info from any available source
export async function getUserInfo(): Promise<UserInfo | null> {
  // First, check if we have stored user info
  let userInfo = getStoredUserInfo();
  if (userInfo) {
    return userInfo;
  }

  // If not in storage, try cookie
  userInfo = getUserInfoFromCookie();
  if (userInfo) {
    storeUserInfo(userInfo);
    return userInfo;
  }

  // If not in cookie, try endpoint
  userInfo = await getUserInfoFromEndpoint();
  if (userInfo) {
    storeUserInfo(userInfo);
    return userInfo;
  }

  // If local auth switch is active and still no user found, return mock user
  if (isLocalAuth()) {
    storeUserInfo(MOCK_LOCAL_USER);
    return MOCK_LOCAL_USER;
  }

  return null;
}

export async function performGet(url: string) {
  try {
    const response = await fetch(url);
    if (response.status === 401) {
      clearStoredUserInfo();
      if (!isLocalAuth()) {
        login();
      } else {
        window.location.href = "/";
      }
    }
    return response;
  } catch (error) {
    throw error;
  }
}
