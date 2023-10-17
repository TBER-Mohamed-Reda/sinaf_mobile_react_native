import React from "react";
import { StyleSheet, View, Text } from "react-native";

const BottomSheetHeader = ({ title }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLine} />
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    marginBottom: 20,
  },
  headerLine: {
    borderBottomWidth: 1,
    borderBottomColor: "black",
    width: "90%",
    position: "absolute",
    top: 40,
  },
  headerTitle: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    fontWeight: "bold",
    color: "#4B6FB2",
  },
});
export default BottomSheetHeader;
