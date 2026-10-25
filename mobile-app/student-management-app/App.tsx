import React, { useEffect, useState, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { flushQueue } from "./src/api/wrapper/apiQueue";
import NavigationStack from "./NavigationStack";
import { getActiveRouteName } from "./src/utils/navigation";
import {
  startLocationTracking,
  stopLocationTracking,
} from "./src/utils/locationTracker";

const LAST_ROUTE_KEY = "LAST_ROUTE_NAME";
const LAST_ACTIVE_DATE_KEY = "LAST_ACTIVE_DATE";

export const navigationRef = createNavigationContainerRef<any>();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | undefined>(undefined);
  const routeNameRef = useRef<string>("");
  const midnightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper to get today's date in YYYY-MM-DD
  const getTodayDateString = () => new Date().toISOString().slice(0, 10);

  // Check if date has crossed midnight and reset to CheckIn if needed
  const checkMidnightReset = async () => {
    try {
      const studentId = await AsyncStorage.getItem("student_id");
      if (!studentId) return;

      const lastActiveDate = await AsyncStorage.getItem(LAST_ACTIVE_DATE_KEY);
      const today = getTodayDateString();

      if (lastActiveDate && lastActiveDate !== today) {
        console.log("🕛 New day detected (past midnight). Resetting to CheckIn screen.");
        await AsyncStorage.setItem(LAST_ACTIVE_DATE_KEY, today);
        await AsyncStorage.setItem(LAST_ROUTE_KEY, "CheckIn");

        if (navigationRef.isReady()) {
          navigationRef.reset({
            index: 0,
            routes: [{ name: "CheckIn" }],
          });
        }
      } else if (!lastActiveDate) {
        await AsyncStorage.setItem(LAST_ACTIVE_DATE_KEY, today);
      }
    } catch (err) {
      console.warn("Midnight check error:", err);
    }
  };

  // Schedule timer to trigger right after midnight
  const scheduleMidnightTimer = () => {
    if (midnightTimerRef.current) {
      clearTimeout(midnightTimerRef.current);
    }

    const now = new Date();
    const tomorrowMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      2
    );
    const msUntilMidnight = tomorrowMidnight.getTime() - now.getTime();

    midnightTimerRef.current = setTimeout(async () => {
      await checkMidnightReset();
      scheduleMidnightTimer(); // Reschedule for next day
    }, msUntilMidnight);
  };

  useEffect(() => {
    // 1. Initial route determination with midnight reset check
    (async () => {
      const studentId = await AsyncStorage.getItem("student_id");
      const savedRoute = await AsyncStorage.getItem(LAST_ROUTE_KEY);
      const lastActiveDate = await AsyncStorage.getItem(LAST_ACTIVE_DATE_KEY);
      const today = getTodayDateString();

      if (!studentId) {
        setInitialRoute("Welcome");
        await AsyncStorage.setItem(LAST_ACTIVE_DATE_KEY, today);
        return;
      }

      // If opening on a new day, always reset to CheckIn
      if (lastActiveDate && lastActiveDate !== today) {
        console.log("🕛 Opening app on new day. Routing to CheckIn.");
        await AsyncStorage.setItem(LAST_ACTIVE_DATE_KEY, today);
        await AsyncStorage.setItem(LAST_ROUTE_KEY, "CheckIn");
        setInitialRoute("CheckIn");
      } else {
        await AsyncStorage.setItem(LAST_ACTIVE_DATE_KEY, today);
        setInitialRoute(savedRoute || "CheckIn");
      }
    })();

    // 2. Schedule live midnight timer
    scheduleMidnightTimer();

    return () => {
      if (midnightTimerRef.current) {
        clearTimeout(midnightTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Auto-flush API queue when connectivity is restored
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        flushQueue();
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to AppState changes (start location tracking when in use, pause when in background to save battery)
  useEffect(() => {
    startLocationTracking();

    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          // App brought back to foreground: check midnight reset and resume 5-min location tracking
          checkMidnightReset();
          startLocationTracking();
        } else {
          // App sent to background/closed: pause tracking to prevent battery drain
          stopLocationTracking();
        }
      }
    );

    return () => {
      subscription.remove();
      stopLocationTracking();
    };
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = initialRoute;
      }}
      onStateChange={async (state) => {
        const currentRoute = getActiveRouteName(state);
        if (currentRoute && routeNameRef.current !== currentRoute) {
          routeNameRef.current = currentRoute;
          await AsyncStorage.setItem(LAST_ROUTE_KEY, currentRoute);
        }
      }}
    >
      <StatusBar style="light" />
      <NavigationStack initialRoute={initialRoute} />
    </NavigationContainer>
  );
}