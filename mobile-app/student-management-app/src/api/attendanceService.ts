import AsyncStorage from "@react-native-async-storage/async-storage";
import { dispatchApiCall } from "./wrapper/apiQueue";

export const postCheckIn = async (latitude: number, longitude: number) => {
  try {
    const student_id = await AsyncStorage.getItem("student_id");
    const timestamp = new Date().toISOString();
    if (!student_id) {
      throw new Error("Student ID not found");
    }

    return await dispatchApiCall({
      url: "/attendance",
      method: "POST",
      headers: {
        accept: "application/json",
        "student-id": student_id.trim(),
        "Content-Type": "application/json",
      },
      body: {
        check_in: true,
        check_in_lat: latitude,
        check_in_long: longitude,
        timestamp,
      },

    });
  } catch (error) {
    console.error("Error posting check-in:", error);
    throw error;
  }
};

export const postCheckOut = async (latitude: number, longitude: number) => {
  try {
    const student_id = await AsyncStorage.getItem("student_id");
    const timestamp = new Date().toISOString();

    if (!student_id) {
      throw new Error("Student ID not found");
    }

    return await dispatchApiCall({
      url: "/attendance",
      method: "POST",
      headers: {
        accept: "application/json",
        "student-id": student_id.trim(),
        "Content-Type": "application/json",
      },
      body: {
        check_in: false,
        check_in_lat: latitude,
        check_in_long: longitude,
        timestamp,
      },
    });
  } catch (error) {
    console.error("Error posting check-out:", error);
    throw error;
  }
};

export const postStudentFeedback = async (feedback: string) => {
  try {
    const student_id = await AsyncStorage.getItem("student_id");
    const timestamp = new Date().toISOString();
    if (!student_id) {
      throw new Error("Student ID not found");
    }

    return await dispatchApiCall({
      url: "/feedback",
      method: "POST",
      headers: {
        accept: "application/json",
        "student-id": student_id.trim(),
        "Content-Type": "application/json",
      },
      body: {
        feedback,
        timestamp,
      },
    });
  } catch (error) {
    console.error("Error submitting student feedback:", error);
    throw error;
  }
};

export const postArrivedHome = async (pin: string, latitude: number, longitude: number) => {
  try {
    const student_id = await AsyncStorage.getItem("student_id");
    const timestamp = new Date().toISOString();
    if (!student_id) {
      throw new Error("Student ID not found");
    }

    return await dispatchApiCall({
      url: "/arrived-home",
      method: "POST",
      headers: {
        accept: "application/json",
        "student-id": student_id.trim(),
        "Content-Type": "application/json",
      },
      body: {
        pin,
        latitude,
        longitude,
        timestamp,
      },
    });
  } catch (error) {
    console.error("Error posting arrived home:", error);
    throw error;
  }
};

export const postLocationPing = async (latitude: number, longitude: number, accuracy?: number) => {
  try {
    const student_id = await AsyncStorage.getItem("student_id");
    const timestamp = new Date().toISOString();
    if (!student_id) {
      return; // Do nothing if student not logged in
    }

    return await dispatchApiCall({
      url: "/location-track",
      method: "POST",
      headers: {
        accept: "application/json",
        "student-id": student_id.trim(),
        "Content-Type": "application/json",
      },
      body: {
        latitude,
        longitude,
        accuracy: accuracy || 0,
        timestamp,
      },
    });
  } catch (error) {
    console.warn("Background location ping error:", error);
  }
};

