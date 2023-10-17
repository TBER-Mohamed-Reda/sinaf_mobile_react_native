import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Modal, Radio, Text, Toast, View, useTheme, useToast } from "native-base";
import { t } from "i18next";
import { FormationSession, UpdateSessionRequest, useUpdateSessionState } from "../../api";
import Icon from "@expo/vector-icons/FontAwesome";

type SessionProps = {
    session: FormationSession;
    onUpdate: () => void;
};

const SessionState: React.FC<SessionProps> = ({ session, onUpdate }: SessionProps) => {
    const today = new Date();
    const [dateBeginPart, timeBeginPart] = session.beginDate.split(' ');
    const [yearBegin, monthBegin, dayBegin] = dateBeginPart.split('-');
    const [hourBegin, minuteBegin] = timeBeginPart.split(':');

    const beginDate = new Date(
        parseInt(yearBegin),
        parseInt(monthBegin) - 1,
        parseInt(dayBegin),
        parseInt(hourBegin),
        parseInt(minuteBegin)
    );

    const [dateEndPart, timeEndPart] = session.endDate.split(' ');
    const [yearEnd, monthEnd, dayEnd] = dateEndPart.split('-');
    const [hourEnd, minuteEnd] = timeEndPart.split(':');

    const endDate = new Date(parseInt(yearEnd),
        parseInt(monthEnd) - 1,
        parseInt(dayEnd),
        parseInt(hourEnd),
        parseInt(minuteEnd)
    );

    const { colors } = useTheme();

    const [open, setOpen] = useState(false);
    const [selectedState, setSelectedState] = useState(session.state);
    const [request, setRequest] = useState<UpdateSessionRequest>()

    const toast = useToast()

    const openModal = () => {
        setOpen(true);
    };

    const handelUpdate = () => {
        setOpen(false);
        toast.show({
            description: "Updating"
        })
        setRequest({
            beginDate: session.beginDate,
            duration: session.duration,
            endDate: session.endDate,
            former: session.former,
            participants: session.participants,
            sessionID: session.sessionID,
            state: selectedState,
            subject: session.subject,
            trainingCourses: session.trainingCourses,
            trainingID: session.trainingID,
        })
    };

    const states = session.state == 'Prévisible' ?
        ((today >= beginDate) ?
            [
                "En cours",
                "Annulée",
            ] : [
                "Annulée",
            ])
        : (session.state == 'En cours' && today >= endDate) ?
            [
                "Accomplie"
            ] : [session.state];

    const { isLoading } = useUpdateSessionState(request!);

    useEffect(() => {
        !isLoading &&
            onUpdate()
    }, [isLoading])


    return (
        <View>
            <Icon
                onPress={openModal}
                name="edit"
                type="light"
                size={20}
                color={colors.warning.toString()}
            />

            <Modal isOpen={open} onClose={() => setOpen(false)} safeAreaTop={true}>
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton />
                    <Modal.Header>{`${t("formation.editSessionState")}`}</Modal.Header>
                    <Modal.Body>
                        <Radio.Group name="state" defaultValue={session.state} onChange={setSelectedState}>
                            {states.map((state, index) => (
                                <Radio
                                    key={index}
                                    value={state}
                                    variant="ghost"
                                    colorScheme="gray"
                                    size="sm"
                                    my={1}
                                >
                                    {state}
                                </Radio>
                            ))}
                        </Radio.Group>

                        <Button.Group marginTop={5} space={2}>
                            <Button
                                variant="ghost"
                                colorScheme="blueGray"
                                onPress={() => setOpen(false)}
                            >
                                {t("actions.cancel")}
                            </Button>
                            <Button
                                variant="ghost"
                                colorScheme="blueGray"
                                onPress={handelUpdate}
                            >
                                {t("actions.edit")}
                            </Button>
                        </Button.Group>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </View>
    );
};

export default SessionState;
