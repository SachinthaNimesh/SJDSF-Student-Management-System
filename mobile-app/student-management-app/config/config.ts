import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Production Hosted Azure App Service Backend URL
 */
export const AZURE_PRODUCTION_URL =
  "https://worky-backend-ftc9fbeedke6eaey.southindia-01.azurewebsites.net";

/**
 * Local / Cloud Switch:
 * - Set `IS_LOCAL = false` to connect to the hosted Azure App Service backend.
 * - Set `IS_LOCAL = true` for local development against a local Go server.
 * - Can also be overridden at build time via `EXPO_PUBLIC_IS_LOCAL`.
 */
export const IS_LOCAL =
  process.env.EXPO_PUBLIC_IS_LOCAL === "true" ? true : false;

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

/**
 * Hosted Cloud Backend URL:
 * Defaults to the production Azure App Service.
 * Can also be overridden at build time via `EXPO_PUBLIC_API_URL`.
 */
export const CLOUD_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || AZURE_PRODUCTION_URL;

/**
 * Active API Base URL across all mobile services
 */
export const BASE_URL = IS_LOCAL ? LOCAL_BASE_URL : CLOUD_BASE_URL;

