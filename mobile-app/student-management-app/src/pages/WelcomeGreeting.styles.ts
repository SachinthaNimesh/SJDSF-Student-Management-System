import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    width: "100%",
    maxWidth: 380,
    paddingVertical: 40,
    paddingHorizontal: 28,
    borderRadius: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  text: {
    color: "#1e293b",
    fontSize: 34,
    textAlign: "center",
    fontWeight: "800",
    lineHeight: 42,
    marginTop: 8,
  },
  lottie: {
    width: 170,
    height: 170,
    alignSelf: "center",
    marginBottom: 16,
  },
});

export default styles;
