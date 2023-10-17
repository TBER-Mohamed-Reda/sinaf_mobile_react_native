import { Button, FormControl, Text } from "native-base";
import SelectButton from "../ui/Select";
import React, { useState } from "react";
import { t } from "i18next";
import { RightRequestState } from "../enums/RightRequestState";
import { useCurrentPeriod, usePeriodListSize } from "../api";
import { StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const RightFilterBottomSheetBody = ({
  handleParamsChange,
  params,
  handleRefresh,
}) => {
  const { data: currentPeriod } = useCurrentPeriod();
  const [currentYear, setCurrentYear] = useState<number>(
    currentPeriod?.year || 0
  );
  const [selectedState, setSelectedState] = useState<RightRequestState>(
    RightRequestState.Pending
  );
  const { data: periodListSize } = usePeriodListSize();
  const length = periodListSize ?? 0;
  const handleStateChange = (value: string) => {
    setSelectedState(value as RightRequestState);
    handleParamsChange({ ...params, state: value as RightRequestState });
  };
  const handlePeriodChange = (value: string) => {
    const yearValue = parseInt(value, 10);
    setCurrentYear(yearValue);
    handleParamsChange({
      ...params,
      dateBegin: yearValue + "-06-01",
      dateEnd: yearValue + 1 + "-05-31",
    });
  };
  const resetFilter = () => {
    setCurrentYear(currentPeriod?.year || 0);
    setSelectedState(RightRequestState.Pending);
    handleRefresh();
  };
  return (
    <>
      <FormControl.Label style={styles.label}>
        {t("droit.state")}
      </FormControl.Label>
      <SelectButton
        handleSearch={handleStateChange}
        label={t("droit.state")}
        selectedValue={selectedState}
        selectItems={Object.values(RightRequestState).map((state) => ({
          label: state === "" ? "Tous" : state,
          value: state,
        }))}
      />
      <FormControl.Label style={styles.label}>
        {t("droit.period")}
      </FormControl.Label>
      <SelectButton
        handleSearch={handlePeriodChange}
        label={t("droit.period")}
        selectedValue={currentYear.toString()}
        selectItems={Array.from({ length }).map((_, index) => {
          const yearValue = currentPeriod?.year! - index;
          return {
            label: `${yearValue}-${yearValue + 1}`,
            value: yearValue.toString(),
          };
        })}
      />
      <Button
        variant="subtle"
        mt={4}
        leftIcon={<MaterialIcons name="cancel" size={24} color="#4B6FB2" />}
        onPress={resetFilter}
      >
        <Text style={{ color: "#4B6FB2" }}>{t("actions.cancel")}</Text>
      </Button>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    marginTop: 15,
  },
});

export default RightFilterBottomSheetBody;
