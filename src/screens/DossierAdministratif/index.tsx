import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Alert } from "react-native";
import {
  Box,
  Button,
  Center,
  CheckIcon,
  FormControl,
  Input,
  Modal,
  ScrollView,
  Select,
  Spinner,
  useToast,
  View,
  Text,
} from "native-base";
import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { t } from "i18next";
import Icon from "@expo/vector-icons/FontAwesome";
import Error from "../../components/Error";
import {
  DocumentRequest,
  RessourceParams,
  Template,
  useDeleteDossierAdmin,
  useAddDemande,
  useDocsRequest,
  useDocsRequestByResource,
  useFetchAllTemplates,
  useFilterDemandes,
  useRessource,
} from "../../api";
import AdminDocsRequest from "../../components/DossierAdministratif/AdminDocsRequest";
import { AddButton } from "../../ui/Buttons/AddButton";
import { useAuth } from "../../core";
import { KeyboardAvoidingView } from "react-native";

const DEFAULT_PARAMS = {
  trainingState: "En attente",
};
export function DossierAdministratif({
  navigation,
}: {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}) {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const { username, ressourceId, hasRole } = useAuth();
  const {
    data: adminDemands,
    status: demandsStatus,
    refetch: refetchAdminDocs,
  } = useDocsRequest();
  const {
    data: resourceDemands,
    status: demandsStatusForResource,
    refetch: refetchDocsByResource,
  } = useDocsRequestByResource(ressourceId);
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [motif, setMotif] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template>();
  const { data: allTemplates, isLoading, error } = useFetchAllTemplates();

  const { data: dataUserInfos } = useRessource({ username } as RessourceParams);
  const [isAdmin, setIsAdmin] = useState<Boolean>();
  useEffect(() => {
    hasRole("Admin").then((hasRoleAdmin) => {
      setIsAdmin(hasRoleAdmin);
    });
  }, [adminDemands, resourceDemands]);
  if (demandsStatus === "loading" && demandsStatusForResource === "loading") {
    return (
      <Center display="flex" alignItems={"center"} justifyContent="center">
        <Spinner />
      </Center>
    );
  }
  const handleShowModal = () => {
    setShowModal(true);
  };
  if (demandsStatus === "error" && demandsStatusForResource === "error") {
    return <Error errorMessage={`${t("errors.loadingDemandesDocsInfo")}!`} />;
  }
  const handleSearchByState = (value) => {
    setParams({ ...params, trainingState: value });
  };
  const filteredDemandes = (demandes: any[]) => {
    return params.trainingState === "En attente"
      ? useFilterDemandes(demandes, "PENDING")
      : params.trainingState === "Traité"
      ? useFilterDemandes(demandes, "TREATED")
      : demandes;
  };
  const handleInputChange = (text: string) => {
    setMotif(text);
  };
  const handleSelectChange = (itemValue): void => {
    const selectedTemplateObj = allTemplates?.find(
      (template) => template.name === itemValue
    );
    setSelectedTemplate(selectedTemplateObj);
  };
  const handlePress = (): void => {
    if (!dataUserInfos && dataUserInfos.ressourceId === null) {
      throw new Error(t("errors.loadingUserInfo"));
    } else {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      const newDocRequest: DocumentRequest = {
        state: "PENDING",
        date: formattedDate,
        motive: motif,
        resource: dataUserInfos,
        template: selectedTemplate,
        requestTemplates: [],
      };
      useAddDemande(newDocRequest)
        .then(() => {
          setShowModal(false);
          if (isAdmin) {
            refetchAdminDocs();
          } else {
            refetchDocsByResource();
          }
          toast.show({
            title: "_____success_____",
            placement: "top",
            duration: 2000,
            render: () => {
              return (
                <Box
                  bg="success"
                  px="2"
                  py="1"
                  rounded="sm"
                  mb={5}
                  color="white"
                >
                  <Text color="light">La demande a été ajouté avec succés</Text>
                </Box>
              );
            },
          });
          setMotif("");
        })
        .catch(() => {
          toast.show({
            title: "______Error_______",
            placement: "top",
            duration: 2000,
            render: () => {
              return (
                <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>
                  <Text color="light">une erreur s'est produite</Text>
                </Box>
              );
            },
          });
        });
    }
  };
  const handleDelete = (id: number) => {
    Alert.alert("", `${t("confirmations.confirmDelete")}`, [
      {
        text: `${t("actions.cancel")}`,
        style: "cancel",
      },
      {
        text: `${t("actions.confirm")}`,
        onPress: async () => {
          useDeleteDossierAdmin(id).then(() => {
            if (isAdmin) {
              refetchAdminDocs();
            } else {
              refetchDocsByResource();
            }
          });
        },
      },
    ]);
  };
  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <Layout title="Dossier">
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content width={"88%"}>
            <Modal.CloseButton />
            <Modal.Header textAlign={"center"}>
              {`${t("administrativeFiles.add")}`}
            </Modal.Header>
            <Modal.Body>
              <FormControl mb="1">
                <FormControl.Label>{`${t(
                  "administrativeFiles.document"
                )}`}</FormControl.Label>
                {allTemplates && (
                  <Select
                    minWidth="200"
                    accessibilityLabel={`${t("administrativeFiles.choose")}`}
                    placeholder={`${t("administrativeFiles.addButton")}`}
                    _light={{
                      bgColor: "blue.50",
                    }}
                    _selectedItem={{
                      bg: "white",
                      endIcon: <CheckIcon size="5" />,
                    }}
                    mt={1}
                    selectedValue={selectedTemplate?.name}
                    onValueChange={(itemValue) => handleSelectChange(itemValue)}
                  >
                    {allTemplates.map((template) => (
                      <Select.Item
                        key={template.templateId}
                        label={template.name}
                        value={template.name}
                      />
                    ))}
                  </Select>
                )}
              </FormControl>
              <FormControl mb="1">
                <FormControl.Label>{`${t(
                  "administrativeFiles.reasonLabel"
                )}`}</FormControl.Label>
                <Input
                  value={motif}
                  placeholder={`${t("administrativeFiles.reason")}`}
                  isRequired
                  onChangeText={handleInputChange}
                  _light={{
                    bgColor: "blue.50",
                  }}
                />
              </FormControl>
            </Modal.Body>
            <Modal.Footer alignItems={"center"} justifyContent={"center"}>
              <Button
                onPress={handlePress}
                bgColor={"success"}
                borderRadius={20}
                width={200}
              >
                {`${t("administrativeFiles.addButton")}`}
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
        <ScrollView
          contentContainerStyle={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginHorizontal: 6,
            }}
          >
            <Box style={{ flexBasis: "40%" }}>
              <Select
                variant="filled"
                bgColor={"white"}
                dropdownIcon={
                  <Icon style={{ marginRight: 10 }} name="chevron-down" />
                }
                minWidth={100}
                selectedValue={params?.trainingState}
                accessibilityLabel={`${t("administrativeFiles.state")}`}
                placeholder={`${t("administrativeFiles.state")}`}
                _selectedItem={{
                  bg: "white",
                }}
                mt={1}
                onValueChange={handleSearchByState}
              >
                <Select.Item
                  label={`${t("administrativeFiles.all")}`}
                  value=""
                />
                <Select.Item
                  label={`${t("administrativeFiles.treated")}`}
                  value="Traité"
                />
                <Select.Item
                  label={`${t("administrativeFiles.pending")}`}
                  value="En attente"
                />
              </Select>
            </Box>
          </View>
          {adminDemands &&
            isAdmin &&
            filteredDemandes(adminDemands).map((demande, index) => (
              <AdminDocsRequest
                key={index}
                item={demande}
                handleDelete={() => handleDelete(demande.idRequest)}
              />
            ))}
          {!isAdmin &&
            resourceDemands &&
            filteredDemandes(resourceDemands).map((demande, index) => (
              <AdminDocsRequest
                key={index}
                item={demande}
                handleDelete={() => handleDelete(demande.idRequest)}
              />
            ))}
        </ScrollView>
        <AddButton title="Dossier" showModalProp={handleShowModal} />
      </Layout>
    </KeyboardAvoidingView>
  );
}
