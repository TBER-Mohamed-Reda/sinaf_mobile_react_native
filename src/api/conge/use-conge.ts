import axios from "axios";
import { useQuery } from "react-query";
import { Ressource } from "../ressource";

const PERIOD_URL = "/api/conge/period";
const SOLDE_URL = "/api/conge/holidayes/solde";
const HOLIDAY_REQUESTS_URL = "/api/conge/holidayes/filtres/";
const LEAVE_RESPONSIBLE_URL = "/api/ressourceProjet/ressources";
const DEMANDE_EN_ATTENTE_URL = "/api/conge/holidayes/filtres";
const DEMANDE_EN_ATTENTE_A_VALIDER_URL = "/api/conge/holidayes/filtres/0/0";
const COLLABORATORS_hOLIDAY_REQUESTS_URL = "/api/conge/holidayes/filtres/0";
const HOLIDAY_TYPES_URL = "/api/conge/types";

export interface Period {
  periodId: number;
  year: number;
}
const getPeriodCorrespondingToMaximumYear = async (): Promise<Period> => {
  const response = await axios.get<Array<Period>>(PERIOD_URL);
  return response.data.reduce((prev, current) =>
    prev.year > current.year ? prev : current
  );
};
export const usePeriod = () => {
  return useQuery<Period, Error>(
    ["currentPeriod"],
    async () => await getPeriodCorrespondingToMaximumYear()
  );
};

export const getCurrentYear = async () => {
  const period = await getPeriodCorrespondingToMaximumYear();
  return period.year;
};

export type SoldeParams = {
  ressourceId: number;
  year: number;
};
const getSolde = async (paramsSolde: SoldeParams): Promise<number> => {
  const params = {
    dateBegin: paramsSolde.year ? paramsSolde.year.toString() + "-06-01" : "",
    dateEnd: paramsSolde.year
      ? (parseInt(paramsSolde.year) + 1).toString() + "-05-31"
      : "",
  };
  const response = await axios.get<number>(
    `${SOLDE_URL}/${paramsSolde.ressourceId}`,
    { params }
  );
  return response.data;
};
export const useSolde = (params: SoldeParams) => {
  return useQuery<number, Error>(
    ["solde", params],
    async () => await getSolde(params),
    {
      enabled: !!params.ressourceId && !!params.year,
    }
  );
};

export type HolidayRequestsParams = {
  ressourceId: number;
  state: string;
  typeID: number;
  dateBegin: string;
  dateEnd: string;
};
const fetchMyHolidayRequests = async (paramsRequest: HolidayRequestsParams) => {
  const params = {
    state: paramsRequest.state,
    typeID: paramsRequest.typeID,
    dateBegin: paramsRequest.dateBegin,
    dateEnd: paramsRequest.dateEnd,
  };
  const response = await axios.get(
    HOLIDAY_REQUESTS_URL + paramsRequest.ressourceId,
    {
      params,
    }
  );
  return response.data.sort((holidayReq1, holidayReq2) =>
    new Date(holidayReq1.dateBegin) < new Date(holidayReq2.dateBegin)
      ? 1
      : new Date(holidayReq1.dateBegin) > new Date(holidayReq2.dateBegin)
      ? -1
      : 0
  );
};
export const useMyHolidayRequests = (params: HolidayRequestsParams) => {
  return useQuery(
    ["holidayRequests", params],
    async () => fetchMyHolidayRequests(params),
    {
      enabled: !!params.ressourceId && !!params.dateBegin && !!params.dateEnd,
    }
  );
};

export type LeaveResponsibleParams = {
  leaveResponsibleId: number;
};
const fetchLeaveResponsible = async (
  params: LeaveResponsibleParams
): Promise<Ressource> => {
  const response = await axios.get(`${LEAVE_RESPONSIBLE_URL}`, {
    params: {
      idRessource: params.leaveResponsibleId,
    },
  });
  return response.data;
};
export const useLeaveResponsible = (params: LeaveResponsibleParams) => {
  return useQuery<Ressource>(
    ["leaveResponsible"],
    async () => fetchLeaveResponsible(params),
    {
      enabled: !!params.leaveResponsibleId,
    }
  );
};

export const getDateDebutAndFinForCurrentYear = async () => {
  const currentYear = await getCurrentYear();
  const dateDebut = currentYear
    ? new Date(currentYear, 5, 1).toISOString().slice(0, 10)
    : "";
  const dateFin = currentYear
    ? new Date(currentYear + 1, 4, 31).toISOString().slice(0, 10)
    : "";
  return { dateDebut, dateFin };
};

export const getDemandeEnAttente = async (
  ressourceId: number,
  dateDebut: string,
  dateFin: string
) => {
  try {
    if (ressourceId) {
      const dates = await getDateDebutAndFinForCurrentYear();
      dateDebut = dates.dateDebut;
      dateFin = dates.dateFin;
      const response = await axios.get(
        `${DEMANDE_EN_ATTENTE_URL}/${ressourceId}`,
        {
          params: {
            state: "en attente",
            typeID: 0,
            dateBegin: dateDebut,
            dateEnd: dateFin,
          },
        }
      );
      return response.data.length;
    }
  } catch (error) {
    console.error(error);
  }
};
export const getDemandeEnAttenteAvalider = async (
  ressourceId: number,
  dateDebut: string,
  dateFin: string
) => {
  try {
    if (ressourceId) {
      const dates = await getDateDebutAndFinForCurrentYear();
      dateDebut = dates.dateDebut;
      dateFin = dates.dateFin;
      const response = await axios.get(
        `${DEMANDE_EN_ATTENTE_A_VALIDER_URL}/${ressourceId}`,
        {
          params: {
            state: "en attente",
            typeID: 0,
            dateBegin: dateDebut,
            dateEnd: dateFin,
          },
        }
      );
      return response.data.length;
    }
  } catch (error) {
    console.error(error);
  }
};
export const useDemandes = (ressourceId: number) => {
  const fetchData = async () => {
    const dates = await getDateDebutAndFinForCurrentYear();
    const dateDebut = dates.dateDebut;
    const dateFin = dates.dateFin;

    const demandeEnAttentePromise = getDemandeEnAttente(
      ressourceId,
      dateDebut,
      dateFin
    );
    const demandeAvaliderPromise = getDemandeEnAttenteAvalider(
      ressourceId,
      dateDebut,
      dateFin
    );

    const [demandeEnAttente, demandeAvalider] = await Promise.all([
      demandeEnAttentePromise,
      demandeAvaliderPromise,
    ]);

    return { demandeEnAttente, demandeAvalider };
  };

  return useQuery<{ demandeEnAttente: number; demandeAvalider: number }, Error>(
    ["Demandes"],
    fetchData,
    {
      enabled: !!ressourceId,
    }
  );
};

export type CollaboratorsHolidayRequestsParams = {
  ressourceId: number;
  collaboratorId: number;
  state: string;
  typeID: number;
  dateBegin: string;
  dateEnd: string;
};
const fetchCollaboratorsHolidayRequests = async (
  paramsRequest: CollaboratorsHolidayRequestsParams
) => {
  const params = {
    state: paramsRequest.state,
    typeID: paramsRequest.typeID,
    dateBegin: paramsRequest.dateBegin,
    dateEnd: paramsRequest.dateEnd,
  };
  const response = await axios.get(
    `${COLLABORATORS_hOLIDAY_REQUESTS_URL}/${paramsRequest.collaboratorId}/${paramsRequest.ressourceId}`,
    {
      params,
    }
  );
  return response.data.sort((holidayReq1, holidayReq2) =>
    new Date(holidayReq1.dateBegin) < new Date(holidayReq2.dateBegin)
      ? 1
      : new Date(holidayReq1.dateBegin) > new Date(holidayReq2.dateBegin)
      ? -1
      : 0
  );
};
export const useCollaboratorsHolidayRequests = (
  params: CollaboratorsHolidayRequestsParams
) => {
  return useQuery(["collaboratorsHolidayRequests", params], async () =>
    fetchCollaboratorsHolidayRequests(params)
  );
};

const getHolidayTypes = async () => {
  const response = await axios.get(HOLIDAY_TYPES_URL);
  return response.data;
};

export const useHolidayTypes = () => {
  return useQuery(["holidayTypes"], async () => await getHolidayTypes());
};
