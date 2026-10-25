import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { postCheckIn } from "../api/attendanceService";
import NetInfo from "@react-native-community/netinfo";
import styles from "./CheckInScreen.styles"; 
import { getCurrentLocationOnce } from "../utils/location";
import Loader from "../components/Loader"; 
import OfflineNotice from "../components/OfflineNotice";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const CheckInScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState({
    time: "",
    period: "",
    day: "",
    month: "",
    fullDate: "",
  });

  const [showNoInternet, setShowNoInternet] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const day = now.getDate();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const month = monthNames[now.getMonth()];
      const fullDate = `${month} ${day}, ${now.getFullYear()}`;

      setCurrentDateTime({
        time: `${hours}:${minutes}`,
        period,
        day: day.toString(),
        month,
        fullDate,
      });
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!showNoInternet) return;
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        setShowNoInternet(false);
      }
    });
    return () => unsubscribe();
  }, [showNoInternet]);

  const handleCheckIn = useCallback(async () => {
    if (loading) return; // Prevent multiple check-ins
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setLoading(true);
      setError(null);

      const { latitude, longitude } = await getCurrentLocationOnce();

      if (latitude == null || longitude == null) {
        setLoading(false);
        setError("We couldn't find your location. Please ensure location services are turned on, or ask your supervisor for help.");
        return;
      }
      await postCheckIn(latitude, longitude);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.replace("WelcomeGreeting");
    } catch (error: any) {
      // Show popup if network/connection error
      if (
        typeof error?.message === "string" &&
        (error.message.toLowerCase().includes("network") ||
          error.message.toLowerCase().includes("internet") ||
          error.message.toLowerCase().includes("connection") ||
          error.message.toLowerCase().includes("failed to fetch"))
      ) {
        setShowNoInternet(true);
      } else {
        console.error("An error occurred during check-in:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Could not complete check-in. Please try again or ask your supervisor."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [loading, navigation]);

  useEffect(() => {
    if (error) {
      alert(error);
      setError(null);
    }
  }, [error]);

  if (showNoInternet) {
    return <OfflineNotice />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title} accessibilityRole="header">
          Check In
        </Text>
        <View style={styles.locationInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.icon}>🕐</Text>
            <Text style={styles.infoText}>
              {currentDateTime.time} {currentDateTime.period}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.icon}>📅</Text>
            <Text style={styles.infoText}>{currentDateTime.fullDate}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.checkinButton, loading && styles.buttonDisabled]}
          onPress={handleCheckIn}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="I'm here, start work"
          activeOpacity={0.85}
        >
          {loading ? (
            <Loader />
          ) : (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.buttonText}>🟢 I'M HERE</Text>
              <Text style={styles.buttonSubText}>Tap to Start Work</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckInScreen;
