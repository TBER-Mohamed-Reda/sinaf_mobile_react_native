import { HStack, VStack } from "native-base";
import React from "react";

export const MasonaryLayout = ({
  column,
  _hStack,
  _vStack,
  children,
  ...props
}: any) => {
  const vStackChildren: any[][] = [];
  const columnLength = column.length;
  React.Children.map(children, (child, cIndex) => {
    const pos = cIndex % columnLength;
    if (!vStackChildren[pos]) vStackChildren[pos] = [];
    vStackChildren[pos].push(child);
  });

  const vstackTemplate = () => {
    return column.map((flexVal: any, index: any) => {
      vStackChildren[index][vStackChildren[index].length - 1] =
        React.cloneElement(
          vStackChildren[index][vStackChildren[index].length - 1],
          { flex: 1 }
        );
      return (
        <VStack {..._vStack} flex={flexVal} key={index}>
          {vStackChildren[index]}
        </VStack>
      );
    });
  };

  return <HStack {..._hStack}>{vstackTemplate()}</HStack>;
};
