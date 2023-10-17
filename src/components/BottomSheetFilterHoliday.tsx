import { t } from "i18next";
import { Button, Flex, FormControl, Modal, Text } from "native-base";
import SelectButton from "../ui/Select";
import React, { useState } from "react";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useHolidayTypes, usePeriod } from "../api";
import { StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

type BottomSheetHolidayProps = {
  params;
  default_params: {
    ressourceId: number;
    state: string;
    typeID: number;
    dateBegin: string;
    dateEnd: string;
  };
  onFilterSuccess: () => any;
  onParamsChange;
};
export const BottomSheetFilterHoliday = ({
  params,
  default_params,
  onFilterSuccess,
  onParamsChange,
}: BottomSheetHolidayProps) => {
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);
  const { data: currentPeriod } = usePeriod();
  const [year, setYear] = useState<number>(params.dateBegin.slice(0, 4));
  const [state, setState] = useState<string>(params.state);
  const [holidayTypeID, setHolidayTypeID] = useState<number>(params.typeID);
  const [dateBegin, setDateBegin] = useState<string>(params.dateBegin);
  const [dateEnd, setDateEnd] = useState<string>(params.dateEnd);
  const [isDateBeginModalVisible, setIsDateBeginModalVisible] = useState(false);
  const [isDateEndModalVisible, setIsDateEndModalVisible] = useState(false);

  const selectPeriods = [
    {
      label: `${currentPeriod?.year}-${currentPeriod?.year! + 1}`,
      value: `${currentPeriod?.year}`,
    },
    {
      label: `${currentPeriod?.year! - 1}-${currentPeriod?.year}`,
      value: `${currentPeriod?.year! - 1}`,
    },
  ];

  const selectStates = [
    {
      label: t("conge.all"),
      value: "",
    },
    {
      label: t("conge.validated"),
      value: "validé",
    },
    {
      label: t("conge.pending"),
      value: "En attente",
    },
    {
      label: t("conge.canceled"),
      value: "annulé",
    },
    {
      label: t("conge.refused"),
      value: "refusé",
    },
  ];

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

  const renderDateBeginPlaceholder = () => {
    const placeholder = dateBegin || "yyyy-mm-dd";
    return <Text style={styles.textDate}>{placeholder}</Text>;
  };
  const renderDateEndPlaceholder = () => {
    const placeholder = dateEnd || "yyyy-mm-dd";
    return <Text style={styles.textDate}>{placeholder}</Text>;
  };

  const handleDateBeginSelect = (date: string) => {
    setDateBegin(date);
    setIsDateBeginModalVisible(false);
  };
  const handleDateEndSelect = (date: string) => {
    setDateEnd(date);
    setIsDateEndModalVisible(false);
  };

  const [myParams, setMyParams] = useState(params);

  const handleFilterPeriod = (value) => {
    setDateBegin(value + "-06-01");
    setDateEnd(parseInt(value) + 1 + "-05-31");
    setYear(value);
  };

  const filterHolidayRequests = () => {
    onParamsChange({
      ...myParams,
      state: state,
      typeID: holidayTypeID,
      dateBegin: dateBegin,
      dateEnd: dateEnd,
    });
    onFilterSuccess();
  };

  const resetFilter = () => {
    onParamsChange(default_params);
    setState(default_params.state);
    setHolidayTypeID(default_params.typeID);
    setDateBegin(default_params.dateBegin);
    setDateEnd(default_params.dateEnd);
    onFilterSuccess();
  };

  return (
    <BottomSheetScrollView>
      <FormControl mb="2" paddingX="14%">
        <FormControl.Label style={styles.label}>{t("conge.period")}</FormControl.Label>
        <SelectButton
          w={"250"}
          handleSearch={handleFilterPeriod}
          label={t("conge.period")}
          selectedValue={year.toString()}
          selectItems={selectPeriods}
        />
        <FormControl.Label style={styles.label}>{t("conge.holidayStatus")}</FormControl.Label>
        <SelectButton
          w={"250"}
          handleSearch={(itemValue) => {
            setState(itemValue);
          }}
          selectedValue={state}
          label={t("conge.state")}
          selectItems={selectStates}
        ></SelectButton>
        <FormControl.Label style={styles.label}>{t("conge.holidayType")}</FormControl.Label>
        <SelectButton
          w={"250"}
          handleSearch={(itemValue) => {
            setHolidayTypeID(parseInt(itemValue));
          }}
          label={t("conge.holidayType")}
          selectedValue={holidayTypeID}
          selectItems={selectHolidayTypes}
        ></SelectButton>
        <FormControl.Label style={styles.label}>{t("conge.dateBegin")}</FormControl.Label>
        <Button
          onPress={() => setIsDateBeginModalVisible(true)}
          style={styles.buttonDate}
        >
          {renderDateBeginPlaceholder()}
        </Button>

        <FormControl.Label style={styles.label}>{t("conge.dateEnd")}</FormControl.Label>
        <Button
          onPress={() => setIsDateEndModalVisible(true)}
          style={styles.buttonDate}
        >
          {renderDateEndPlaceholder()}
        </Button>

        <Flex justify="space-around" direction="row" wrap="nowrap" marginY={"5"}>
          <Button
            variant="ghost"
            colorScheme="blueGray"
            onPress={() => {
              resetFilter();
              setIsOpenBottomSheet(false);
            }}
          >
            {t("conge.cancel")}
          </Button>
          <Button
            variant="ghost"
            colorScheme="blueGray"
            onPress={() => {
              setIsOpenBottomSheet(false);
              filterHolidayRequests();
            }}
          >
            {t("conge.filter")}
          </Button>
        </Flex>
      </FormControl>

      <Modal
        isOpen={isDateBeginModalVisible}
        onClose={() => setIsDateBeginModalVisible(false)}
        size="full"
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>{t("conge.ChooseDateBegin")}</Modal.Header>
          <Modal.Body>
            <Calendar
              style={{
                width: 340,
                backgroundColor: "white",
              }}
              onDayPress={(day) => handleDateBeginSelect(day.dateString)}                
            />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setIsDateBeginModalVisible(false);
                }}
              >
                {t("conge.cancel")}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal
        isOpen={isDateEndModalVisible}
        onClose={() => setIsDateEndModalVisible(false)}
        size="full"
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>{t("conge.ChooseDateEnd")}</Modal.Header>
          <Modal.Body>
            <Calendar
              style={{
                width: 340,
                backgroundColor: "white",
              }}
              onDayPress={(day) => handleDateEndSelect(day.dateString)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setIsDateEndModalVisible(false);
                }}
              >
                {t("conge.cancel")}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </BottomSheetScrollView>
  );
};
const styles = StyleSheet.create({
  label: {
    marginTop: 15,
  },
  title: {
    fontSize: 15,
    marginTop: 15,
    marginLeft: 5,
    color: "light.600",
  },
  textDate: {
    right: "100%",
    fontSize: 13,
    color: "#666",
  },
  buttonDate: {
    marginHorizontal: 8,
    backgroundColor: "white",
    borderColor: "#f5f5f5",
    borderWidth: 1,
    maxWidth: 250,
  },
  icon: {
    left: "100%",
  },
});
