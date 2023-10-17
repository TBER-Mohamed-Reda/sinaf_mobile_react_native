import { useState } from "react";
import { useAuth } from "../core";
import { HStack, ScrollView, Spinner, VStack } from "native-base";
import React from "react";
import { t } from "i18next";
import Error from "./Error";
import {
  useCollaboratorsRightRequests,
  RightRequestsParams,
  useCurrentPeriod,
} from "../api";
import CollaboratorsRightRequestItem from "./CollaboratorsRightRequestItem";
import { RightRequestState } from "../enums/RightRequestState";
import { FilterButton } from "../ui/Buttons/FilterButton";
import BottomSheetHeader from "../ui/BottomSheetHeader";
import RightFilterBottomSheetBody from "./RightFilterBottomSheetBody";
import BottomSheet from "@gorhom/bottom-sheet";

const CollaboratorsRightRequests = () => {
  const { ressourceId } = useAuth();
  const { data: currentPeriod } = useCurrentPeriod();
  const currentYear = currentPeriod?.year!;
  const [isFilterBottomSheetOpen, setIsFilterBottomSheetOpen] = useState(false);

  const DEFAULT_PARAMS: RightRequestsParams = {
    ressourceId: ressourceId!,
    state: RightRequestState.Pending,
    typeID: 0,
    responsibleId: 0,
    projetId: 0,
    dateBegin: currentYear.toString() + "-06-01",
    dateEnd: (currentYear + 1).toString() + "-05-31",
  };
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const {
    data: collaboratorsRightRequests,
    isLoading,
    error,
    refetch: refetchCollaboratorsRightRequest,
  } = useCollaboratorsRightRequests(params);

  const handleRefresh = () => {
    setParams(DEFAULT_PARAMS);
  };
  const handleParamsChange = (myParams) => {
    setParams(myParams);
  };
  const openFilterBottomSheet = () => {
    setIsFilterBottomSheetOpen(true);
  };

  return (
    <>
      <ScrollView
        marginX="4%"
        marginTop="2%"
        showsVerticalScrollIndicator={false}
      >
        <HStack justifyContent="flex-end" m={2}>
          <FilterButton
            onPressForFilter={openFilterBottomSheet}
            onPressForRefresh={handleRefresh}
          />
        </HStack>

        {isLoading ? (
          <Spinner />
        ) : error ? (
          <Error errorMessage={`${t("errors.loadingRightRequests")}!`} />
        ) : (
          collaboratorsRightRequests?.map((req, index) => (
            <CollaboratorsRightRequestItem
              key={index}
              item={req}
              refetchCollaboratorsRightRequest={
                refetchCollaboratorsRightRequest
              }
            />
          ))
        )}
      </ScrollView>
      <BottomSheet
        index={isFilterBottomSheetOpen ? 1 : 0}
        onChange={(index) => setIsFilterBottomSheetOpen(index > 0)}
        snapPoints={[10, 400]}
        enablePanDownToClose
      >
        <VStack
          justifyContent="center"
          alignItems="center"
          padding={1}
          space={3}
        >
          <BottomSheetHeader title={t("droit.rightTitleBottomSheet")} />
          <RightFilterBottomSheetBody
            handleParamsChange={handleParamsChange}
            params={params}
            handleRefresh={handleRefresh}
          />
        </VStack>
      </BottomSheet>
    </>
  );
};

export default CollaboratorsRightRequests;
