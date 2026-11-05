// Runtime configuration injected by deployment platform
// In local development, values will fallback to localhost:8080
const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

window.config = window.config || {
  VITE_API_KEY: "",
  VITE_AZURE_CLIENT_ID: "5c56226d-c941-438d-b0f6-4bd91f58d758",
  VITE_AZURE_TENANT_ID: "14f8f366-8606-428d-a5c7-91c275bcfdf8",
  apiUrl: isLocal ? "http://localhost:8080" : "https://worky-backend-ftc9fbeedke6eaey.southindia-01.azurewebsites.net",
  VITE_GOOGLE_SHEET_API_KEY: ""
};
