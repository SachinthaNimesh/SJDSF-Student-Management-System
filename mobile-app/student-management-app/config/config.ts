/**
 * Local switch to run locally without Azure/Choreo cloud backend
 * Set `IS_LOCAL = true` for local development against local Go server (default: port 8080)
 * Set `IS_LOCAL = false` for production Choreo deployment
 */
export const IS_LOCAL = true;

/**
 * Configure your local development host:
 * - "localhost": iOS simulator, Web preview, or adb reverse port forwarding
 * - "10.0.2.2": Android Studio Emulator default host loopback
 * - "<your-lan-ip>": (e.g. "192.168.1.15") Physical device running Expo Go on the same Wi-Fi
 */
export const LOCAL_HOST = "localhost";
export const LOCAL_PORT = "8080";

export const LOCAL_BASE_URL = `http://${LOCAL_HOST}:${LOCAL_PORT}`;
export const CHOREO_BASE_URL =
  "https://87e89eab-95e5-4c0f-8192-7ee0196e1581-prod.e1-us-east-azure.choreoapis.dev/student-management-system/backend/v1.0";

export const BASE_URL = IS_LOCAL ? LOCAL_BASE_URL : CHOREO_BASE_URL;
