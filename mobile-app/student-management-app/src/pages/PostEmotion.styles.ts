import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#667eea",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    width: "100%",
    maxWidth: 400,
    padding: 32,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  text: {
    color: "#2c3e50",
    fontSize: 32,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 8,
  },
  subText: {
    color: "#555",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  lottie: {
    width: 160,
    height: 160,
    alignSelf: "center",
    marginBottom: 16,
  },
  doneButton: {
    backgroundColor: "#27ae60",
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 18,
    width: "100%",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#27ae60",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default styles;
