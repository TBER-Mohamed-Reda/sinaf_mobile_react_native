import { t } from "i18next";
import { useTheme, Text } from "native-base";
import React from "react";
import { View, StyleSheet } from "react-native";

const CongeOverViewEnAttente = ({ demande }) => {
  const { colors, fonts } = useTheme();
  const pendingColor = colors.blue[500];
  const treatedColor = colors.green[500];

  const hexToRgb = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const styles = StyleSheet.create({
    item: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: 8,
      marginBottom: 8,
      paddingHorizontal: 16,
      borderBottomColor: colors.gray[200],
      borderBottomWidth: 1,
      alignItems: "center",
    },
    number: {
      marginRight: 8,
      justifyContent: "center",
      alignItems: "center",
      height: 32,
      width: 32,
      borderRadius: 16,
    },
    numberText: {
      fontSize: 18,
      fontFamily: fonts.heading.semiBold,
      lineHeight: 21,
      opacity: 1,
    },
    title: {
      fontSize: 16,
      fontFamily: fonts.heading.medium,
      marginBottom: 4,
    },
    errorContainer: {
      backgroundColor: "#FFCDD2",
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginBottom: 16,
      borderRadius: 4,
    },
    errorText: {
      color: "#F44336",
      fontSize: 16,
      fontFamily: "Helvetica Neue",
      textAlign: "center",
    },
  });
  return (
    <>
      <View style={styles.item}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={[
              styles.number,
              { backgroundColor: hexToRgb(pendingColor, 0.2) },
            ]}
          >
            <Text style={[styles.numberText, { color: pendingColor }]}>
              {demande}
            </Text>
          </View>
          <Text style={[styles.title, { color: pendingColor }]}>
            {t("conge.pending")}
          </Text>
        </View>
      </View>
    </>
  );
};

export default CongeOverViewEnAttente;
