import React from "react";
import { useAuth } from "../core";
import { Box, Spinner, Text, useTheme } from "native-base";
import Error from "./Error";
import { t } from "i18next";
import { StyleSheet } from "react-native";
import { useSolde } from "../api";

type SoldeCardProps = {
  year: number;
};
export const SoldeCard = ({ year }: SoldeCardProps) => {
  const { colors } = useTheme();
  const { ressourceId } = useAuth();

  const { error: errorSolde, data: solde } = useSolde({
    ressourceId: ressourceId!,
    year: year,
  });

  const styles = StyleSheet.create({
    card: {
      backgroundColor:
        solde! >= 5
          ? colors.success
          : solde! > 0 && solde! < 5
          ? colors.warning
          : colors.danger,
    },
  });

  return (
    <>
      {!solde ? (
        <Spinner />
      ) : errorSolde || !solde ? (
        <Error errorMessage={`${t("errors.loadingSolde")}!`} />
      ) : (
        <Box rounded="lg" style={styles.card} px={4} py={2}>
          <Text color="gray.100">
            {t("conge.balance")} : {solde}
          </Text>
        </Box>
      )}
    </>
  );
};
