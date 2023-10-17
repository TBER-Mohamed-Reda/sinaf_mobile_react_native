import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import { useTheme } from 'native-base';

function getWordWidth(word: string, fontSize: number, fontWeight: string): number {
    const scale = Dimensions.get('window').width / 375;
    const style = { fontSize: PixelRatio.roundToNearestPixel(fontSize * scale), fontWeight };
    const textMetrics = PixelRatio.getFontScale() * (word.length * style.fontSize * 0.32);
    return PixelRatio.roundToNearestPixel(textMetrics / scale);
}

type HomeCardProps = {
    children: React.ReactNode;
    title: string;
    notification?: string;
    color: string;
};
export const HomeCard = ({ color, children, title, notification }: HomeCardProps) => {
    const { colors, fonts } = useTheme()

    const word = title;
    const fontSize = 30;
    const fontFamily = fonts.body.light;
    const titleWidth = getWordWidth(word, fontSize, fontFamily);

    const styles = StyleSheet.create({
        card: {
            paddingBottom: 10,
            marginVertical: 5
        },
        cardHeader: {
            marginBottom: 10
        },
        cardBody: {},
        cardFooter: {
            margin: 15,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        },
        text: {
            fontSize: 16,
            fontFamily: fonts.heading.regular,
            color: colors.gray[50],
            width: 50
        },
        iconContainer: {
            height: 15,
            marginHorizontal: 3
        },
        title: {
            fontSize: 20,
            color: colors.gray[700],
            textAlign: 'right',
            width: 'auto',
            fontFamily: fonts.heading.semiBold,
        },
        underlineContainer: {
            display: 'flex',
            flexDirection: 'row-reverse',
            marginTop: 6,
            backgroundColor: colors.gray[200],
            height: 3,
            borderRadius: 6,
        },
        line: {
            backgroundColor: colors.gray[700],
            height: 3,
            width: 50,
            borderRadius: 6,
        },
        notification: {
            fontSize: 12,
            fontFamily: fonts.heading.regular,
            color:colors.grey[700]
        },
        mx3: {
            marginHorizontal: 10
        }
    });

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text
                    style={[styles.title]}>{title}</Text>
                <View style={styles.underlineContainer}>
                    <View style={[styles.line, { width: titleWidth }]} />
                </View>
            </View>
            <View style={styles.cardBody}>{children}</View>
            {!!notification && (
                <View style={styles.cardFooter}>
                    <View style={styles.iconContainer}>
                        <Icon name="bell-o" size={15} type="light" color={color} />
                    </View>
                    <Text style={styles.notification} >{notification}</Text>
                </View>
            )}
        </View>
    );
};



export default HomeCard;
