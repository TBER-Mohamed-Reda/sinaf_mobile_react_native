import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Box, useColorModeValue, useToken } from "native-base";
import { RootStack } from "../navigators/rootNavigator";
import { useAuth } from "../core";
import { Login } from "../screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

export const Root = () => {
  const [lightBg, darkBg] = useToken(
    "colors",
    ["coolGray.50", "blueGray.900"],
    "blueGray.900"
  );
  const bgColor = useColorModeValue(lightBg, darkBg);
  const { status } = useAuth();
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer
      theme={{
        colors: { background: bgColor },
      }}
    >
      <Box
        flex={1}
        w="100%"
        _light={{
          bg: "coolGray.50",
        }}
        _dark={{
          bg: "blueGray.900",
        }}
        _web={{
          overflowX: "hidden",
        }}
      >
        {status === "signIn" ? (
          <RootStack />
        ) : (
          <Stack.Navigator>
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="Login"
              component={Login}
            />
          </Stack.Navigator>
        )}
      </Box>
    </NavigationContainer>
  );
};
