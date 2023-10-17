import React from "react";
import {
  Box,
  useColorMode,
  Heading,
  HStack,
  Text,
  Icon,
  Pressable,
  ArrowBackIcon,
  Link,
  useColorModeValue,
} from "native-base";
import { Floaters } from "../components/Floaters";
import { SafeAreaView } from "react-native-safe-area-context";
import { EvilIcons } from "@native-base/icons";

export const Layout = ({
  children,
  navigation,
  title,
  doclink,
  navigateTo,
  _status,
  _hStack,
  ...props
}: any) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Box
        {...props}
        flex={1}
        flexBasis="0"
        px={5}
        w={{ base: "100%", md: "768px", lg: "1000px", xl: "1080px" }}
      >
        <HStack
          position="absolute"
          left={0}
          top={0}
          right={0}
          px={4}
          zIndex={-1}
          {..._hStack}
        >
          <HStack py={2} alignItems="center" w="100%">
            <Heading
              color={colorMode == "dark" ? "white" : "gray.800"}
              _web={{ py: 2 }}
              isTruncated
              numberOfLines={1}
              flex={1}
            ></Heading>
          </HStack>
        </HStack>
        {children}
      </Box>
      <Floaters titre={title} />
    </>
  );
};
