import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, Spinner, Text } from "native-base";
import { Layout } from "../../components/Layout";
import { FormationParams, useUserFormationsByCriteria } from "../../api";
import FormationListItem from "../../components/Formation/FormationListItem";
import { useAuth } from "../../core";



const DEFAULT_PARAMS: FormationParams = {
    trainingState: 'En cours',
    poleID: 0,
    typeID: 0,
    yearFilter: new Date().getFullYear(),
}

export function MyFormationsList({
    navigation,
}: {
    navigation: NativeStackNavigationProp<any>;
}) {
    const { ressourceId } = useAuth();
    const [params, setParams] = useState(DEFAULT_PARAMS);

    const { isLoading = false, error = null, data: formations = [], refresh } = useUserFormationsByCriteria(ressourceId, params);

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        console.error(error)
        return <Text>An error occurred, please try later...</Text>;
    }

    return (
        <Layout>
            <ScrollView
                contentContainerStyle={{ width: "100%" }}
                showsVerticalScrollIndicator={false}

            >
                {formations?.map((formation, index) => (
                    <FormationListItem onUpdate={() => refresh()} isUsersFormation={true} navigation={navigation} key={index} item={formation} />
                ))}

            </ScrollView>
        </Layout >
    )
}
