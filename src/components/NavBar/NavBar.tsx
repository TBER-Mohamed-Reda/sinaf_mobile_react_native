import { useNavigation } from "@react-navigation/native";
import { Button, HStack, Heading, Pressable, useTheme } from "native-base";
import Icon from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import { t } from "i18next";
import { StatusBar, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Notification from "../Notification/Notification";

const NavBar = ({ title }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [showNotification, setShowNotification] = useState(false);
  return (
    <SafeAreaView>
      <HStack
        alignItems="center"
        justifyContent="space-between"
        style={styles.navBar}
      >
        <Button>
          <Icon
            name={"bars"}
            size={25}
            type={"light"}
            color={colors.blue[400]}
            onPress={() => navigation.toggleDrawer()}
          />
        </Button>
        <Heading color={colors.blue[400]} size="lg">
          {`${t("routes." + title)}`}
        </Heading>

        <Button>
          <Pressable onPress={() => setShowNotification(true)}>
            <Icon name={"bell-o"} size={20} color={colors.blue[400]} />
          </Pressable>
        </Button>
      </HStack>
      <Notification {...{ setShowNotification, showNotification }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  navBar: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingTop: Platform.OS === "android" ? 6 : 15,
    paddingBottom: Platform.OS === "android" ? 6 : 15,
    paddingHorizontal: 10,
  },
});

export default NavBar;
