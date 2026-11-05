const isBrowser = typeof window !== "undefined";
const isLocalhost =
  isBrowser &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

// Production Azure App Service backend URL
export const PRODUCTION_API_URL =
  "https://worky-backend-ftc9fbeedke6eaey.southindia-01.azurewebsites.net";

function getBaseApiUrl(): string {
  // 1. Check window runtime override (if injected via config.js)
  if (
    isBrowser &&
    window.config?.apiUrl &&
    !window.config.apiUrl.startsWith("/choreo-apis")
  ) {
    if (isLocalhost || !window.config.apiUrl.includes("localhost")) {
      return window.config.apiUrl.replace(/\/+$/, "");
    }
  }

  // 2. Check Vite build-time environment variable
  const envUrl =
    typeof import.meta !== "undefined"
      ? (import.meta.env?.VITE_API_URL as string | undefined)
      : undefined;

  if (
    envUrl &&
    typeof envUrl === "string" &&
    envUrl.trim() !== "" &&
    !envUrl.startsWith("/choreo-apis")
  ) {
    if (isLocalhost || !envUrl.includes("localhost")) {
      return envUrl.trim().replace(/\/+$/, "");
    }
  }

  // 3. Dynamic fallback:
  // If running on localhost -> http://localhost:8080
  // If running in cloud (Azure Static Web Apps) -> Azure App Service backend
  return isLocalhost ? "http://localhost:8080" : PRODUCTION_API_URL;
}

export const API_URL = getBaseApiUrl();

export const SUMMARIZER_API_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUMMARIZER_API_URL) ||
  "/choreo-apis/student-management-system/summarizer/v1";

declare global {
  interface Window {
    config?: {
      VITE_API_KEY?: string;
      VITE_AZURE_CLIENT_ID?: string;
      VITE_AZURE_TENANT_ID?: string;
      VITE_ENABLE_LOCAL_AUTH?: string;
      apiUrl?: string;
      VITE_GOOGLE_SHEET_API_KEY?: string;
    };
  }
}

const windowConfig = (typeof window !== "undefined" && window.config) ? window.config : {};

export const appConfig = {
  VITE_API_KEY: windowConfig.VITE_API_KEY || (import.meta.env?.VITE_API_KEY as string) || "",
  VITE_AZURE_CLIENT_ID: windowConfig.VITE_AZURE_CLIENT_ID || (import.meta.env?.VITE_AZURE_CLIENT_ID as string) || "5c56226d-c941-438d-b0f6-4bd91f58d758",
  VITE_AZURE_TENANT_ID: windowConfig.VITE_AZURE_TENANT_ID || (import.meta.env?.VITE_AZURE_TENANT_ID as string) || "14f8f366-8606-428d-a5c7-91c275bcfdf8",
  VITE_ENABLE_LOCAL_AUTH: windowConfig.VITE_ENABLE_LOCAL_AUTH || (import.meta.env?.VITE_ENABLE_LOCAL_AUTH as string) || "",
  apiUrl: API_URL,
  VITE_GOOGLE_SHEET_API_KEY: windowConfig.VITE_GOOGLE_SHEET_API_KEY || (import.meta.env?.VITE_GOOGLE_SHEET_API_KEY as string) || "",
};
