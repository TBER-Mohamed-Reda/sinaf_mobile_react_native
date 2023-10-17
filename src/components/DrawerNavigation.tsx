import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { Drawer } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../core";
import { Heading, Image, Text, useTheme } from "native-base";
import CustomDrawerItem from "./CustomDrawerItem";
import { t } from "i18next";
import { ROUTES } from "../core/Routes";
import { RessourceParams, useRessource } from "../api";
import { useQueryClient } from "react-query";

const DrawerNavigation = (props: DrawerContentComponentProps) => {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      padding: 5,
    },
    borderTop: {
      borderTopColor: colors.gray[200],
      borderTopWidth: 1,
    },
  });

  const [currentRole, setCurrentRole] = useState<string>('');

  const { hasRole } = useAuth();

  useEffect(() => {
        Promise.all([hasRole("Admin"), hasRole("Pilote"),hasRole("Formateur")]).then(reponses => {
            const [isAdmin, isPilote, isFormateur] = reponses;
            if(isAdmin) {
                setCurrentRole("Admin");
            }else if(isPilote) {
                setCurrentRole("Pilote")
            }else if(isFormateur) {
                setCurrentRole("Formateur")
            }else {
                setCurrentRole("Col");
            }
        });
    }, []);


  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const { navigation, state } = props;
  const currentRouteName = state.routeNames[state.index];

  const { signOut, username } = useAuth();
  const { data: user } = useRessource({ username } as RessourceParams);

  const logout = () => {
    Alert.alert("", `${t("confirmations.logout")}`, [
      {
        text: `${t("actions.cancel")}`,
        style: "cancel",
      },
      {
        text: `${t("actions.confirm")}`,
        onPress: async () => {
          queryClient.clear();
          signOut();
        },
      },
    ]);
  };

  const darkMode = () => {};

  return (
    <>
      <DrawerContentScrollView style={{}} {...props}>
        <View style={{ flex: 0.3 }}>
          <Drawer.Section
            style={{ backgroundColor: "white", margin: 5, borderRadius: 8 }}
            showDivider={false}
          >
            <View
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 15,
                },
                styles.borderTop,
              ]}
            >
              <View style={{ marginRight: 12 }}>
                {user?.photo == null ? (
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    source={require("../../assets/profile.png")}
                    alt="Profile"
                  />
                ) : (
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    source={{ uri: `data:image/jpg;base64,${user?.photo}` }}
                    alt="Profile"
                  />
                )}
              </View>
              <View>
                <Heading
                  color={colors.blue[400]}
                  fontWeight={300}
                  size="md"
                  style={{
                    width: 150,
                    textTransform: "capitalize",
                  }}
                >
                  {user?.firstName} {user?.lastName}
                </Heading>
                <Heading
                  color={colors.blue[400]}
                  size="xs"
                  style={{
                    width: 150,
                    textTransform: "capitalize",
                  }}
                >
                  {user?.profil.label}
                </Heading>
              </View>
            </View>
          </Drawer.Section>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 0.65 }}>
            <Drawer.Section showDivider={false}>
              {ROUTES.map((route, index) => (
                (
                  route.permissions.includes(currentRole)
                ) &&
                <View key={index}>
                  <CustomDrawerItem
                    currentRoute={currentRouteName}
                    navigation={navigation}
                    label={route.label}
                    icon={route.icon}
                    subItems={route.subItems}
                  />
                </View>
              ))}
            </Drawer.Section>
          </View>
          <View style={{ flex: 0.2 }}>
            <DrawerItem
              label={`${t("routes.logout")}`}
              onPress={logout}
              labelStyle={{
                color: colors.gray[600],
                fontWeight: "bold",
              }}
              icon={() => (
                <Ionicons
                  color={colors.gray[600]}
                  name={"log-out-outline"}
                  size={20}
                />
              )}
            />
            <DrawerItem
              label={
                isDarkMode
                  ? `${t("options.lightMode")}`
                  : `${t("options.darkMode")}`
              }
              onPress={darkMode}
              labelStyle={{
                fontWeight: "bold",
                color: isDarkMode ? "white" : colors.gray[600],
              }}
              icon={() => (
                <Ionicons
                  name={isDarkMode ? "sunny-outline" : "moon-outline"}
                  size={20}
                  color={isDarkMode ? "white" : colors.gray[600]}
                />
              )}
              style={isDarkMode ? { backgroundColor: "#39689E" } : null}
            />
          </View>
        </View>
      </DrawerContentScrollView>
    </>
  );
};
export default DrawerNavigation;

