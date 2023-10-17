import React, { useEffect, useState } from "react";
import MyRightRequests from "../../../components/MyRightRequests";
import { TabViewUI } from "../../../ui/TabView";
import { t } from "i18next";
import CollaboratorsRightRequests from "../../../components/CollaboratorsRightRequests";
import { useAuth } from "../../../core";

export function RequestRight() {
  const { hasRole, hasProfile } = useAuth();
  const [isRightManager, setIsRightManager] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([
      hasRole("RP_Conge"),
      hasRole("RP_APPLICATIF"),
      hasRole("Admin"),
      hasProfile("Pilote"),
      hasProfile("Directeur Agence"),
    ]).then(
      ([isRP_Conge, isRP_Applicatif, isAdmin, isPilote, isDirecAgence]) => {
        setIsRightManager(
          isRP_Conge || isRP_Applicatif || isAdmin || isPilote || isDirecAgence
        );
      }
    );
  }, []);
  const myRoutes = [
    {
      key: "first",
      title: t("droit.myRequests"),
    },
    {
      key: "second",
      title: t("droit.myCollaborators"),
    },
  ];
  return (
    <>
      {isRightManager ? (
        <TabViewUI
          myRoutes={myRoutes}
          component1={MyRightRequests}
          component2={CollaboratorsRightRequests}
        />
      ) : (
        <MyRightRequests />
      )}
    </>
  );
}
