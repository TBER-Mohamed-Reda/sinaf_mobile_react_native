import React from "react";
import { Box, Button, Flex, Icon, IconButton, useTheme } from "native-base";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { t } from "i18next";

type FilterButtonProps = {
  onPressForFilter : () => void
  onPressForRefresh : () => void
}

export const FilterButton = ({onPressForFilter, onPressForRefresh}: FilterButtonProps) => {
  const { colors } = useTheme();

  return (
    <Flex direction="row" wrap="nowrap">
      <Box alignItems="center">
        <Button
          bg={colors.blue["300"]}
          borderRadius="10"
          _pressed={{
            bg: colors.blue["200"],
          }}
          leftIcon={
            <Icon as={MaterialCommunityIcons} name="filter" size="sm" />
          }
          onPress={onPressForFilter}
        >
          {t("actions.filter")}
        </Button>
      </Box>
      <Box
        alignItems="center"
        bg={colors.blue["600"]}
        borderRadius="full"
        ml="1"
      >
        <IconButton
          size="md"
          borderRadius="full"
          _icon={{
            as: Feather,
            name: "rotate-ccw",
            color: "white",
          }}
          _pressed={{
            bg: colors.blue["500"],
          }}
          onPress={onPressForRefresh}
        />
      </Box>
    </Flex>
  );
};
