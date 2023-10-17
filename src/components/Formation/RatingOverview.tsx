import { Button, Modal, useTheme } from "native-base";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "native-base";
import { SessionRating } from "../../api";
import { t } from "i18next";
import CustomRating from "../../ui/CustomRating";

type ratingProps = {
    rating: SessionRating
}
const RatingOverview: React.FC<ratingProps> = ({ rating }: ratingProps) => {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        title: {
            fontSize: 18,
            marginBottom: 5,
            textTransform: 'capitalize',
            color: colors.gray[600],
        },
        detail: {
            fontSize: 12,
            marginBottom: 5,
            color: colors.gray[400],
        },
    });

    return (
        <View style={[styles.title, { marginVertical: 5 }]}>
            <View style={{ display: 'flex' }}>
                <View>
                    <Text style={{ marginVertical: 5, alignItems: 'center', display: 'flex' }}>
                        <Text style={[styles.detail]}>{t("formation.supportsQuality")}</Text>
                        <CustomRating rating={rating.supportsQualityRatingResponse} />
                    </Text>
                    <Text style={{ marginVertical: 5, alignItems: 'center', display: 'flex' }}>
                        <Text style={[styles.detail]}>{t("formation.animatorIntervention")}</Text>
                        <CustomRating rating={rating.animatorInterventionRatingResponse} />
                    </Text>
                    <Text style={{ marginVertical: 5, alignItems: 'center', display: 'flex' }}>
                        <Text style={[styles.detail]}>{t("formation.generalAmbience")}</Text>
                        <CustomRating rating={rating.generalAmbienceRatingResponse} />
                    </Text>
                </View>
            </View>

        </View>
    );
};
export default RatingOverview;
