import { t } from 'i18next';
import { useTheme } from 'native-base';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FormationStats } from '../api';

type FormationStatsProps = {
    data: FormationStats
}
const CourseOverview: React.FC<FormationStatsProps> = ({ data }: FormationStatsProps) => {

    const { colors, fonts } = useTheme()

    const hexToRgb = (hex: string, alpha: number): string => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    const styles = StyleSheet.create({
        item: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 8,
            marginBottom: 8,
            paddingHorizontal: 16,
            borderBottomColor: colors.gray[200],
            borderBottomWidth: 1,
            alignItems: 'center',
        },
        number: {
            marginRight: 8,
            justifyContent: 'center',
            alignItems: 'center',
            height: 32,
            width: 32,
            borderRadius: 16,
        },
        numberText: {
            fontSize: 18,
            lineHeight: 21,
            opacity: 1,
        },
        title: {
            fontSize: 16,
            marginBottom: 4,
        },
        danger: {
            color: colors.danger.toString(),
        },
        dangerBg: {
            backgroundColor: hexToRgb(colors.danger.toString(), 0.2),
        },
        success: {
            color: colors.success.toString(),
        },
        successBg: {
            backgroundColor: hexToRgb(colors.success.toString(), 0.2),
        },
        primary: {
            color: colors.primary.toString(),
        },
        primaryBg: {
            backgroundColor: hexToRgb(colors.primary.toString(), 0.2),
        },
        warning: {
            color: colors.warning.toString(),
        },
        warningBg: {
            backgroundColor: hexToRgb(colors.warning.toString(), 0.2),
        }
    });
    return (
        <>
            <View style={styles.item}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.number, styles.successBg]}>
                        <Text style={[styles.numberText, styles.success]}>{Math.floor(data['Accomplie'])}</Text>
                    </View>
                    <View>
                        <Text style={[styles.title, styles.success]}>{`${t("formation.finishedPlural")}`}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.item}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.number, styles.primaryBg]}>
                        <Text style={[styles.numberText, styles.primary]}>{Math.floor(data['En cours'])}</Text>
                    </View>
                    <View>
                        <Text style={[styles.title, styles.primary]}>{`${t("formation.inProgress")}`}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.item}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.number, styles.dangerBg]}>
                        <Text style={[styles.numberText, styles.danger]}>{Math.floor(data['Annulée'])}</Text>
                    </View>
                    <View>
                        <Text style={[styles.title, styles.danger]}>{`${t("formation.canceled")}`}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.item}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.number, styles.warningBg]}>
                        <Text style={[styles.numberText, styles.warning]}>{Math.floor(data['Prévisible'])}</Text>
                    </View>
                    <View>
                        <Text style={[styles.title, styles.warning]}>{`${t("formation.predictablePlural")}`}</Text>
                    </View>
                </View>
            </View>
        </>
    );
};
export default CourseOverview;
