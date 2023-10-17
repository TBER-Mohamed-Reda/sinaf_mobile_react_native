import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ReservedRoomOverView from "./ReservedRoomOverView";
import { Image } from "native-base";
import Icon from "@expo/vector-icons/FontAwesome";
import { Logo } from "../components/Logo";
import { ScrollView, useTheme } from "native-base";

interface ErrorProps {
  errorMessage: string;
}

const Error = ({ errorMessage }: ErrorProps) => {
  const { colors, fonts } = useTheme();

  const styles = StyleSheet.create({
    iconContainer: {
      display: "flex",
      marginHorizontal: 3,
    },
    container: {
      margin: 15,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      fontSize: 12,
      fontFamily: fonts.heading.regular,
      color: colors.danger,
      alignItems: "center",
      wordWrap: "break-word",
    },
  });
  return (
    <>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon name="warning" color={colors.danger} size={15} type="light" />
        </View>
        <View>
          <Text style={styles.text}>{errorMessage}</Text>
        </View>
      </View>
    </>
  );
};

export default Error;
