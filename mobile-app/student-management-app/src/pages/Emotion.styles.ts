import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  headerSpacer: {
    height: 10,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  moodCard: {
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 24,
    width: "100%",
    maxWidth: 420,
    shadowColor: "#1e1b4b",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#64748b",
    marginBottom: 24,
    textAlign: "center",
  },
  moodButtons: {
    width: "100%",
    flexDirection: "column",
    gap: 14,
    marginBottom: 10,
  },
  moodButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 18,
    minHeight: 74,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  happyButton: {
    backgroundColor: "#f0fdf4",
    borderColor: "#86efac",
  },
  neutralButton: {
    backgroundColor: "#fffbeb",
    borderColor: "#fde68a",
  },
  sadButton: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
  },
  selectedMood: {
    borderColor: "#6366f1",
    borderWidth: 3,
    backgroundColor: "#eef2ff",
  },
  moodEmoji: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  emojiText: {
    fontSize: 34,
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  moodText: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  happyText: {
    color: "#166534",
  },
  neutralText: {
    color: "#92400e",
  },
  sadText: {
    color: "#1e40af",
  },
  flexGrow: {
    flex: 1,
  },
  errorMsgContainer: {
    backgroundColor: "#fee2e2",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#fca5a5",
  },
  errorMsgText: {
    color: "#991b1b",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  fabContainerStyle: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

export default styles;
