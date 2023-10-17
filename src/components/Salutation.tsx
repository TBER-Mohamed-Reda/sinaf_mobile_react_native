import { Image, useTheme } from "native-base";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ressource } from "../api";
import { t } from "i18next";

type RessourceProps = {
  user: Ressource;
};
const Salutation: React.FC<RessourceProps> = ({user}: RessourceProps) => {
  const { colors, fonts } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      marginVertical: 8,
      alignItems: "center",
    },
    greetingMessage: {
      fontSize: 20,
      fontWeight: "500",
      color: colors.blue[400],
    },
    welcomeMessage: {
      fontSize: 12,
      fontWeight: "300",
      color: colors.blue[400],
    },
    col: {
      marginHorizontal: 10,
      flexDirection: "column",
      marginVertical: 8,
      alignItems: "flex-start",
      justifyContent: "center",
    },
  });
  return (
    <>
      <View style={styles.container}>
        <Image
          width={50}
          height={50}
          alt="Norsys-Logo"
          source={require("../../assets/norsys-logo.png")}
        />
        <View style={styles.col}>
          <Text style={styles.greetingMessage}>
            Bonjour {user.firstName} 👋🏻
          </Text>
          <Text style={styles.welcomeMessage}>{`${t("welcome.sinaf")}`}</Text>
        </View>
      </View>
    </>
  );
};
export default Salutation;
