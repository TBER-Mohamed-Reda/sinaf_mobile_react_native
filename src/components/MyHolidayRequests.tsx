import React, { useCallback, useRef, useState } from "react";
import {
  Flex,
  ScrollView,
  Spinner,
  VStack,
  Text,
  View,
  useTheme,
} from "native-base";
import { useAuth } from "../core";
import { HolidayRequestsParams, useMyHolidayRequests, usePeriod } from "../api";
import { SoldeCard } from "./SoldeCard";
import { FilterButton } from "../ui/Buttons/FilterButton";
import { t } from "i18next";
import Error from "./Error";
import { MyHolidayRequestItem } from "./MyHolidayRequestItem";
import { StyleSheet } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { BottomSheetFilterHoliday } from "./BottomSheetFilterHoliday";
import { AddButton } from "../ui/Buttons/AddButton";

export function MyHolidayRequests() {
  const { ressourceId } = useAuth();
  const { colors } = useTheme();
  const { data: currentPeriod } = usePeriod();
  const [year, setYear] = useState<number>(currentPeriod?.year!);

  const sheetRefFilter = useRef<BottomSheet>(null);
  const [isOpenBottomSheetFilter, setIsOpenBottomSheetFilter] = useState(false);
  const snapPointsSheetFilter = ["100%"];

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

  const DEFAULT_PARAMS: HolidayRequestsParams = {
    ressourceId: ressourceId!,
    state: "En attente",
    typeID: 0,
    dateBegin: year.toString() + "-06-01",
    dateEnd: (year + 1).toString() + "-05-31",
  };

  const [params, setParams] = useState(DEFAULT_PARAMS);

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
    refetchMyHolidayRequests();
  };

  const handleSnapPressFilter = useCallback((index) => {
    sheetRefFilter.current?.snapToIndex(index);
    setIsOpenBottomSheetFilter(true);
  }, []);

  const handleParamsChange = (myParams) => {
    setParams(myParams);
  };

  const {
    isLoading = false,
    error = null,
    data: holidayRequests,
    refetch: refetchMyHolidayRequests,
  } = useMyHolidayRequests(params);

  return (
    <>
      <ScrollView
        marginX="4%"
        marginTop="2%"
        showsVerticalScrollIndicator={false}
      >
        <>
          <VStack>
            <Flex direction="row" justify="space-between" mb={4}>
              <SoldeCard year={year}></SoldeCard>
              <FilterButton
                onPressForFilter={() => handleSnapPressFilter(0)}
                onPressForRefresh={() => setParams(DEFAULT_PARAMS)}
              ></FilterButton>
            </Flex>
          </VStack>
          {isLoading ? (
            <Spinner />
          ) : error ? (
            <Error errorMessage={`${t("errors.loadingHolidayRequests")}!`} />
          ) : (
            holidayRequests?.map((req, index) => (
              <MyHolidayRequestItem key={index} item={req} />
            ))
          )}
        </>
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
      {/* <AddButton title={""} showModalProp={() => ""}></AddButton> */}
    </>
  );
}
