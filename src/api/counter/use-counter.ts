import axios from "axios";
import { useQuery } from "react-query";
const COUNTER_URL = "/api/conge/counters/filtres/";

export type CounterParams = {
  ressourceId: number;
  projetId: number;
  dateBegin: string;
  dateEnd: string;
};
export const getCounterByMultipleCriteria = async (
  paramsRequest: CounterParams
) => {
  const params = {
    dateBegin: paramsRequest.dateBegin,
    dateEnd: paramsRequest.dateEnd,
  };
  const response = await axios.get(
    `${COUNTER_URL}+${paramsRequest.projetId}/${paramsRequest.ressourceId}`,
    {
      params,
    }
  );
  return response.data;
};
export const useCounter = (params: CounterParams) => {
  return useQuery(["counters", params], () =>
    getCounterByMultipleCriteria(params)
  );
};
