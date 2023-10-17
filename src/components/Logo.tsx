import "react-native-gesture-handler";
import React from "react";
import { Icon, IIconProps, Image } from "native-base";
import { StyleSheet, View } from "react-native";

export function Logo(props: IIconProps) {
  const styles = StyleSheet.create({
    container: {},
  });
  return (
    <Icon viewBox="0 0 602.339 681.729" {...props}>
      <View style={styles.container}>
        <Image
          alt="norsys-logo"
          source={require("./img/im_norsys_logo-web.png")}
        />
      </View>
    </Icon>
  );
}
