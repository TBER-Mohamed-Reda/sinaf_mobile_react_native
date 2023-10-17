import { createDrawerNavigator } from "@react-navigation/drawer";

import React from "react";

import { FormationList } from "../screens/Formation";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import DrawerNavigation from "../components/DrawerNavigation";
import NavBar from "../components/NavBar/NavBar";
import { Home } from "../screens";
import Reservation from "../screens/Reservation";
import { DossierAdministratif } from "../screens/DossierAdministratif";
import { RequestLeave } from "../screens/Conge/RequestLeave";
import { RequestRight } from "../screens/Conge/RequestRight";
import { MyFormationsList } from "../screens/Formation/MyFormations";
import { AnimatedFormation } from "../screens/Formation/AnimatedFormation";

const Drawer = createDrawerNavigator();

export function RootStack() {
  return (
    <>
      <Drawer.Navigator
        screenOptions={({ route }) => ({
          drawerType: "slide",
          drawerStyle: styles.drawerStyle,
          header: () => <NavBar title={route.name} />,
        })}
        useLegacyImplementation={true}
        initialRouteName="Home"
        drawerContent={(props) => <DrawerNavigation {...props} />}
      >
        <Drawer.Screen name="home" component={Home} />
        <Drawer.Screen name="roomReservation" component={Reservation} />
        <Drawer.Screen name="allFormations" component={FormationList} />
        <Drawer.Screen name="myFormations" component={MyFormationsList} />
        <Drawer.Screen name="animatedFormations" component={AnimatedFormation} />
        {/* <Drawer.Screen name="Dossier" component={Dossier} /> */}
        <Drawer.Screen
          name="administrativeFiles"
          component={DossierAdministratif}
        />
        <Drawer.Screen name="requestLeave" component={RequestLeave} />
        <Drawer.Screen name="requestRight" component={RequestRight} />
      </Drawer.Navigator>
    </>
  );
}
const styles = StyleSheet.create({
  drawerStyle: {
    width: Dimensions.get("window").width - 1000,
  },
});
