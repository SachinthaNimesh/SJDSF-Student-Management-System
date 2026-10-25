import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postLocationPing } from '../api/attendanceService';

let trackingInterval: ReturnType<typeof setInterval> | null = null;
let isTracking = false;

// 5-minute interval in milliseconds
const INTERVAL_MS = 5 * 60 * 1000;

/**
 * Captures the current location with battery-saving balanced accuracy
 * and transmits it to the backend via offline-ready queue.
 */
export const sendLocationUpdate = async () => {
  try {
    const studentId = await AsyncStorage.getItem('student_id');
    if (!studentId) return;

    // Check permission
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      const req = await Location.requestForegroundPermissionsAsync();
      if (req.status !== 'granted') return;
    }

    // Battery efficiency: Location.Accuracy.Balanced (~100m) uses cell/Wi-Fi positioning,
    // avoiding the power-hungry GPS radio hardware.
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    if (position?.coords) {
      const { latitude, longitude, accuracy } = position.coords;
      await postLocationPing(latitude, longitude, accuracy ?? undefined);
    }
  } catch (err) {
    console.warn('Location tracker error:', err);
  }
};

/**
 * Starts 5-minute periodic location updates while the app is in use.
 */
export const startLocationTracking = () => {
  if (isTracking && trackingInterval) return;

  isTracking = true;

  // Send initial ping immediately upon start
  sendLocationUpdate().catch(() => {});

  // Set recurring 5-minute interval timer
  trackingInterval = setInterval(() => {
    sendLocationUpdate().catch(() => {});
  }, INTERVAL_MS);
};

/**
 * Stops periodic location tracking to save battery.
 */
export const stopLocationTracking = () => {
  if (trackingInterval) {
    clearInterval(trackingInterval);
    trackingInterval = null;
  }
  isTracking = false;
};
