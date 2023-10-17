import { useState } from "react";
import {
  RightRequestsParams,
  useCurrentPeriod,
  useMyRightRequests,
  useRightTypes,
} from "../api";
import { useAuth } from "../core";
import {
  Box,
  FormControl,
  HStack,
  ScrollView,
  Spinner,
  VStack,
} from "native-base";
import React from "react";
import { t } from "i18next";
import Error from "./Error";
import { SoldeCard } from "./SoldeCard";
import MyRightRequestItem from "./MyRightRequestItem";
import { RightRequestState } from "../enums/RightRequestState";
import BottomSheet from "@gorhom/bottom-sheet";
import AddRightRequestForm from "./AddRightRequestForm";
import { FilterButton } from "../ui/Buttons/FilterButton";
import { AddButton } from "../ui/Buttons/AddButton";
import BottomSheetHeader from "../ui/BottomSheetHeader";
import RightFilterBottomSheetBody from "./RightFilterBottomSheetBody";
import SelectButton from "../ui/Select";
import { StyleSheet } from "react-native";

const MyRightRequests = () => {
  const { ressourceId } = useAuth();
  const { data: currentPeriod } = useCurrentPeriod();
  const currentYear = currentPeriod?.year || 0;
  const [selectedType, setSelectedType] = useState<number>(0);
  const [isFilterBottomSheetOpen, setIsFilterBottomSheetOpen] = useState(false);
  const [isAddBottomSheetOpen, setIsAddBottomSheetOpen] = useState(false);
  const DEFAULT_PARAMS: RightRequestsParams = {
    ressourceId: ressourceId!,
    state: RightRequestState.Pending,
    typeID: 0,
    responsibleId: 0,
    projetId: 0,
    dateBegin: currentYear.toString() + "-06-01",
    dateEnd: (currentYear + 1).toString() + "-05-31",
  };
  const [params, setParams] = useState<RightRequestsParams>(DEFAULT_PARAMS);
  const {
    data: myRightRequests,
    isLoading,
    error,
    refetch: refetchMyRightRequest,
  } = useMyRightRequests(params);
  const handleRefresh = () => {
    setSelectedType(0)
    setParams(DEFAULT_PARAMS);
  };
  const { data: rightTypes } = useRightTypes();
  const handleTypeChange = (value: string) => {
    setSelectedType(parseInt(value, 10));
    setParams((prevParams) => ({
      ...prevParams,
      typeID: parseInt(value, 10),
    }));
  };
  const handleParamsChange = (myParams) => {
    setParams(myParams);
  };
  const openFilterBottomSheet = () => {
    setIsFilterBottomSheetOpen(true);
  };
  const openAddBottomSheet = () => {
    setIsAddBottomSheetOpen(true);
  };
  return (
    <>
      <ScrollView
        marginX="4%"
        marginTop="2%"
        showsVerticalScrollIndicator={false}
      >
        <HStack justifyContent="space-between" m={1}>
          <Box width={130}>
            <SoldeCard year={currentYear}></SoldeCard>
          </Box>
          <HStack>
            <FilterButton
              onPressForFilter={openFilterBottomSheet}
              onPressForRefresh={handleRefresh}
            />
          </HStack>
        </HStack>
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <Error errorMessage={`${t("errors.loadingRightRequests")}!`} />
        ) : (
          myRightRequests?.map((req, index) => (
            <MyRightRequestItem
              key={index}
              item={req}
              refetchMyRightRequest={refetchMyRightRequest}
            />
          ))
        )}
      </ScrollView>
      <BottomSheet
        index={isFilterBottomSheetOpen ? 1 : 0}
        onChange={(index) => setIsFilterBottomSheetOpen(index > 0)}
        snapPoints={[10, 500]}
        enablePanDownToClose
      >
        <VStack
          justifyContent="center"
          alignItems="center"
          padding={1}
          space={2}
        >
          <BottomSheetHeader title={t("droit.rightTitleBottomSheet")} />
          <FormControl.Label style={styles.label}>
            {t("conge.holidayType")}
          </FormControl.Label>
          {rightTypes && rightTypes.length > 0 && (
            <SelectButton
              handleSearch={handleTypeChange}
              label={t("droit.typeOfDemand")}
              selectedValue={selectedType.toString()}
              selectItems={rightTypes.map((type) => ({
                label: type.typeLabel,
                value: type.typeID.toString(),
              }))}
            />
          )}
          <RightFilterBottomSheetBody
            handleParamsChange={handleParamsChange}
            params={params}
            handleRefresh={handleRefresh}
          />
        </VStack>
      </BottomSheet>
      <BottomSheet
        index={isAddBottomSheetOpen ? 1 : 0}
        onChange={(index) => setIsAddBottomSheetOpen(index > 0)}
        snapPoints={[10, 350]}
        enablePanDownToClose
      >
        <AddRightRequestForm refetchMyRightRequest={refetchMyRightRequest} />
      </BottomSheet>
      <AddButton title="congé" showModalProp={openAddBottomSheet} />
    </>
  );
};
const styles = StyleSheet.create({
  label: {
    marginTop: 15,
  },
});

export default MyRightRequests;
