import { useNavigation } from "@react-navigation/native";
import { Text, Heading, VStack, Spinner } from "native-base";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useDemandes, useFetchDossiers } from "../../api";
import { t } from "i18next";
import Error from "../Error";
import { useAuth } from "../../core";
import { Snackbar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

const Notification = ({ setShowNotification, showNotification }) => {
  const navigation = useNavigation();
  const { ressourceId, hasRole, hasProfile } = useAuth();
  const [isAgencyDirector, setIsAgencyDirector] = useState(false);
  const [isLeaveManager, setIsLeaveManager] = useState(false);
  const { status: statusDemandeConge, data: demandeConge } = useDemandes(
    ressourceId!
  );
  const { data: demandeDossier, status: statusDemandeData } =
    useFetchDossiers();

  useEffect(() => {
    Promise.all([
      hasRole("RP_Conge"),
      hasRole("RP_APPLICATIF"),
      hasProfile("Directeur Agence"),
      hasProfile("Pilote"),
    ]).then(([isRP_Conge, isRP_Applicatif, isAgencyDir, isPilote]) => {
      setIsAgencyDirector(isAgencyDir);
      setIsLeaveManager(isRP_Conge || isRP_Applicatif || isPilote);
    });
  }, []);
  if (statusDemandeConge === "loading" || statusDemandeData === "loading") {
    return <Spinner />;
  }

  if (statusDemandeConge === "error" || statusDemandeData === "error") {
    return (
      <Error errorMessage={`${t("errors.loadingNotificationMessages")}!`} />
    );
  }
  return (
    (isAgencyDirector || isLeaveManager) && (
      <Snackbar
        visible={showNotification}
        onDismiss={() => setShowNotification(false)}
        action={{
          label: "",
          icon: () => <MaterialIcons name="cancel" size={24} color="black" />,
          onPress: () => {
            setShowNotification(false);
          },
        }}
        style={{ backgroundColor: "white", top: 60 }}
      >
        <VStack>
          <Heading fontSize="sm" color="blue.400" mb={2}>
            {t("notification.notifications")}
          </Heading>
          {isLeaveManager && (
            <TouchableOpacity
              onPress={() =>
                demandeConge?.demandeAvalider !== 0 &&
                navigation.navigate({ name: "requestLeave" })
              }
            >
              {demandeConge?.demandeAvalider === 0 ? (
                <Text fontSize="sm" color="red.400">
                  {t("notification.noPendingLeaveRequest")}
                </Text>
              ) : (
                <Text fontSize="sm">
                  {t("notification.pendingLeaveRequest", {
                    count: demandeConge?.demandeAvalider,
                  })}
                </Text>
              )}
            </TouchableOpacity>
          )}

          {isAgencyDirector && (
            <>
              <TouchableOpacity
                onPress={() =>
                  demandeDossier?.pendingCount !== 0 &&
                  navigation.navigate({ name: "administrativeFiles" })
                }
              >
                {demandeDossier?.pendingCount === 0 ? (
                  <Text fontSize="sm" color="red.400">
                    {t("notification.noPendingAdministrativeFiles")}
                  </Text>
                ) : (
                  <Text fontSize="sm">
                    {t("notification.pendingAdministrativeFiles", {
                      count: demandeDossier?.pendingCount,
                    })}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  demandeConge?.demandeAvalider !== 0 &&
                  navigation.navigate({ name: "requestLeave" })
                }
              >
                {demandeConge?.demandeAvalider === 0 ? (
                  <Text fontSize="sm" color="red.400">
                    {t("notification.noPendingLeaveRequest")}
                  </Text>
                ) : (
                  <Text fontSize="sm">
                    {t("notification.pendingLeaveRequest", {
                      count: demandeConge?.demandeAvalider,
                    })}
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </VStack>
      </Snackbar>
    )
  );
};

export default Notification;
