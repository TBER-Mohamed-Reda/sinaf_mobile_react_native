import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "native-base";
import Icon from "@expo/vector-icons/FontAwesome";
import { t } from "i18next";
import ColoredBox from "../../ui/ColoredBox";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from "accordion-collapse-react-native";
import { useAuth } from "../../core";
const AdminDocsRequest = ({ item: demande, handleDelete }) => {
  const { colors } = useTheme();
  const [isAdmin, setIsAdmin] = useState<Boolean>();
  const { hasRole } = useAuth();
  function getColorByState(state) {
    switch (state) {
      case "PENDING":
        return colors.warning;
      case "TREATED":
        return colors.success;
      default:
        return colors.secondary;
    }
  }
  const color = getColorByState(demande.state);
  const styles = StyleSheet.create({
    iconContainer: {
      display: "flex",
      marginHorizontal: 3,
    },
    container: {
      margin: 10,
    },
    content: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 18,
      marginBottom: 5,
      textTransform: "capitalize",
      color: colors.gray[600],
    },
    sessionSubject: {
      fontSize: 16,
      marginBottom: 5,
      textTransform: "capitalize",
      color: colors.gray[600],
    },
    detail: {
      fontSize: 12,
      marginBottom: 5,
      color: colors.gray[400],
    },
    stateBox: {
      backgroundColor: color,
      padding: 10,
      borderRadius: 8,
    },
    state: {
      fontWeight: "bold",
      fontSize: 12,
      color: color,
    },
    sessionState: {
      fontWeight: "bold",
      fontSize: 12,
    },
    borderTop: {
      borderTopColor: colors.gray[200],
      borderTopWidth: 1,
    },
  });
  useEffect(() => {
    hasRole("Admin").then((hasRoleAdmin) => {
      setIsAdmin(hasRoleAdmin);
    });
  }, []);

  return (
    <View style={[styles.container]}>
      <ColoredBox brTopColor={color} color={"white"}>
        <Collapse>
          <CollapseHeader>
            <View style={[{ marginVertical: 5 }]}>
              <View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.title}>
                    {t("administrativeFiles.reasonForTheRequest")}
                    {demande.motive}
                  </Text>
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
                    {t("administrativeFiles.depositDate")} {demande.date}
                  </Text>
                </View>
              </View>
            </View>
          </CollapseHeader>
          <CollapseBody>
            <Text style={[styles.title, { marginBottom: 15 }]}>{`${t(
              "administrativeFiles.details"
            )}`}</Text>
            <View style={[styles.borderTop, { padding: 5 }]}>
              <View style={[styles.title, { marginVertical: 5 }]}>
                <Text style={[styles.detail, {}]}>
                  {isAdmin && demande.resource && demande.resource.firstName}{" "}
                  {isAdmin && demande.resource && demande.resource.lastName}
                </Text>
                <Text style={[styles.detail, {}]}>
                  {t("administrativeFiles.document")} {demande.template.name}
                </Text>
              </View>
              <View>
                <Text
                  style={[
                    styles.sessionState,
                    { color: getColorByState(demande.state) },
                  ]}
                >
                  {t("administrativeFiles.status")} {demande.state}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                  justifyContent: "flex-end",
                }}
              >
                {isAdmin &&
                  (demande.state === "PENDING" ? (
                    <TouchableOpacity
                      onPress={() => {
                        console.log("Update icon clicked");
                      }}
                    >
                      <Icon
                        name="pencil"
                        size={20}
                        color={"green"}
                        style={styles.iconContainer}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleDelete(demande.idRequest)}
                      style={{ marginLeft: 13 }}
                    >
                      <Icon
                        name="trash"
                        size={20}
                        color={"red"}
                        style={styles.iconContainer}
                      />
                    </TouchableOpacity>
                  ))}
                {!isAdmin &&
                  (demande.state === "PENDING" ? (
                    <TouchableOpacity
                      onPress={() => handleDelete(demande.idRequest)}
                      style={{ marginLeft: 13 }}
                    >
                      <Icon
                        name="trash"
                        size={20}
                        color={"red"}
                        style={styles.iconContainer}
                      />
                    </TouchableOpacity>
                  ) : (
                    <></>
                  ))}
              </View>
            </View>
          </CollapseBody>
        </Collapse>
      </ColoredBox>
    </View>
  );
};

export default AdminDocsRequest;
