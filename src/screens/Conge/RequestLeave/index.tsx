import React, { useEffect, useState } from "react";
import { useAuth } from "../../../core";
import { MyHolidayRequests } from "../../../components/MyHolidayRequests";
import { TabViewUI } from "../../../ui/TabView";
import { CollaboratorsHolidayRequests } from "../../../components/CollaboratorsHolidayRequests";
import { t } from "i18next";

export const RequestLeave = () => {
  const { hasRole, hasProfile } = useAuth();
  const [isLeaveManager, setIsLeaveManager] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([
      hasRole("RP_Conge"),
      hasRole("RP_APPLICATIF"),
      hasRole("Admin"),
      hasProfile("Pilote"),
      hasProfile("Directeur Agence"),
    ]).then(
      ([isRP_Conge, isRP_Applicatif, isAdmin, isPilote, isDirecAgence]) => {
        setIsLeaveManager(
          isRP_Conge || isRP_Applicatif || isAdmin || isPilote || isDirecAgence
        );
      }
    );
  }, []);

  const myRoutes = [
    {
      key: "first",
      title: t("conge.myRequests"),
    },
    {
      key: "second",
      title: t("conge.myCollaborators"),
    },
  ];

  if (isLeaveManager)
    return (
      <TabViewUI
        myRoutes={myRoutes}
        component1={MyHolidayRequests}
        component2={CollaboratorsHolidayRequests}
      />
    );
  else return <MyHolidayRequests />;
};
