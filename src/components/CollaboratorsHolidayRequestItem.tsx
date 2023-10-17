import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { Flex, HStack, Text, VStack, useTheme } from "native-base";
import { t } from "i18next";
import { usePeriod, useRessourceById, useSolde } from "../api";
import { StyleSheet, View } from "react-native";
import ColoredBox from "../ui/ColoredBox";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from "accordion-collapse-react-native";
import Icon from "@expo/vector-icons/FontAwesome";

interface CollaboratorsHolidayRequestProps {
  item: any;
}
export const CollaboratorsHolidayRequestItem = ({
  item,
}: CollaboratorsHolidayRequestProps) => {
  const { colors } = useTheme();
  const { data: currentPeriod } = usePeriod();

  const { data: collaborator } = useRessourceById(item.ressource.ressourceId);

  const { data: solde } = useSolde({
    ressourceId: item.ressource.ressourceId,
    year: currentPeriod?.year!,
  });

  function getColorByState(state) {
    switch (state) {
      case "En attente":
        return colors.warning;
      case "validé":
        return colors.success;
      case "refusé":
        return colors.danger;
      default:
        return colors.gray[400];
    }
  }
  const color = getColorByState(item.state);

  function formatDate(givenDate) {
    const parts = givenDate.split(" ")[0].split("-"); // Extracting only the date part and splitting it
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

  const styles = StyleSheet.create({
    container: {
      margin: 10,
    },
    title: {
      fontSize: 18,
      marginBottom: 5,
      color: colors.gray[600],
    },
    detail: {
      fontSize: 12,
      marginBottom: 5,
      color: colors.gray[400],
    },
    borderTop: {
      borderTopColor: colors.gray[200],
      borderTopWidth: 1,
    },
    requestState: {
      fontWeight: "bold",
      fontSize: 12,
    },
  });

  return (
    <View style={[styles.container]}>
      <VStack>
        <ColoredBox brTopColor={color} color={"white"}>
          <Collapse>
            <CollapseHeader>
              <View style={[{ marginVertical: 5 }]}>
                <View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "nowrap",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text style={styles.title}>
                      {collaborator?.firstName} {collaborator?.lastName}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <HStack space={4}>
                      <Text style={styles.title}>
                        {item.holidayType.typeLabel}
                      </Text>
                      <Text
                        fontSize="lg"
                        fontWeight="800"
                        bold
                        color={colors.blue[500]}
                        _dark={{
                          color: colors.grey[100],
                        }}
                      >
                        <Text bold>{`${item.nbrDay} jour(s)`} </Text>
                      </Text>
                    </HStack>
                    <Icon
                      name={"chevron-down"}
                      size={12}
                      type="light"
                      style={[styles.detail]}
                    />
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text style={[styles.detail]}>
                      {t("conge.dateFromTo", {
                        dateBegin: formatDate(item.dateBegin),
                        dateEnd: formatDate(item.dateEnd),
                      })}
                    </Text>
                  </View>
                </View>
              </View>
            </CollapseHeader>
            <CollapseBody>
              <Text style={[styles.title, { marginBottom: 15 }]}>
                {t("conge.detail")}
              </Text>
              <View style={[styles.borderTop, { padding: 5 }]}>
                <View style={[styles.title, { marginVertical: 5 }]}>
                  <View>
                    <View>
                      <Flex
                        direction="row"
                        wrap="nowrap"
                        justify="space-between"
                      >
                        <Text style={[styles.detail]}>
                          {t("conge.morning")}
                        </Text>
                        {item.morning == false ? (
                          <Icon
                            as={AntDesign}
                            name="minus"
                            style={[styles.detail]}
                            _dark={{
                              color: "gray.100",
                            }}
                          />
                        ) : (
                          <Icon
                            as={AntDesign}
                            name="check"
                            style={[styles.detail]}
                            _dark={{
                              color: "gray.100",
                            }}
                          />
                        )}
                      </Flex>
                      <Flex
                        direction="row"
                        wrap="nowrap"
                        justify="space-between"
                      >
                        <Text style={[styles.detail]}>
                          {t("conge.afternoon")}
                        </Text>
                        {item.afternoon == false ? (
                          <Icon
                            as={AntDesign}
                            name="minus"
                            style={[styles.detail]}
                            _dark={{
                              color: "gray.100",
                            }}
                          />
                        ) : (
                          <Icon
                            as={AntDesign}
                            name="check"
                            style={[styles.detail]}
                            _dark={{
                              color: "gray.100",
                            }}
                          />
                        )}
                      </Flex>
                      <Flex
                        direction="row"
                        wrap="nowrap"
                        justify="space-between"
                      >
                        <Text style={[styles.detail]}>
                          {t("conge.balance")}
                        </Text>
                        <Text style={[styles.detail]}>{solde}</Text>
                      </Flex>
                    </View>
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.requestState,
                        { color: getColorByState(item.state) },
                      ]}
                    >
                      {t("conge.state")}: {item.state}
                    </Text>
                  </View>
                </View>
              </View>
            </CollapseBody>
          </Collapse>
        </ColoredBox>
      </VStack>
    </View>
  );
};
