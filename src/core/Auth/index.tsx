import jwtDecode from "jwt-decode";
import  create  from "zustand";
import {
  getToken,
  setToken,
  removeToken,
  TokenType,
  setUsername,
  removeUsername,
  setRessourceId,
  getRessourceId,
  removeRessourceId,
} from "./utils";

interface AuthState {
  token: TokenType | null;
  username: string | null;
  ressourceId: number | null;
  status: "idle" | "signOut" | "signIn";
  signIn: (data: ProfileData) => void;
  signOut: () => void;
  hydrate: () => void;
  hasRole: (
    role:
      | "Col"
      | "Admin"
      | "Formateur"
      | "Pilote"
      | "RP_APPLICATIF"
      | "RP_Conge"
  ) => Promise<boolean>;
  hasProfile: (
    label:
      | "Administrateur"
      | "Collaborateur"
      | "Pilote"
      | "Responsable RH"
      | "Directeur Agence"
  ) => Promise<boolean>;
  hasAuthority: (authority: Authority) => Promise<boolean>;
}

type Right = {
  rightId: number;
  rightCode: string;
  category: string;
  description: string;
};

export enum Authority {
  RESSOURCE_TOUS = "RESSOURCE_TOUS",
  RESERVATION_SALLE_TOUS = "RESERVATION_SALLE_TOUS",
  CONGE_TOUS = "CONGE_TOUS",
  PARAMETRAGE_TOUS = "PARAMETRAGE_TOUS",
  PROJET_TOUS = "PROJET_TOUS",
  FORMATION_TOUS = "FORMATION_TOUS",
  DOSSIER_ADMINISTRATIF_TOUS = "DOSSIER_ADMINISTRATIF_TOUS",
  PARC_INFORMATIQUE_TOUS = "PARC_INFORMATIQUE_TOUS",
  HAUT_DE_GAMME_TOUS = "HAUT_DE_GAMME_TOUS",
  FORMATION_PILOTER = "FORMATION_PILOTER",
}
interface JwtPayload {
  user_name: string;
  profile: {
    id: number | null;
    label: string | null;
  };
  roles: Role[];
  authorities: Authority[];
}

export type Role = {
  id: number | null;
  label: string;
  code: string;
  rights: Right[];
};
export type ProfileData = {
  token: TokenType;
  ressourceId: number;
};

export const useAuth = create<AuthState>((set, get) => ({
  status: "idle",
  token: null,
  username: null,
  ressourceId: null,
  signIn: ({ ressourceId, token }: ProfileData) => {
    const { user_name: username } = jwtDecode<JwtPayload>(token.access);
    setToken(token);
    setUsername(username);
    setRessourceId(ressourceId);
    set({ status: "signIn", token, username, ressourceId });
  },
  hasRole: async (code: string) => {
    const [access] = await getToken();
    const { roles } = jwtDecode<JwtPayload>(access);
    return roles.map((role) => role.code).includes(code);
  },
  hasProfile: async (label: string) => {
    const [access] = await getToken();
    const { profile } = jwtDecode<JwtPayload>(access);
    return profile && profile.label === label;
  },
  hasAuthority: async (authority: Authority) => {
    const [access] = await getToken();
    const { authorities } = jwtDecode<JwtPayload>(access);
    return authorities.includes(authority);
  },
  signOut: async () => {
    await removeToken();
    await removeUsername();
    await removeRessourceId();
    set({ status: "signOut", token: null, username: null, ressourceId: null });
  },
  hydrate: async () => {
    try {
      const [access, refresh] = await getToken();
      const ressourceId = await getRessourceId();
      if (access !== null) {
        const profileData = {
          token: { access, refresh },
          ressourceId,
        };
        get().signIn(profileData);
      } else {
        get().signOut();
      }
    } catch (e) {
      // catch error here
      // Maybe sign_out user!
      console.error("useAuth Error", e);
    }
  },
}));

export const signOut = () => useAuth.getState().signOut();
export const hydrateAuth = () => useAuth.getState().hydrate();
