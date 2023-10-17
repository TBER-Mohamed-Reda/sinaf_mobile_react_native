import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { t } from 'i18next';
import { useTheme } from 'native-base';
import React from 'react';
import { Pressable, Text, TouchableOpacity } from 'react-native';

type Props = {
    navigate: NativeStackNavigationProp<any>,
    name: string
}
const ShowMoreButton = ({ navigate, name }: Props) => {
    const { colors, fonts } = useTheme()

    return (
        <Pressable onPress={() => navigate.navigate(name)}>
            <Text style={{ color: colors.primary, fontFamily: fonts.heading.regular, fontSize: 14, textAlign: 'right', marginHorizontal: 16 }}> {`${t("home.showMore")}`}...</Text>
        </Pressable>
    );
};

export default ShowMoreButton;
