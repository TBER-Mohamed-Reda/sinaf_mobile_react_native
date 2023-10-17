import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, Spinner, Text } from "native-base";
import { Layout } from "../../components/Layout";
import { FormationParams, useFormerFormationsByCriteria } from "../../api";
import FormationListItem from "../../components/Formation/FormationListItem";
import { useAuth } from "../../core";


export function AnimatedFormation({
    navigation,
}: {
    navigation: NativeStackNavigationProp<any>;
}) {
    const { username } = useAuth();

    const DEFAULT_PARAMS: FormationParams = {
        username,
        yearFilter: new Date().getFullYear(),
    }

    const { isLoading = false, error = null, data: formations = [], refresh } = useFormerFormationsByCriteria(DEFAULT_PARAMS);

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <Text>An error occurred, please trz later...</Text>;
    }

    return (
        <Layout>
            <ScrollView
                contentContainerStyle={{ width: "100%" }}
                showsVerticalScrollIndicator={false}

            >
                {formations?.map((formation, index) => (
                    <FormationListItem onUpdate={() => refresh()} isUsersFormation={false} navigation={navigation} key={index} item={formation} />
                ))}
            </ScrollView>
        </Layout >
    )
}
