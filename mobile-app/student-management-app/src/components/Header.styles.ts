import { StyleSheet, Platform, StatusBar } from "react-native";

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 48 : (StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 36),
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4f46e5", // 0% transparent (100% solid opaque) matching app background
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.12)",
    shadowColor: "#1e1b4b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  greeting: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  greetingText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  wave: {
    fontSize: 28,
  },
  profilePic: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.4)",
    backgroundColor: "#ff6b6b",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  profileInitial: {
    fontSize: 19,
    color: "white",
    fontWeight: "bold",
  },
});

export default styles;
