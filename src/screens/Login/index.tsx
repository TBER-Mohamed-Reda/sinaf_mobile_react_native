import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import {
  Box,
  Button,
  Heading,
  Icon,
  Input,
  Pressable,
  ScrollView,
  Stack,
  VStack,
  useColorMode,
} from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { Layout } from "../../components/Layout";
import { AUTHORIZATION_CODE, useAuth } from "../../core";
import { fetchRessource, useRessource } from "../../api";
import { t } from "i18next";
import { Logo } from "../../components/Logo";

export const Login = () => {
  const { colorMode } = useColorMode();
  const { signIn } = useAuth();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);

  const el = useRef({});

  const mutation = useMutation(
    (authData: any) =>
      axios.post("/oauth/token", authData, {
        headers: {
          Authorization: AUTHORIZATION_CODE,
        },
      }),
    {
      onSuccess: (response) => {
        fetchRessource({ username }).then((ressource) => {
          const data = {
            token: {
              access: response.data.access_token,
              refresh: response.data.refresh_token,
            },
            ressourceId: ressource.ressourceId,
          };
          signIn(data);
        });
      },
      onError: (err) => {
        console.error("Error auth", err);
      },
    }
  );

  useEffect(() => {
    const backColor = colorMode === "dark" ? "#545fb1" : "#20296a";
    el?.current.setNativeProps({
      backgroundColor: backColor,
      borderColor: backColor,
    });
  }, [el, colorMode]);

  const handleSubmit = async () => {
    const params = `grant_type=password&client_id=clientIdPassword&username=${username}&password=${password}`;
    mutation.mutate(params);
  };

  return (
    <Layout title="Login">
      <Logo
        size={{ base: 64, md: 450 }}
        zIndex={-99}
        opacity={0.4}
        _ios={{
          opacity: 0.6,
        }}
        position="absolute"
        top={{ base: -150, md: -180 }}
        right={{ base: -40, md: -100 }}
      />
      <Box>
        <ScrollView
          contentContainerStyle={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          <Heading
            color={colorMode == "dark" ? "gray.100" : "trueGray.700"}
            size="lg"
            p={4}
            mt={5}
          >
            {`${t("welcome.sinaf")}`}
          </Heading>
          <VStack w="100%" marginTop={180}>
            <VStack>
              <Heading
                size="md"
                p={4}
                color={colorMode == "dark" ? "gray.100" : "trueGray.700"}
                textAlign="center"
              >
                {`${t("routes.logIn")}`}
              </Heading>

              <Box p={5} rounded="xl" w="100%">
                <Stack space={4} w="100%" alignItems="center">
                  <Input
                    w={{
                      base: "100%",
                      md: "57%",
                    }}
                    size="xl"
                    variant="filled"
                    InputLeftElement={
                      <Icon
                        as={<MaterialIcons name="person" />}
                        size={5}
                        ml="2"
                        color="muted.400"
                      />
                    }
                    placeholder={t("login.username")}
                    onChangeText={(newUserName) => setUserName(newUserName)}
                  />
                  <Input
                    w={{
                      base: "100%",
                      md: "75%",
                    }}
                    size="xl"
                    variant="filled"
                    type={show ? "text" : "password"}
                    InputRightElement={
                      <Pressable onPress={() => setShow(!show)}>
                        <Icon
                          as={
                            <MaterialIcons
                              name={show ? "visibility" : "visibility-off"}
                            />
                          }
                          size={5}
                          mr="2"
                          color="muted.400"
                        />
                      </Pressable>
                    }
                    placeholder={t("login.password")}
                    onChangeText={(newPassword) => setPassword(newPassword)}
                  />
                  <Button
                    isLoading={mutation.isLoading}
                    w="100%"
                    size="lg"
                    ref={el}
                    onPress={handleSubmit}
                    style={{
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}
                  >
                    {`${t("routes.logIn")}`}
                  </Button>
                </Stack>
              </Box>
            </VStack>
          </VStack>
        </ScrollView>
      </Box>
    </Layout>
  );
};
