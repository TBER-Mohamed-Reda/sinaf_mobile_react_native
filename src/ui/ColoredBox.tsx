import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'native-base';

type ColoredBoxProps = {
    children: React.ReactNode;
    color?: any
    brTopColor?: any
};

const ColoredBox = ({ brTopColor, color, children }: ColoredBoxProps) => {
    const { colors, fonts } = useTheme();

    const styles = StyleSheet.create({
        box: {
            padding: 15,
            borderRadius: 8,
            shadowColor: colors.gray[900],
            shadowOffset: {
                width: 1,
                height: 1,
            },
            shadowOpacity: 0.5,
            shadowRadius: 3.84,
            elevation: 5,
        },
        brTop: {
            borderTopWidth: 6,
            borderTopColor: brTopColor
        }
    });

    return (
        <View style={[{ backgroundColor: color }, styles.box, brTopColor && styles.brTop]}>
            <View>{children}</View>
        </View>
    );
};

export default ColoredBox;



