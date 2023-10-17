
import * as SplashScreen from "expo-splash-screen";
import { NativeBaseProvider } from "native-base";
import * as React from "react";
import { useEffect } from "react";
import "react-native-gesture-handler";
import config from "./nativebase.config";
import { APIProvider } from "./src/api";
import { Root } from "./src/components/RootComponent";
import { useAuth } from "./src/core";
import "./src/core/I18n";
import { BaseTheme } from "./src/theme";
import * as Font from 'expo-font';

export default function App() {
  const { status } = useAuth();
  
  useEffect(() => {
    const loadFonts = async () => {
      try {
        Font.loadAsync({
          Roboto: require("./assets/fonts/Roboto-Light.otf")
        });
      }catch(error) {
        console.error('error');
      }
    }
    loadFonts();
   }, [])

  useEffect(() => {
    if (status !== "idle") {
      SplashScreen.hideAsync();
    }
  }, [status]);

  return (
    <APIProvider>
      <NativeBaseProvider theme={BaseTheme} config={config}>
        <Root />
      </NativeBaseProvider>
    </APIProvider>
  );
}
