import React, { useCallback, useRef, useState } from "react";
import {
  Text,
  Flex,
  ScrollView,
  Spinner,
  VStack,
  View,
  useTheme,
} from "native-base";
import { useAuth } from "../core";
import {
  CollaboratorsHolidayRequestsParams,
  useCollaboratorsHolidayRequests,
  useHolidayTypes,
  usePeriod,
} from "../api";
import { FilterButton } from "../ui/Buttons/FilterButton";
import { t } from "i18next";
import { CollaboratorsHolidayRequestItem } from "./CollaboratorsHolidayRequestItem";
import { StyleSheet } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { BottomSheetFilterHoliday } from "./BottomSheetFilterHoliday";

export function CollaboratorsHolidayRequests() {
  const { ressourceId } = useAuth();
  const { colors } = useTheme();
  const { data: currentPeriod } = usePeriod();
  const [year, setYear] = useState<number>(currentPeriod?.year!);

  const DEFAULT_PARAMS: CollaboratorsHolidayRequestsParams = {
    ressourceId: ressourceId!,
    state: "En attente",
    collaboratorId: 0,
    typeID: 0,
    dateBegin: year.toString() + "-06-01",
    dateEnd: (year + 1).toString() + "-05-31",
  };

  const [params, setParams] = useState(DEFAULT_PARAMS);

  const [selectHolidayTypes, setSelectHolidayTypes] = useState<
    { label: string; value: number }[]
  >([]);

  const { isLoading: isLoadingHolidayTypes, data: holidayTypes = [] } =
    useHolidayTypes();

  if (!isLoadingHolidayTypes && selectHolidayTypes.length === 0) {
    const tempItems: { label: string; value: number }[] = [];
    holidayTypes.map((requestType) => {
      tempItems.push({
        label: requestType.typeLabel,
        value: requestType.typeID,
      });
    });
    setSelectHolidayTypes([{ label: t("conge.all"), value: 0 }, ...tempItems]);
  }

  const styles = StyleSheet.create({
    headerContainer: {
      alignItems: "center",
      justifyContent: "center",
      height: 40,
      marginBottom: 20,
    },
    headerLine: {
      borderBottomWidth: 1,
      borderBottomColor: "black",
      width: "90%",
      position: "absolute",
      top: 40,
    },
    headerTitle: {
      backgroundColor: "white",
      paddingHorizontal: 10,
      fontWeight: "bold",
      color: colors.blue[400],
    },
  });

  const sheetRefFilter = useRef<BottomSheet>(null);
  const [isOpenBottomSheetFilter, setIsOpenBottomSheetFilter] = useState(false);
  const snapPointsSheetFilter = ["100%"];

  const HeaderFilter = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLine} />
        <Text style={styles.headerTitle}>
          {t("conge.filterHolidayRequests")}
        </Text>
      </View>
    );
  };

  const onFilterSuccess = () => {
    setIsOpenBottomSheetFilter(false);
    refetchCollaboratorsHolidayRequests();
  };

  const handleSnapPressFilter = useCallback((index) => {
    sheetRefFilter.current?.snapToIndex(index);
    setIsOpenBottomSheetFilter(true);
  }, []);

  const handleParamsChange = (myParams) => {
    setParams(myParams);
  };

  const {
    isLoading,
    error = null,
    data: collaboratorsHolidayRequests,
    refetch: refetchCollaboratorsHolidayRequests,
  } = useCollaboratorsHolidayRequests(params);

  return (
    <>
      <ScrollView
        marginX="4%"
        marginTop="2%"
        showsVerticalScrollIndicator={false}
      >
        <VStack>
          <Flex
            direction="row"
            justify="flex-end"
            alignItems="flex-start"
            mb={4}
          >
            <FilterButton
              onPressForFilter={() => handleSnapPressFilter(0)}
              onPressForRefresh={() => setParams(DEFAULT_PARAMS)}
            ></FilterButton>
          </Flex>
        </VStack>
        {!collaboratorsHolidayRequests ? (
          <Spinner />
        ) : (
          <>
            {collaboratorsHolidayRequests.map((req, index) => (
              <CollaboratorsHolidayRequestItem key={index} item={req} />
            ))}
          </>
        )}
      </ScrollView>
      {isOpenBottomSheetFilter && (
        <BottomSheet
          ref={sheetRefFilter}
          snapPoints={snapPointsSheetFilter}
          enablePanDownToClose={true}
          style={{ position: "absolute", zIndex: 9999 }}
          backgroundStyle={{
            shadowColor: "#000",
            borderRadius: 30,
            shadowOffset: {
              width: 0,
              height: 20,
            },
            shadowOpacity: 0.68,
            shadowRadius: 19.0,
            elevation: 30,
          }}
        >
          <HeaderFilter />
          <BottomSheetFilterHoliday
            params={params}
            default_params={DEFAULT_PARAMS}
            onFilterSuccess={onFilterSuccess}
            onParamsChange={handleParamsChange}
          />
        </BottomSheet>
      )}
    </>
  );
}
