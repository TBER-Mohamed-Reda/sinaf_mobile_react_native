import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useAuth } from "../../core";
import { Ressource } from "../ressource";

const Default_FORMATION_STATS_URL =
  "/api/formation/stats/getMoyenJourHommeFormationByPeriodAndRessource";
const ADMIN_FORMATION_STATS_URL =
  "/api/formation/stats/getStatsGlobaleByMultipleCriteria";
const ALL_FORMATIONS_LIST_URL = "/api/formation/formations/filtres";
const USER_FORMATIONS_LIST_URL = "/api/formation/formations/ressource/";
const FORMER_FORMATIONS_LIST_URL = "/api/formation/formations/";
const MY_FORMATION_SESSION_URL = "/api/formation/sessions/participant/";
const SESSION_GENERAL_AMBIENCE_EVALUATION_URL = "/api/formation/evaluation/session/generalAmbience/";
const SESSION_SUPPORT_QUALITY_EVALUATION_URL = "/api/formation/evaluation/session/supportsQuality/";
const SESSION_ANIMATOR_INTERACTION_EVALUATION_URL =
  "/api/formation/evaluation/session/animatorIntervention/";
const FORMATION_GENERAL_AMBIENCE_EVALUATION_URL = "/api/formation/evaluation/formation/generalAmbience/";
const FORMATION_SUPPORT_QUALITY_EVALUATION_URL = "/api/formation/evaluation/formation/supportsQuality/";
const FORMATION_ANIMATOR_INTERACTION_EVALUATION_URL =
  "/api/formation/evaluation/formation/animatorIntervention/";
const SESSION_BY_RESSOURCE_EVALUATION_URL = "/api/formation/evaluation/sessionByResource/";
const SAVE_RATING_URL = "/api/formation/evaluation"
const UPDATE_SESSION_STATE = '/api/formation/sessions'
const PARTICIPANTS_URL = "/api/formation/participants/"
const SESSION_PRESENCE_URL = "api/formation/participants/present/"
const SESSION_ABSENCE_URL = "/api/formation/participants/absent/"
const GET_USERS_IN_PRODUCTION = "/api/formation/ressources/search"

export type stateKey = "Accomplie" | "Annulée" | "En cours" | "Prévisible" | "";

export type FormationStats = {
  data: Map<stateKey, number>;
};

export type FormationParams = {
  trainingState?: stateKey;
  poleID?: number;
  typeID?: number;
  projectId?: number;
  yearFilter?: number;
  year?: number;
  dateDebut?: number;
  dateFin?: number;
  ressourceId?: number | null;
  username?: string | null;
};

export type FormationTrainingPole = {
  poleDescription: string;
  poleID: number;
  poleLabel: string;
};

export type FormationTrainingType = {
  typeDescription: string;
  typeID: number;
  typeLabel: string;
};

export type FormationItem = {
  beginDate: string;
  compteur: number;
  endDate: string;
  isTrainingProject: boolean;
  projectID: number;
  sessions: FormationSession[];
  state: stateKey;
  title: string;
  trainingID: number;
  trainingPole: FormationTrainingPole;
  trainingType: FormationTrainingType;
};

type Former = {
  companyName: string;
  firstName: string;
  formerID: number;
  lastName: string;
  mail: string;
  nafFormer: boolean;
  username: string;
};

export type FormationSession = {
  sessionID: number;
  trainingID: number;
  subject: string;
  beginDate: string;
  duration: number;
  endDate: string;
  former: Former;
  participants: Ressource[];
  state: string;
  trainingCourses: any[];
};

export type SessionByRessourceRating = {
  sessionID: number;
  ressource: Ressource;
  comment: string;
  supportsQuality: number
  animatorIntervention: number
  generalAmbience: number
}

export type RateRequest = {
  sessionID: number;
  animatorIntervention: number;
  comment: string;
  generalAmbience: number;
  ressource?: Ressource;
  supportsQuality: number;
};

export type SessionRating = {
  generalAmbienceRatingResponse: number;
  animatorInterventionRatingResponse: number;
  supportsQualityRatingResponse: number;
};

export type SessionParams = {
  ressourceID: number | null
  trainingID: number
};

export type MarkPresence = {
  isPresent: boolean | undefined,
  ressourceID: number,
  sessionID: number
}

export type UpdateSessionRequest = {
  beginDate: string
  duration: number
  endDate: string
  former: Former
  participants: Ressource[]
  sessionID: number
  state: string
  subject: string
  trainingCourses: FormationItem[]
  trainingID: number
}

export const fetchAllFormationsStatsByCriteria = async (
  params: FormationParams
): Promise<FormationStats> => {
  const response = await axios.get(ADMIN_FORMATION_STATS_URL, { params });
  return response.data;
};

export const fetchCurrentUserFormationsStatsByCriteria = async (
  params: FormationParams
): Promise<FormationStats> => {
  const response = await axios.get(`${Default_FORMATION_STATS_URL}`, {
    params,
  });
  return response.data;
};

export const fetchAllFormationsByCriteria = async (
  params: FormationParams
): Promise<FormationItem[]> => {
  const response = await axios.get(ALL_FORMATIONS_LIST_URL, { params });
  return response.data;
};

export const fetchUserFormationsByCriteria = async (
  ressourceId: number | null,
  params: FormationParams
): Promise<FormationItem[]> => {
  const response = await axios.get(
    `${USER_FORMATIONS_LIST_URL}${ressourceId}`,
    { params }
  );
  return response.data;
};

export const fetchFormerFormationsByCriteria = async (
  params: FormationParams
): Promise<FormationItem[]> => {
  const response = await axios.get(
    FORMER_FORMATIONS_LIST_URL,
    { params }
  );
  return response.data;
};

export const fetchFormationSessions = async (
  params: SessionParams
): Promise<FormationSession[]> => {

  const sessions = await axios.get(`${MY_FORMATION_SESSION_URL}`, { params });
  return sessions.data;
};

export const fetchSessionRating = async (sessionId: number): Promise<SessionRating> => {
  const generalAmbienceRatingResponse = await axios.get(SESSION_GENERAL_AMBIENCE_EVALUATION_URL + sessionId);
  const animatorInterventionRatingResponse = await axios.get(SESSION_ANIMATOR_INTERACTION_EVALUATION_URL + sessionId);
  const supportsQualityRatingResponse = await axios.get(SESSION_SUPPORT_QUALITY_EVALUATION_URL + sessionId);
  return {
    generalAmbienceRatingResponse: generalAmbienceRatingResponse.data,
    animatorInterventionRatingResponse: animatorInterventionRatingResponse.data,
    supportsQualityRatingResponse: supportsQualityRatingResponse.data,
  };
};

export const fetchFormationRating = async (trainingID: number): Promise<SessionRating> => {
  const generalAmbienceRatingResponse = await axios.get(FORMATION_GENERAL_AMBIENCE_EVALUATION_URL + trainingID);
  const animatorInterventionRatingResponse = await axios.get(FORMATION_ANIMATOR_INTERACTION_EVALUATION_URL + trainingID);
  const supportsQualityRatingResponse = await axios.get(FORMATION_SUPPORT_QUALITY_EVALUATION_URL + trainingID);
  return {
    generalAmbienceRatingResponse: generalAmbienceRatingResponse.data,
    animatorInterventionRatingResponse: animatorInterventionRatingResponse.data,
    supportsQualityRatingResponse: supportsQualityRatingResponse.data,
  };
};

export const fetchSessionByRessourceRating = async (
  params: {
    ressourceId: number | null;
    sessionID: number;
  }
): Promise<SessionByRessourceRating> => {
  const response = await axios.get(SESSION_BY_RESSOURCE_EVALUATION_URL, { params });
  return response.data;
};

export const saveUserRating = async (request?: RateRequest): Promise<SessionByRessourceRating> => {
  const response = await axios.post(SAVE_RATING_URL, request);
  console.info(response.status);
  return response.data
};

export const updateUserRating = async (request?: RateRequest): Promise<SessionByRessourceRating> => {
  const response = await axios.put(SAVE_RATING_URL, request);
  console.info(response.status);
  return response.data
};

export const markPresence = async (request?: MarkPresence): Promise<number> => {
  const response = await axios.put(PARTICIPANTS_URL, request);
  console.info(response.status);
  return response.data
};

export const getSessionPresence = async (sessionID: number): Promise<Ressource[]> => {
  const response = await axios.get(SESSION_PRESENCE_URL + sessionID);
  return response.data
};

export const getSessionAbsence = async (sessionID: number): Promise<Ressource[]> => {
  const response = await axios.get(SESSION_ABSENCE_URL + sessionID);
  return response.data
};

export const deleteParticipant = async (sessionID: number, ressourceId: number): Promise<number> => {
  const response = await axios.delete(`${PARTICIPANTS_URL}${sessionID}/${ressourceId}`);
  console.info(response.status)
  return response.data
};

export const getUsersInProduction = async (params): Promise<Ressource[]> => {
  const response = await axios.get(GET_USERS_IN_PRODUCTION, { params });
  console.info(response.status)
  return response.data
};


export const addParticipantToSession = async (request): Promise<number> => {
  const response = await axios.post(PARTICIPANTS_URL, request);
  console.info(response.status)
  return response.data
};

export const useAddParticipantToSession = (request?) => {
  const query = useQuery<number, Error>(["AddParticipantToSession", request], async () => {
    const response = await addParticipantToSession(request);
    return response;
  }, {
    enabled: !!request
  }
  )
  const refresh = () => {
    query.refetch();
  };
  return { ...query, refresh };
};

export const useGetUsersInProduction = (params) => {
  const query = useQuery<Ressource[], Error>(["GetUsersInProduction"], async () => {
    const response = await getUsersInProduction(params);
    return response;
  })
  const refresh = () => {
    query.refetch();
  };
  return { ...query, refresh };
};

export const useDeleteParticipant = (doDelete: boolean, sessionID: number, ressourceId: number) => {
  return useQuery<number, Error>(["DeleteParticipant"], async () => {
    const response = await deleteParticipant(sessionID, ressourceId);
    return response;
  }, {
    enabled: doDelete
  });
};

export const updateSessionState = async (request?: UpdateSessionRequest): Promise<UpdateSessionRequest> => {
  const response = await axios.put(UPDATE_SESSION_STATE, request);
  console.info(response.status);
  return response.data
};

export const useSaveUserRating = (request?: RateRequest) => {
  return useQuery<SessionByRessourceRating, Error>(["SaveUserRating", request], async () => {
    const response = await saveUserRating(request);
    return response;
  }, {
    enabled: !!request
  });
};

export const useUpdateUserRating = (request?: RateRequest) => {
  return useQuery<SessionByRessourceRating, Error>(["UpdateUserRating", request], async () => {
    const response = await updateUserRating(request);
    return response;
  }, {
    enabled: !!request
  });
};

export const useMarkPresence = (request?: MarkPresence) => {
  return useQuery<number, Error>(["MarkPresence", request], async () => {
    const response = await markPresence(request);
    return response;
  }, {
    enabled: request?.isPresent != undefined
  });
};
export const useGetSessionPresence = (sessionID: number) => {
  const query = useQuery<Ressource[], Error>(["GetSessionPresence", sessionID], async () => {
    const response = await getSessionPresence(sessionID);
    return response;
  });

  const refresh = () => {
    query.refetch();
  };

  return { ...query, refresh };
};

export const useGetSessionAbsence = (sessionID: number) => {
  const query = useQuery<Ressource[], Error>(["GetSessionAbsence", sessionID], async () => {
    const response = await getSessionAbsence(sessionID);
    return response;
  });

  const refresh = () => {
    query.refetch();
  };

  return { ...query, refresh };
};

export const useUpdateSessionState = (request?: UpdateSessionRequest) => {
  return useQuery<UpdateSessionRequest, Error>(["updateSessionState", request], async () => {
    const response = await updateSessionState(request);
    return response;
  }, {
    enabled: !!request
  });
};

export const useFormationsStatsByCriteria = (params: FormationParams) => {
  const { hasRole } = useAuth();

  const [isAdmin, setIsAdmin] = useState<Boolean>();

  useEffect(() => {
    hasRole("Admin").then((res) => {
      setIsAdmin(res);
    });
  }, []);
  return useQuery<FormationStats, Error>(
    ["HomePageFormationsStats"],
    async () => {
      if (isAdmin) {
        return await fetchAllFormationsStatsByCriteria(params);
      }
      return await fetchCurrentUserFormationsStatsByCriteria(params);
    },
    {
      enabled: isAdmin != undefined,
    }
  );
};

export const useAllFormationsByCriteria = (params: FormationParams) => {
  const query = useQuery<FormationItem[], Error>(
    ["AllFormationsList", params],
    async () => await fetchAllFormationsByCriteria(params)
  );

  const refresh = () => {
    query.refetch();
  };

  return { ...query, refresh };
};

export const useUserFormationsByCriteria = (
  ressourceId: number | null,
  params: FormationParams
) => {
  const query = useQuery<FormationItem[], Error>(
    ["UserFormationsList", params],
    async () => await fetchUserFormationsByCriteria(ressourceId, params)
  );
  const refresh = () => {
    query.refetch();
  };

  return { ...query, refresh };
};

export const useFormerFormationsByCriteria = (
  params: FormationParams
) => {
  const query = useQuery<FormationItem[], Error>(
    ["FormerFormationsList", params],
    async () => await fetchFormerFormationsByCriteria(params)
  );
  const refresh = () => {
    query.refetch();
  };

  return { ...query, refresh };
};

export const useSessionRating = (sessionId: number) => {
  const query = useQuery<SessionRating, Error>(
    ["SessionRating", sessionId],
    async () => await fetchSessionRating(sessionId)
  );
  const refresh = () => {
    query.refetch();
  };

  return { ...query, refresh };
};

export const useFormationRating = (sessionId: number) => {
  const query = useQuery<SessionRating, Error>(
    ["FormationRating", sessionId],
    async () => await fetchFormationRating(sessionId)
  );
  return query;
};

export const useSessionByRessourceRating = (
  params: {
    ressourceId: number | null;
    sessionID: number;
  }
) => {
  const query = useQuery<SessionByRessourceRating, Error>(
    ["SessionRatingByRessourc", params],
    async () => await fetchSessionByRessourceRating(params)
  );
  const refresh = () => {
    query.refetch();
  };

  return { ...query, refresh };
};

export const useFormationSessions = (
  params: SessionParams
) => {
  const query = useQuery<FormationSession[], Error>(
    ["FormationSessions", params],
    async () => await fetchFormationSessions(params)
  );
  return query;
};
