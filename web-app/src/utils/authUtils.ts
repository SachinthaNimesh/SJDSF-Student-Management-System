// authUtils.ts - Supports both local development switch and Azure/Choreo managed auth
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
  window.location.href = "/auth/login";
}

export function logout() {
  clearStoredUserInfo();

  if (isLocalAuth()) {
    window.location.href = "/";
    return;
  }

  const sessionHint = Cookies.get("session_hint");
  window.location.href = `/auth/logout${sessionHint ? `?session_hint=${sessionHint}` : ""}`;
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
        window.location.href = "/auth/login";
      } else {
        window.location.href = "/";
      }
    }
    return response;
  } catch (error) {
    throw error;
  }
}
