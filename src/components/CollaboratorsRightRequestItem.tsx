import {
  HStack,
  VStack,
  useTheme,
  Text,
  Menu,
  Pressable,
  HamburgerIcon,
} from "native-base";
import { StyleSheet, View } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from "accordion-collapse-react-native";
import ColoredBox from "../ui/ColoredBox";
import React from "react";
import { t } from "i18next";
import { updateRequestState } from "../api";
import { AntDesign } from "@expo/vector-icons";
interface RightRequestProps {
  item: any;
  refetchCollaboratorsRightRequest: () => void;
}

const CollaboratorsRightRequestItem = ({
  item,
  refetchCollaboratorsRightRequest,
}: RightRequestProps) => {
  const { colors } = useTheme();
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

  const handleUpdateRequestState = async (state: String) => {
    try {
      await updateRequestState(item, state);
      refetchCollaboratorsRightRequest();
    } catch (error) {
      console.error(t("errors.errorRightRequestUpdating"));
    }
  };

  const color = getColorByState(item.state);
  function formatDate(givenDate) {
    const parts = givenDate.split(" ")[0].split("-");
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
    <>
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
                        {item.ressource.firstName} {item.ressource.lastName}
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
                          <Text bold>
                            {item.holidayType.typeDuration} {t("droit.days")}{" "}
                          </Text>
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
                        {formatDate(item.dateRight)}
                      </Text>
                    </View>
                  </View>
                </View>
              </CollapseHeader>
              <CollapseBody>
                <Text style={[styles.title, { marginBottom: 15 }]}>
                  {t("droit.details")}
                </Text>
                <View style={[styles.borderTop, { padding: 5 }]}>
                  <View style={[styles.title, { marginVertical: 5 }]}>
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
                {item.state === "En attente" && (
                  <HStack justifyContent="flex-end">
                    <Menu
                      style={{ margin: 10 }}
                      trigger={(triggerProps) => {
                        return (
                          <Pressable
                            accessibilityLabel="More options menu"
                            {...triggerProps}
                          >
                            <HamburgerIcon />
                          </Pressable>
                        );
                      }}
                    >
                      <Menu.Item
                        onPress={() => handleUpdateRequestState("validé")}
                      >
                        <HStack alignItems="center">
                          <AntDesign
                            name="checkcircle"
                            size={24}
                            color="green"
                          />
                          <Text ml={2} style={{ color: "green" }}>
                            {t("actions.validate")}
                          </Text>
                        </HStack>
                      </Menu.Item>
                      <Menu.Item
                        onPress={() => handleUpdateRequestState("refusé")}
                      >
                        <HStack alignItems="center">
                          <AntDesign name="closecircle" size={24} color="red" />
                          <Text ml={2} style={{ color: "red" }}>
                            {t("actions.refuse")}
                          </Text>
                        </HStack>
                      </Menu.Item>
                    </Menu>
                  </HStack>
                )}
                {(item.state === "refusé" || item.state === "validé") && (
                  <HStack justifyContent="flex-end">
                    <Pressable
                      onPress={() => handleUpdateRequestState("annulé")}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <AntDesign name="closecircle" size={24} color="grey" />
                      <Text ml={2} style={{ color: "grey" }}>
                        {t("actions.cancel")}
                      </Text>
                    </Pressable>
                  </HStack>
                )}
              </CollapseBody>
            </Collapse>
          </ColoredBox>
        </VStack>
      </View>
    </>
  );
};

export default CollaboratorsRightRequestItem;
