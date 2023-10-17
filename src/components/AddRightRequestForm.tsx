import { EvilIcons, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Select, VStack, Text, HStack, Button, Input } from "native-base";
import React, { useState } from "react";
import {
  usePeriod,
  useRessourceById,
  useRightTypes,
  RightRequestsParams,
  addRightRequest,
  useMyRightRequests,
  CounterParams,
  useCounter,
} from "../api";
import { useAuth } from "../core";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { t } from "i18next";
import SuccessToast from "../ui/SuccessToast";
import BottomSheetHeader from "../ui/BottomSheetHeader";

const AddRightRequestForm = ({ refetchMyRightRequest }) => {
  const { ressourceId } = useAuth();
  const [selectedType, setSelectedType] = useState<number>(0);
  const { data: currentPeriod } = usePeriod();
  const [typeDuration, setTypeDuration] = useState<string>("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isExistingRequest, setIsExistingRequest] = useState(false);
  const [currentYear, setCurrentYear] = useState<number>(
    currentPeriod?.year || 0
  );
  const { data: ressource } = useRessourceById(ressourceId!);
  const DEFAULT_PARAMS: RightRequestsParams = {
    ressourceId: ressourceId!,
    state: "En attente",
    typeID: 0,
    responsibleId: 0,
    projetId: 0,
    dateBegin: currentYear.toString() + "-06-01",
    dateEnd: (currentYear + 1).toString() + "-05-31",
  };
  const [params, setParams] = useState<RightRequestsParams>(DEFAULT_PARAMS);
  const { data: myRightRequests } = useMyRightRequests(params);
  const { data: rightTypes } = useRightTypes();
  const filteredRightTypes = rightTypes?.filter((type) => type.typeID !== 0);
  const DEFAULT_COUNTER_PARAMS: CounterParams = {
    ressourceId: ressourceId!,
    projetId: 0,
    dateBegin: currentYear.toString() + "-06-01",
    dateEnd: (currentYear + 1).toString() + "-05-31",
  };
  const [counterParams, setCounterParams] = useState<CounterParams>(
    DEFAULT_COUNTER_PARAMS
  );
  const { data: counters } = useCounter(counterParams);
  const clearAddHolidayRequest = () => {
    setSelectedType(0);
    setTypeDuration("");
    setIsExistingRequest(false);
    setParams(DEFAULT_PARAMS);
  };
  const checkExistingRightRequest = (
    selectedType: number,
    ressourceId: number,
    myRightRequests
  ): boolean => {
    if (!myRightRequests) {
      return false;
    }

    const existingRequest = myRightRequests.find(
      (request) =>
        request.holidayType?.typeID === selectedType &&
        request.ressource?.ressourceId === ressourceId
    );
    setIsExistingRequest(!!existingRequest);
    return !!existingRequest;
  };

  const handleTypeChange = (value: string) => {
    const selectedTypeID = parseInt(value, 10) || 0;
    setSelectedType(selectedTypeID);
    const selectedType = rightTypes?.find(
      (type) => type.typeID === selectedTypeID
    );
    setTypeDuration(selectedType?.typeDuration || 0);
    setParams((prevParams) => ({
      ...prevParams,
      typeID: selectedTypeID,
    }));
  };

  const handleAddRight = async () => {
    if (selectedType === 0) {
      return;
    }
    try {
      const selectedTypeDuration =
        rightTypes?.find((type) => type.typeID === selectedType)
          ?.typeDuration || 0;
      const newRightRequest = {
        holidayType: {
          typeID: selectedType,
          typeDuration: selectedTypeDuration,
        },
        ressource: {
          ressourceId: ressourceId!,
          firstName: ressource?.firstName,
          lastName: ressource?.lastName,
        },
        counter: {
          counterId: counters[0].counterId,
        },
        state: "En attente",
      };
      const isExistingRequest = checkExistingRightRequest(
        selectedType,
        ressourceId!,
        myRightRequests
      );
      if (isExistingRequest) {
        return;
      }
      await addRightRequest(newRightRequest);
      setSelectedType(0);
      setTypeDuration("");
      setParams(DEFAULT_PARAMS);
      setShowSuccessToast(true);
      refetchMyRightRequest();
    } catch (error) {
      console.error(error);
    }
  };
  const handleAddAndShowToast = async () => {
    setShowSuccessToast(false);
    handleAddRight();
  };

  return (
    <BottomSheetScrollView>
      {showSuccessToast && (
        <SuccessToast message={t("droit.successAddedMessage")} />
      )}
      <VStack justifyContent="center" alignItems="center" space={2}>
        <BottomSheetHeader title={t("droit.titleRightForm")} />
        <Select
          placeholder="Type de la demande"
          selectedValue={selectedType.toString()}
          minWidth={200}
          variant="filled"
          marginBottom={2}
          bgColor={"white"}
          dropdownIcon={
            <EvilIcons style={{ marginRight: 10 }} name="chevron-down" />
          }
          _selectedItem={{
            bg: "white",
          }}
          onValueChange={handleTypeChange}
        >
          {filteredRightTypes?.map((type) => (
            <Select.Item
              key={type.typeID}
              label={type.typeLabel}
              value={type.typeID.toString()}
            />
          ))}
        </Select>
        {isExistingRequest && (
          <Text style={{ color: "red" }} fontSize="sm" marginBottom={2}>
            {t("droit.existingRightRequestMessage")}
          </Text>
        )}
        <Input
          variant="underlined"
          w="30%"
          placeholder={t("droit.numberOfDays")}
          value={typeDuration.toString()}
          isReadOnly
        />
      </VStack>
      <HStack justifyContent="center" py={7}>
        <Button
          variant="subtle"
          leftIcon={
            <Ionicons name="ios-add-circle-sharp" size={24} color="#199954" />
          }
          onPress={handleAddAndShowToast}
        >
          <Text style={{ color: "#199954" }}>{t("actions.add")}</Text>
        </Button>
        <Button
          variant="subtle"
          leftIcon={<MaterialIcons name="cancel" size={24} color="#4B6FB2" />}
          onPress={clearAddHolidayRequest}
        >
          <Text style={{ color: "#4B6FB2" }}>{t("actions.cancel")}</Text>
        </Button>
      </HStack>
    </BottomSheetScrollView>
  );
};

export default AddRightRequestForm;
