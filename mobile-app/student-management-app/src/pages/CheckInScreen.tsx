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
        <View style={styles.greetingHeader}>
          <Text style={styles.greetingEmoji}>☀️</Text>
          <Text style={styles.greetingText} accessibilityRole="header">
            Good Morning!
          </Text>
        </View>
        <Text style={styles.subGreetingText}>
          Ready to begin your work day?
        </Text>

        <View style={styles.timeCard}>
          <Text style={styles.timeText}>
            {currentDateTime.time} <Text style={{ fontSize: 24 }}>{currentDateTime.period}</Text>
          </Text>
          <Text style={styles.dateText}>
            📅 {currentDateTime.fullDate}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.checkinButton, loading && styles.buttonDisabled]}
          onPress={handleCheckIn}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="I'm here, start work"
          activeOpacity={0.82}
        >
          {loading ? (
            <Loader />
          ) : (
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>🟢 I'M HERE</Text>

            </View>
          )}
        </TouchableOpacity>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default CheckInScreen;
