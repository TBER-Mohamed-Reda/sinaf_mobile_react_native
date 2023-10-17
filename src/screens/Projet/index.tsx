import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, Text } from "native-base";
import React from "react";
import { View } from "react-native";
import { Layout } from "../../components/Layout";

export function Projet({
  navigation,
}: {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}) {
  return (
    <Layout title="Projet" navigation={navigation} navigateTo="Home">
      <ScrollView
        contentContainerStyle={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text>TODO: Projet</Text>
        </View>
      </ScrollView>
    </Layout>
  );
}
