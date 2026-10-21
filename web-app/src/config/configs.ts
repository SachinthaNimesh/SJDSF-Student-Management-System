export const API_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "/choreo-apis/student-management-system/backend/v1";
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
  VITE_AZURE_CLIENT_ID: windowConfig.VITE_AZURE_CLIENT_ID || (import.meta.env?.VITE_AZURE_CLIENT_ID as string) || "",
  VITE_AZURE_TENANT_ID: windowConfig.VITE_AZURE_TENANT_ID || (import.meta.env?.VITE_AZURE_TENANT_ID as string) || "",
  VITE_ENABLE_LOCAL_AUTH: windowConfig.VITE_ENABLE_LOCAL_AUTH || (import.meta.env?.VITE_ENABLE_LOCAL_AUTH as string) || "",
  apiUrl: windowConfig.apiUrl || (import.meta.env?.VITE_API_URL as string) || API_URL,
  VITE_GOOGLE_SHEET_API_KEY: windowConfig.VITE_GOOGLE_SHEET_API_KEY || (import.meta.env?.VITE_GOOGLE_SHEET_API_KEY as string) || "",
};
