import axios from "axios";
import { useQuery } from "react-query";
import { Ressource } from "../ressource";

const DOSSIER_URL = "/api/dossierAdministratif/documentRequest";
const DOSSIER_URL_COLLABORATOR =
  "/api/dossierAdministratif/documentRequest/resource/";
const TEMPLATE_URL = "/api/documents/templats";
const RESSOURCE_URL = "/api/ressourceProjet/ressources";

type Dossier = {
  idRequest: number;
  state: "PENDING" | "TREATED";
  date: string;
  motive: string;
};

export type Counter = {
  pendingCount: number;
  treatedCount: number;
};
export type DocumentRequest = {
  state: "PENDING" | "TREATED";
  date: any;
  motive: string;
  resource: Ressource | undefined;
  template: Template | undefined;
  requestTemplates: RequestTemplate[];
};
export type Template = {
  templateId: number;
  name: string;
  file: string;
  additionalFields: Field[];
};
export type Field = {
  idTemplate: number;
  name: string;
  fieldType: string;
};
export type RequestTemplate = {
  idRequest: number;
  cle: string;
  valeur: string;
};

const fetchDossiers = async (): Promise<Counter> => {
  const response = await axios.get<Dossier[]>(DOSSIER_URL);
  return countDossiers(response.data);
};

const fetchDossiersByResourceId = async (
  resourceId: number
): Promise<Counter> => {
  const response = await axios.get<Dossier[]>(
    `${DOSSIER_URL_COLLABORATOR}${resourceId}`
  );

  return countDossiers(response.data);
};

const countDossiers = (dossiers: Dossier[]): Counter => {
  return dossiers.reduce(
    (counts, dossier) => ({
      pendingCount:
        dossier.state === "PENDING"
          ? counts.pendingCount + 1
          : counts.pendingCount,
      treatedCount:
        dossier.state === "TREATED"
          ? counts.treatedCount + 1
          : counts.treatedCount,
    }),
    { pendingCount: 0, treatedCount: 0 }
  );
};

export const useFetchDossiers = () => {
  return useQuery<Counter, Error>(["dossiers"], fetchDossiers, {
    initialData: { pendingCount: 0, treatedCount: 0 },
  });
};

export const useFetchDossiersByResourceId = (resourceId: number) => {
  return useQuery<Counter, Error>(
    ["dossiersByResourceId", resourceId],
    () => fetchDossiersByResourceId(resourceId),
    {
      initialData: { pendingCount: 0, treatedCount: 0 },
    }
  );
};

const fetchDocRequest = async () => {
  const fetchDemandes = await axios.get(DOSSIER_URL);
  const demandes = fetchDemandes.data;
  const demandesWithTemplateAndResource = await Promise.all(
    demandes.map(async (demande) => {
      const fetchTemplatesById = await axios.get(
        `${TEMPLATE_URL}/${demande.template.templateId}`
      );
      const templateData = fetchTemplatesById.data;
      const fetchResourcesById = await axios.get(
        `${RESSOURCE_URL}?idRessource=${demande.resource.ressourceId}`
      );
      const resourceData = fetchResourcesById.data;
      return { ...demande, template: templateData, resource: resourceData };
    })
  );
  return demandesWithTemplateAndResource;
};
const fetchDocRequestByResource = async (resourceId: number) => {
  const fetchDemandes = await axios.get(
    `${DOSSIER_URL_COLLABORATOR}${resourceId}`
  );
  const demandes = fetchDemandes.data;
  const demandesWithTemplate = await Promise.all(
    demandes.map(async (demande) => {
      const fetchTemplatesById = await axios.get(
        `${TEMPLATE_URL}/${demande.template.templateId}`
      );
      const templateData = fetchTemplatesById.data;
      return { ...demande, template: templateData };
    })
  );
  return demandesWithTemplate;
};

export const useDocsRequest = () => {
  return useQuery(["docsRequest"], async () => await fetchDocRequest());
};
export const useDocsRequestByResource = (resourceId: number) => {
  return useQuery(
    ["docsRequestByResource"],
    async () => await fetchDocRequestByResource(resourceId)
  );
};

export const useAddDemande = async (request: DocumentRequest): Promise<any> => {
  try {
    const response = await axios.post(`${DOSSIER_URL}`, request);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};
export const FetchTemplates = async () => {
  const response = await axios.get<Template[]>(TEMPLATE_URL);
  return response.data;
};
export const useFetchAllTemplates = () => {
  return useQuery<Template[], Error>(["templates"], () => FetchTemplates());
};
export const useFilterDemandes = (demandes: any[], state: string) => {
  return demandes?.filter((demande) => demande.state === state);
};
export const useDeleteDossierAdmin = async (id: number) => {
  return await axios
    .delete(`${DOSSIER_URL}/${id}`)
    .then(() => {
      console.log("_______success_______");
    })
    .catch((error) => {
      console.error(error);
    });
};
