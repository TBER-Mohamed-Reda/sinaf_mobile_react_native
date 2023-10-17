import * as React from "react";
import { View } from "react-native";
import { Box, Select, useTheme } from "native-base";
import { EvilIcons } from "@expo/vector-icons";

type SelectButtonProps = {
  handleSearch: (itemValue: string) => void;
  selectedValue: string | number | undefined;
  label: string;
  selectItems: {
    label: string;
    value: string | number;
  }[];
};

const SelectButton = ({
  handleSearch,
  selectedValue,
  label,
  selectItems,
  ...props
}: SelectButtonProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: 6 }}
    >
      <Box style={{ flexBasis: "40%" }}>
        <Select
          _item={{ width: "100%" }}
          variant="filled"
          bgColor={"white"}
          dropdownIcon={
            <EvilIcons style={{ marginRight: 10 }} name="chevron-down" />
          }
          minWidth={115}
          selectedValue={selectedValue}
          defaultValue={selectedValue}
          accessibilityLabel={label}
          placeholder={label}
          _selectedItem={{
            bg: "white",
            width: "100%",
          }}
          mt={1}
          onValueChange={handleSearch}
          {...props}
        >
          {selectItems.map((value, index) => (
            <Select.Item
              key={index}
              label={value.label}
              value={value.value}
              {...props}
            />
          ))}
        </Select>
      </Box>
    </View>
  );
};

export default SelectButton;
