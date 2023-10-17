import { Role } from './../../core/Auth/index';
import axios from "axios"
import { useQuery } from "react-query";

const RESOURCE_URL = "/api/ressourceProjet/ressources";

type LeaveResponsible = {
  ressourceId: number;
  firstName: string;
  lastName: string;
}
export interface Ressource {
  ressourceId: number;
  adress: string;
  birthDate: Date;
  email: string;
  firstName: string;
  hireDate: Date;
  lastName: string;
  level: string;
  lieuNaissance: null;
  nombreEnfant: number;
  nombreExper: number;
  leaveResponsible: LeaveResponsible;
  phone: string;
  photo: string;
  profil: {
    id: number | null;
    label: string | null;
  };
  profession: {
    code: string
    description: string
    professionId: number
  };
  roles: Role[];
};

export type RessourceParams = {
  username: string | null;
};
export const fetchRessource = async (
  params: RessourceParams
): Promise<Ressource> => {
  const response = await axios.get<Ressource>(
    `${RESOURCE_URL}/${params.username}`
  );
  const {
    ressourceId,
    adress,
    birthDate,
    email,
    firstName,
    hireDate,
    lastName,
    level,
    photo,
    lieuNaissance,
    nombreEnfant,
    nombreExper,
    leaveResponsible,
    profil,
    phone,
    roles,
    profession
  } = response.data;
  return {
    ressourceId,
    adress,
    birthDate,
    email,
    firstName,
    hireDate,
    lastName,
    level,
    photo,
    lieuNaissance,
    nombreEnfant,
    nombreExper,
    leaveResponsible,
    profil,
    phone,
    roles,
    profession
  }

}


export const useRessource = (params: RessourceParams) => {
  return useQuery<Ressource, Error>(
    ["repoData"],
    async () => await fetchRessource(params),
    {
      enabled: !!params.username,
    }
  )
}


export const getRessourceById = async (idRessource: number): Promise<Ressource> => {
  const response = await axios.get(`${RESOURCE_URL}`, {
    params: {
      idRessource: idRessource,
    },
  });
  return response.data;
};

export const useRessourceById = (idRessource: number) => {
  return useQuery<Ressource, Error>(
    ['ressource', idRessource],
    async () => await getRessourceById(idRessource),
    {
      enabled: !!idRessource
    }
  )
}


