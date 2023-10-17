import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, Spinner, Text } from "native-base";
import { Layout } from "../../components/Layout";
import { FormationParams, useAllFormationsByCriteria } from "../../api";
import SelectButton from "../../ui/Select";
import { t } from "i18next";
import FormationListItem from "../../components/Formation/FormationListItem";

const DEFAULT_PARAMS: FormationParams = {
  trainingState: 'En cours',
  poleID: 0,
  typeID: 0,
  yearFilter: new Date().getFullYear(),
}

export function FormationList({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {

  const [params, setParams] = useState(DEFAULT_PARAMS);

  const { isLoading = false, error = null, data: formations = [], refresh } = useAllFormationsByCriteria(params);

  const selectItems = [
    {
      label: `${t("formation.all")}`,
      value: ""
    },
    {
      label: `${t("formation.finished")}`,
      value: "Accomplie"
    },
    {
      label: `${t("formation.canceled")}`,
      value: "Annulée"
    },
    {
      label: `${t("formation.inProgress")}`,
      value: "En cours"
    },
    {
      label: `${t("formation.predictable")}`,
      value: "Prévisible"
    }
  ]

  const handleSearchByState = (value) => {
    setParams({ ...params, trainingState: value });
  };

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
        <SelectButton handleSearch={handleSearchByState} selectedValue={params?.trainingState} label={`${t("formation.state")}`} selectItems={selectItems} />
        {formations?.map((formation, index) => (
          <FormationListItem onUpdate={()=>refresh()} isUsersFormation={false} navigation={navigation} key={index} item={formation} />
        ))}
      </ScrollView>
    </Layout >
  )
}
