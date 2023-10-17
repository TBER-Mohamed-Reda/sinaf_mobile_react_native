import axios from "axios";
import { UseQueryResult, useQuery } from "react-query";

const RIGHT_REQUEST_FILTER_URL = "/api/conge/rights/filtres";
const RIGHT_REQUEST_URL = "/api/conge/rights";
const PERIOD_URL = "/api/conge/period";
const RIGHT_TYPE_URL = "/api/conge/types/right";

export type RightRequestsParams = {
  ressourceId: number;
  state: string;
  typeID: number;
  responsibleId: number;
  projetId: number;
  dateBegin: string;
  dateEnd: string;
};

export type Period = {
  periodId: number;
  year: number;
};
export type RightType = {
  typeID: number;
  typeLabel: string;
  typeCounted: boolean;
  typeHavingRight: boolean;
  typeDuration: number;
};

export const useRightTypes = () => {
  return useQuery<RightType[]>("rightTypes", async () => {
    const response = await axios.get(RIGHT_TYPE_URL);
    const rightTypes = response.data as RightType[];
    const modifiedRightTypes = rightTypes.slice(3);

    const allTypesOption: RightType = {
      typeID: 0,
      typeLabel: "Tous",
      typeCounted: false,
      typeHavingRight: false,
      typeDuration: 0,
    };

    return [allTypesOption, ...modifiedRightTypes];
  });
};

const fetchPeriods = async (): Promise<Period[]> => {
  const response = await axios.get<Period[]>(PERIOD_URL);
  return response.data;
};

const getPeriodListSize = async (): Promise<number> => {
  const periods = await fetchPeriods();
  return periods.length;
};

export const updateRequestState = async (rightRequest, newState) => {
  try {
    rightRequest.state = newState;
    const response = await axios.put(RIGHT_REQUEST_URL, rightRequest);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getCurrentPeriod = async (): Promise<Period> => {
  const periods = await fetchPeriods();
  return periods.reduce((prev, current) =>
    prev.year > current.year ? prev : current
  );
};
export const deleteRightRequest = async (id) => {
  try {
    const response = await axios.delete(`${RIGHT_REQUEST_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addRightRequest = async (newRightRequest) => {
  try {
    const response = await axios.post(RIGHT_REQUEST_URL, newRightRequest);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchRightRequests = async (
  paramsRequest: RightRequestsParams,
  url: string
) => {
  const params = {
    state: paramsRequest.state,
    typeID: paramsRequest.typeID,
    dateBegin: paramsRequest.dateBegin,
    dateEnd: paramsRequest.dateEnd,
  };
  const response = await axios.get(url, {
    params,
  });
  return response.data;
};

export const useRightRequests = (params: RightRequestsParams, url: string) => {
  return useQuery([url, params], async () => fetchRightRequests(params, url), {
    enabled: !!params.ressourceId && !!params.dateBegin && !!params.dateEnd,
  });
};

export const useMyRightRequests = (params: RightRequestsParams) => {
  const url = `${RIGHT_REQUEST_FILTER_URL}/${params.ressourceId}`;
  return useRightRequests(params, url);
};

export const useCollaboratorsRightRequests = (params: RightRequestsParams) => {
  const url = `${RIGHT_REQUEST_FILTER_URL}/${params.projetId}/${params.responsibleId}/${params.ressourceId}`;
  return useRightRequests(params, url);
};

export const useCurrentPeriod = () => {
  return useQuery<Period, Error>("currentPeriod", getCurrentPeriod);
};

export const usePeriodListSize = (): UseQueryResult<number> => {
  return useQuery<number>("periodListSize", getPeriodListSize);
};
