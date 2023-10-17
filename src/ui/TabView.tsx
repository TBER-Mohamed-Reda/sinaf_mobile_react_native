import React, { ComponentType } from "react";
import { Box, useColorModeValue } from "native-base";
import Animated from "react-native-reanimated";
import { SceneMap, TabView } from "react-native-tab-view";

type TabViewUIProps = {
  myRoutes: { key: string; title: string }[];
  component1: ComponentType<unknown>;
  component2: ComponentType<unknown>;
};

export function TabViewUI({
  myRoutes,
  component1,
  component2,
}: TabViewUIProps) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState(myRoutes);

  const renderScene = SceneMap({
    first: component1,
    second: component2,
  });

  const renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    return (
      <Box flexDirection="row">
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex, i) =>
              inputIndex === i ? 1 : 0.5
            ),
          });
          const color =
            index === i
              ? useColorModeValue("#000", "#e5e5e5")
              : useColorModeValue("#1f2937", "#a1a1aa");
          const borderColor =
            index === i
              ? "#3e4ea7"
              : useColorModeValue("coolGray.200", "gray.400");
          return (
            <Box
              borderBottomWidth="3"
              borderColor={borderColor}
              flex={1}
              alignItems="center"
              p="3"
              key={i}
            >
              <Box>
                <Animated.Text
                  style={{
                    color,
                  }}
                >
                  {route.title}
                </Animated.Text>
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <TabView
      navigationState={{
        index,
        routes,
      }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
    />
  );
}
