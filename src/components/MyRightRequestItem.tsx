import { HStack, VStack, useTheme, Text, Modal } from "native-base";
import { StyleSheet, View, Button } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from "accordion-collapse-react-native";
import ColoredBox from "../ui/ColoredBox";
import React, { useState } from "react";
import { deleteRightRequest } from "../api";
import { t } from "i18next";
import SuccessToast from "../ui/SuccessToast";

interface RightRequestProps {
  item: any;
  refetchMyRightRequest: () => void;
}
const MyRightRequestItem = ({
  item,
  refetchMyRightRequest,
}: RightRequestProps) => {
  const { colors } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleDeleteRequest = async () => {
    try {
      await deleteRightRequest(item.rightRequestId);
      setIsModalVisible(false);
      setShowSuccessToast(true);
      refetchMyRightRequest();
    } catch (error) {
      console.error(t("errors.errorRightRequestDeleting"));
    }
  };
  const handleDeleteAndShowToast = async () => {
    setShowSuccessToast(false);
    handleDeleteRequest();
  };
  function getColorByState(state) {
    switch (state) {
      case "En attente":
        return colors.warning;
      case "validé":
        return colors.success;
      case "refusé":
        return colors.danger;
      default:
        return colors.gray[400];
    }
  }
  const color = getColorByState(item.state);
  function formatDate(givenDate) {
    const parts = givenDate.split(" ")[0].split("-");
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }
  const styles = StyleSheet.create({
    container: {
      margin: 10,
    },
    title: {
      fontSize: 18,
      marginBottom: 5,
      color: colors.gray[600],
    },
    detail: {
      fontSize: 12,
      marginBottom: 5,
      color: colors.gray[400],
    },
    borderTop: {
      borderTopColor: colors.gray[200],
      borderTopWidth: 1,
    },
    requestState: {
      fontWeight: "bold",
      fontSize: 12,
    },
    modalContent: {
      backgroundColor: "white",
      borderRadius: 8,
    },
    modalHeader: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
    modalBody: {
      fontSize: 16,
      marginBottom: 20,
    },
    modalFooter: {
      flexDirection: "row",
      justifyContent: "center",
    },
  });

  return (
    <>
      <View style={[styles.container]}>
        {showSuccessToast && (
          <SuccessToast message={t("droit.successDeletingMessage")} />
        )}
        <VStack>
          <ColoredBox brTopColor={color} color={"white"}>
            <Collapse>
              <CollapseHeader>
                <View style={[{ marginVertical: 5 }]}>
                  <View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <HStack space={4}>
                        <Text style={styles.title}>
                          {item.holidayType.typeLabel}
                        </Text>
                        <Text
                          fontSize="lg"
                          fontWeight="800"
                          bold
                          color={colors.blue[500]}
                          _dark={{
                            color: colors.grey[100],
                          }}
                        >
                          <Text bold>
                            {item.holidayType.typeDuration} {t("droit.days")}{" "}
                          </Text>
                        </Text>
                      </HStack>
                      <Icon
                        name={"chevron-down"}
                        size={12}
                        type="light"
                        style={[styles.detail]}
                      />
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text style={[styles.detail]}>
                        {formatDate(item.dateRight)}
                      </Text>
                    </View>
                  </View>
                </View>
              </CollapseHeader>
              <CollapseBody>
                <Text style={[styles.title, { marginBottom: 15 }]}>
                  {t("droit.details")}
                </Text>
                <View style={[styles.borderTop, { padding: 5 }]}>
                  <View style={[styles.title, { marginVertical: 5 }]}>
                    <View>
                      <Text
                        style={[
                          styles.requestState,
                          { color: getColorByState(item.state) },
                        ]}
                      >
                        {t("conge.state")}: {item.state}
                      </Text>
                    </View>
                  </View>
                  <HStack justifyContent="flex-end">
                    <Icon
                      name="trash"
                      size={20}
                      color="red"
                      onPress={() => setIsModalVisible(true)}
                    />
                  </HStack>
                </View>
              </CollapseBody>
            </Collapse>
          </ColoredBox>
          <Modal
            isOpen={isModalVisible}
            onClose={() => setIsModalVisible(false)}
          >
            <Modal.Content style={styles.modalContent}>
              <Modal.CloseButton />
              <Modal.Header style={styles.modalHeader}>
                {t("confirmations.confirmation")}
              </Modal.Header>
              <Modal.Body style={styles.modalBody}>
                {t("confirmations.deleteConfirm", {
                  requestType: t("droit.right"),
                })}
              </Modal.Body>
              <Modal.Footer style={styles.modalFooter}>
                <Button
                  title={t("actions.delete")}
                  onPress={handleDeleteAndShowToast}
                  color="red"
                />
                <Button
                  title={t("actions.cancel")}
                  onPress={() => setIsModalVisible(false)}
                />
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </VStack>
      </View>
    </>
  );
};

export default MyRightRequestItem;
