import React from "react";
import { AddIcon, Fab, useTheme } from "native-base";

type propsButton = {
  title: string;
  showModalProp: (params: any) => any;
};

export const AddButton = ({ title, showModalProp }: propsButton) => {
  const { colors } = useTheme();

  return (
    <>
      <Fab
        placement="bottom-right"
        shadow={7}
        renderInPortal={false}
        variant="unstyled"
        onPress={showModalProp}
        _dark={{
          bg: colors.blue[600],

          _hover: {
            bg: colors.blue[600],
          },

          _pressed: {
            bg: colors.blue[500],
          },
        }}
        _light={{
          bg: colors.blue[600],

          _hover: {
            bg: colors.blue[600],
          },

          _pressed: {
            bg: colors.blue[500],
          },
        }}
        p={3}
        icon={
          <AddIcon
            color="white"
            size="6"
            _dark={{
              color: "gray.100",
            }}
          />
        }
      />
    </>
  );
};
