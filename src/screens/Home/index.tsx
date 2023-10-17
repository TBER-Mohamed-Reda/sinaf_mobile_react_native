import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import {
  FlatList,
  ScrollView,
  Spinner,
  Text,
  useTheme,
  View,
} from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useQuery } from "react-query";
import {
  Counter,
  RessourceParams,
  useFormationsStatsByCriteria,
  useRessource,
  useSolde,
  useDemandes,
  useFetchDossiers,
  useFetchDossiersByResourceId,
  usePeriod,
} from "../../api";
import CourseOverview from "../../components/CourseOverview";
import DocOverView from "../../components/DocOverView";
import Error from "../../components/Error";
import HomeCard from "../../components/HomeCard";
import { Layout } from "../../components/Layout";
import ReservedRoomOverView from "../../components/ReservedRoomOverView";
import Salutation from "../../components/Salutation";
import { Authority, useAuth } from "../../core";
import ColoredBox from "../../ui/ColoredBox";
import { t } from "i18next";
import CongeOverViewEnAttente from "../../components/CongeOverViewEnAttente";
import CongeOverView from "../../components/CongeOverView";

export function Home({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const { colors } = useTheme();
  const { username, ressourceId, hasRole } = useAuth();
  const [isAdmin, setIsAdmin] = useState<Boolean | undefined>(undefined);

  const { data: dataUserInfos } = useRessource({ username } as RessourceParams);

  const today = new Date();

  const { data: fetchDossiersData, error: errorDocs } = useFetchDossiers();
  const {
    data: fetchDossierForResourceData,
    error: errorAdmin,
    isLoading: fetchDossierForResourceLoading,
  } = useFetchDossiersByResourceId(ressourceId!);

  useEffect(() => {
    hasRole("Admin").then((hasRoleAdmin) => {
      setIsAdmin(hasRoleAdmin);
    });
  }, []);

  const {
    isLoading: isLoadingFormations,
    error: errorFormations,
    data: formationData,
  } = useFormationsStatsByCriteria({
    poleID: 0,
    typeID: 0,
    projectId: 0,
    year: today.getFullYear(),
    dateDebut: 1,
    dateFin: 12,
    ressourceId: ressourceId,
  });

  const { data: currentPeriod } = usePeriod();

  const { error: errorSolde, data: solde } = useSolde({
    ressourceId: ressourceId!,
    year: currentPeriod?.year!,
  });

  const reservations = [
    {
      title: "Salle sport",
      date: "12/02/2022 - 12/03/2022",
    },
    {
      title: "Salle Piano",
      date: "12/02/2022 - 12/03/2022",
    },
    {
      title: "Salle Velo",
      date: "12/02/2022 - 12/03/2022",
    },
  ];

  const {
    isLoading,
    error: error,
    data: demandeData,
  } = useDemandes(ressourceId!);

  return (
    <Layout title="Home">
      <ScrollView
        contentContainerStyle={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        {dataUserInfos && <Salutation user={dataUserInfos} />}

        <HomeCard color={colors.green[500]} title={`${t("home.leave")}`}>
          {!solde ? (
            <Spinner />
          ) : errorSolde ? (
            <Error errorMessage={`${t("errors.loadingSolde")}!`} />
          ) : (
            <ColoredBox
              color={
                solde! >= 5
                  ? colors.success
                  : solde! > 0 && solde! < 5
                    ? colors.warning
                    : colors.danger
              }
            >
              <Text color="white" fontFamily="body" fontWeight="300">
                {`${t("home.balance", { balance: solde })}`}
              </Text>
            </ColoredBox>
          )}
          <View style={{ height: 15 }} />
          {dataUserInfos?.profil.label === "Collaborateur" ? (
            <CongeOverViewEnAttente demande={demandeData?.demandeEnAttente} />
          ) : (
            <CongeOverView
              demande2={demandeData?.demandeEnAttente}
              demande1={demandeData?.demandeAvalider}
            />
          )}
        </HomeCard>
        <HomeCard
          color={colors.red[500]}
          title={`${t("home.formationStatistics")}`}
        >
          {!formationData ? (
            <Spinner />
          ) : (
            <CourseOverview data={formationData} />
          )}
        </HomeCard>
        <HomeCard
          color={colors.blue[400]}
          title={`${t("home.administrativeFiles")}`}
        >
          {!fetchDossierForResourceData || (!fetchDossiersData && <Spinner />)}
          {errorDocs && errorAdmin && (
            <Error errorMessage={`${t("errors.loadingAdministrativeFiles")}`} />
          )}
          {isAdmin && <DocOverView demandeStateCounter={fetchDossiersData} />}
          {!isAdmin && (
            <DocOverView demandeStateCounter={fetchDossierForResourceData} />
          )}
        </HomeCard>
        <HomeCard
          color={colors.red[500]}
          title={`${t("home.roomReservation")}`}
        >
          {reservations?.map((reservation, index) => ((
            <ReservedRoomOverView key={index} title={reservation.title} date={reservation.date} />
          )))}
        </HomeCard>
      </ScrollView>
    </Layout>
  );
}
const styles = StyleSheet.create({
  text: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 18,
    fontWeight: "400",
  },
});
