import {
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import {
  Text,
  Avatar,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Icon,
  ScrollView,
  Stack,
  useColorMode,
  useColorModeValue,
  VStack,
} from "native-base";
import React from "react";
import { View } from "react-native";
import { useQuery } from "react-query";
import { Layout } from "../../components/Layout";
import { useAuth } from "../../core";
import { useRessource } from "../../api";

export function Profile({
  navigation,
}: {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}) {
  const { colorMode } = useColorMode();
  const { signOut, username } = useAuth();

  const { isLoading, error, data } = useQuery(
    ['repoData'],
    async () => await useRessource(username),
    {
      enabled: !!username
    }
  )

  return (
    <Layout title="Profile" navigation={navigation} navigateTo="Home">
      <ScrollView
        contentContainerStyle={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        <VStack w="100%">
          <Box
            shadow={1}
            bg={useColorModeValue("white", "blueGray.800")}
            my={2}
            mx={3}
            borderRadius={16}
          >
            <VStack>
              <Heading
                size="md"
                p={4}
                color={colorMode == "dark" ? "gray.100" : "trueGray.700"}
              >
                Information de l'utilisateur
              </Heading>
              <Divider
                bg={colorMode == "dark" ? "blueGray.500" : "warmGray.200"}
              />
              <Box p={5} rounded="xl" w="100%">
                {isLoading && <Text>Loading...</Text>}
                {error && <Text>An error has occurred</Text>}
                {data && (
                  <Stack space={6}>
                    <HStack justifyContent="space-between" alignItems="center">
                      <Avatar
                        size={"md"}
                        bg="teal.500"
                        source={{
                          uri: "https://i.pinimg.com/originals/4d/72/97/4d7297dad94265c0acbc3b677d418935.jpg",
                        }}
                      />
                    </HStack>

                    <Stack space={3}>
                      <Heading
                        size="lg"
                        _light={{ color: "blueGray.700" }}
                        _dark={{ color: "blueGray.100" }}
                      >
                        {data.firstName} {data.lastName}
                      </Heading>
                      <Text
                        _light={{ color: "blueGray.500" }}
                        _dark={{ color: "blueGray.200" }}
                        fontWeight="medium"
                        fontSize="xs"
                      >
                        {data.profil.label}
                      </Text>
                    </Stack>
                    <HStack
                      justifyContent="space-between"
                      alignItems="flex-end"
                      flexShrink={1}
                    >
                      <Stack space={3}>
                        <HStack space={3} alignItems="center" flexShrink={1}>
                          <Icon
                            name="user"
                            as={AntDesign}
                            // color="blueGray.700"
                            _light={{ color: "blueGray.700" }}
                            _dark={{ color: "blueGray.400" }}
                          />
                          <Text
                            flexShrink={1}
                            fontWeight="medium"
                            _light={{ color: "blueGray.500" }}
                            _dark={{ color: "blueGray.200" }}
                          >
                            {username}
                          </Text>
                        </HStack>

                        <HStack space={3} alignItems="center" flexShrink={1}>
                          <Icon
                            name="phone"
                            as={AntDesign}
                            // color="blueGray.700"
                            _light={{ color: "blueGray.700" }}
                            _dark={{ color: "blueGray.400" }}
                          />
                          <Text
                            flexShrink={1}
                            fontWeight="medium"
                            _light={{ color: "blueGray.500" }}
                            _dark={{ color: "blueGray.200" }}
                          >
                            {data.phone}
                          </Text>
                        </HStack>
                        <HStack space={3} alignItems="center" flexShrink={1}>
                          <Icon
                            name="email"
                            as={MaterialIcons}
                            // color="blueGray.700"
                            _light={{ color: "blueGray.700" }}
                            _dark={{ color: "blueGray.400" }}
                          />
                          <Text
                            flexShrink={1}
                            fontWeight="medium"
                            _light={{ color: "blueGray.500" }}
                            _dark={{ color: "blueGray.200" }}
                          >
                            {data.email}
                          </Text>
                        </HStack>
                        <HStack space={3} alignItems="center">
                          <Icon
                            name="calendar"
                            as={MaterialCommunityIcons}
                            // color="blueGray.700"
                            _light={{ color: "blueGray.700" }}
                            _dark={{ color: "blueGray.400" }}
                          />
                          <Text
                            _light={{ color: "blueGray.500" }}
                            _dark={{ color: "blueGray.200" }}
                            fontWeight="medium"
                          >
                            Hire Date: {data.hireDate}
                          </Text>
                        </HStack>
                      </Stack>
                    </HStack>
                  </Stack>
                )}
              </Box>
            </VStack>
          </Box>
        </VStack>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Button size="lg" marginTop={10} onPress={signOut}>
            Logout
          </Button>
        </View>
      </ScrollView>
    </Layout>
  );
}
