import { StyleSheet } from "react-native";

export const sharedStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#151320",
  },
  button: {
    width: "90%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  greenButton: {
    backgroundColor: "#16DD89",
    width: "90%", // Match button width with screen
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#15A581",
  },
  greenButtonText: {
    color: "#E6F6F4",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
  transparentButton: {
    borderWidth: 2,
    borderColor: "#16DD89",
  },
  transparentButtonText: {
    color: "#16DD89",
    fontSize: 14,
    fontWeight: "700",
  },
});
