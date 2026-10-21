import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Local switch to run locally without Azure/Choreo cloud backend
 * Set `IS_LOCAL = true` for local development against local Go server (default: port 8080)
 * Set `IS_LOCAL = false` for production Choreo deployment
 */
export const IS_LOCAL = true;

/**
 * Auto-detect local development host:
 * - When running on a physical phone via Expo Go, dynamically uses your computer's LAN IP
 * - When running on Android Studio Emulator, falls back to 10.0.2.2
 * - When running on iOS Simulator or Web, falls back to localhost
 */
const metroHost = Constants.expoConfig?.hostUri?.split(":")[0];

export const LOCAL_HOST =
  metroHost || (Platform.OS === "android" ? "10.0.2.2" : "localhost");
export const LOCAL_PORT = "8080";

export const LOCAL_BASE_URL = `http://${LOCAL_HOST}:${LOCAL_PORT}`;
export const CHOREO_BASE_URL =
  "https://87e89eab-95e5-4c0f-8192-7ee0196e1581-prod.e1-us-east-azure.choreoapis.dev/student-management-system/backend/v1.0";

export const BASE_URL = IS_LOCAL ? LOCAL_BASE_URL : CHOREO_BASE_URL;
