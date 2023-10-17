import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Modal, ScrollView, Text, View, useTheme } from "native-base";
import { t } from "i18next";
import RatingOverview from "./RatingOverview";
import { FormationSession, useSessionRating } from "../../api";
import { useAuth } from "../../core";
import ShowListParticipants from "./ShowListParticipants";
import ShowListPresence from "./ShowListPresence";
import UpdateSessionState from "./SessionState";
import Icon from "@expo/vector-icons/FontAwesome";
import Rate from "./Rate";

type SessionProps = {
    session: FormationSession;
    onUpdate: () => void;
    isTrainingProject?: boolean;
    rate?: boolean;
    projectID?: number;
};

const SessionOverview: React.FC<SessionProps> = ({ rate, session, onUpdate, isTrainingProject, projectID }: SessionProps) => {
    const { colors } = useTheme();

    const { isLoading, data: rating, refresh } = useSessionRating(session.sessionID);

    const [isPresenceModalOpen, setIsPresenceModalOpen] = useState(false);
    const openPresenceModal = () => {
        setIsPresenceModalOpen(true);
    };

    const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
    const openParticipantModal = () => {
        setIsParticipantModalOpen(true);
    };

    const { username, hasRole } = useAuth();
    const [isAdmin, setIsAdmin] = useState<Boolean | undefined>(undefined);

    useEffect(() => {
        hasRole("Admin").then((hasRoleAdmin) => {
            setIsAdmin(hasRoleAdmin);
        });
    }, []);


    function getColorByState(state) {
        switch (state) {
            case "En cours":
                return colors.primary;
            case "Accomplie":
                return colors.success;
            case "Annulée":
                return colors.danger;
            default:
                return colors.warning;
        }
    }

    function formatDate(givenDate) {
        const parts = givenDate.split(' ')[0].split('-');

        const year = parts[0];
        const month = parts[1];
        const day = parts[2];

        const formattedDate = `${day}/${month}/${year}`;

        return formattedDate
    }

    const styles = StyleSheet.create({
        title: {
            fontSize: 18,
            marginBottom: 5,
            textTransform: 'capitalize',
            color: colors.gray[600],
        },
        sessionSubject: {
            fontSize: 16,
            marginBottom: 5,
            textTransform: 'capitalize',
            color: colors.gray[600],
        },
        detail: {
            fontSize: 12,
            marginBottom: 5,
            color: colors.gray[400],
        },
        sessionState: {
            fontWeight: 'bold',
            fontSize: 12,
        },
        borderTop: {
            borderTopColor: colors.gray[200],
            borderTopWidth: 1
        }
    });

    return (
        <View style={[styles.borderTop, { padding: 5 }]} key={session.sessionID}>
            <View style={[styles.title, { marginVertical: 5 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.sessionSubject}>
                        {session.subject.length > 20 ? session.subject.substring(0, 20) + '...' : session.subject}
                    </Text>
                    {(username == session.former.username || isAdmin) && (
                        <>
                            <Modal isOpen={isPresenceModalOpen}>
                                <Modal.Content maxWidth="350">
                                    <Modal.Header>{t("actions.presence")}</Modal.Header>
                                    <Modal.Body>
                                        <ScrollView showsVerticalScrollIndicator={false}>
                                            <ShowListPresence isOpen={openPresenceModal} state={session.state} sessionID={session.sessionID} />
                                            <Button.Group marginTop={5} space={2}>
                                                <Button variant="ghost" colorScheme="blueGray" onPress={() => setIsPresenceModalOpen(false)}>
                                                    {t("actions.close")}
                                                </Button>
                                            </Button.Group>
                                        </ScrollView>
                                    </Modal.Body>
                                </Modal.Content>
                            </Modal>

                            <Modal isOpen={isParticipantModalOpen}>
                                <Modal.Content maxWidth="350">
                                    <Modal.Header>{t("formation.participants")}</Modal.Header>
                                    <Modal.Body>
                                        <ScrollView showsVerticalScrollIndicator={false}>
                                            <ShowListParticipants isTrainingProject={isTrainingProject!} projectID={projectID!} onUpdate={() => onUpdate()} sessionID={session.sessionID} participants={session.participants} />
                                            <Button.Group marginTop={5} space={2}>
                                                <Button variant="ghost" colorScheme="blueGray" onPress={() => setIsParticipantModalOpen(false)}>
                                                    {t("actions.close")}
                                                </Button>
                                            </Button.Group>
                                        </ScrollView>
                                    </Modal.Body>
                                </Modal.Content>
                            </Modal>
                        </>
                    )}
                </View>
                <View>
                    <View>
                        <Text style={[styles.detail, {}]}>
                            {`${t("formation.former", { former: session.former.lastName + ' ' + session.former.firstName })}`}
                        </Text>
                        <Text style={[styles.detail, {}]}>
                            {`${t("formation.dateFromTo", { beginDate: formatDate(session.beginDate), endDate: formatDate(session.endDate) })}`}
                        </Text>
                        <Text style={[styles.detail, {}]}>{`${t("formation.duration", { duration: session.duration })}`}</Text>
                    </View>
                </View>
                <View>
                    <Text style={[styles.sessionState, { color: getColorByState(session.state).toString() }]}>{`${t("formation.sessionState", { state: session.state })}`}</Text>
                </View>
            </View>
            {(session.state != 'Prévisible' && !isLoading && !!rating) && <RatingOverview rating={rating} />}
            {(rate && !(session.state == 'Prévisible')) && (
                <Rate onUpdate={() => refresh()} sessionID={session.sessionID} />
            )}
            {(username == session.former.username || isAdmin) && (
                <Button.Group marginTop={5} space={2}>
                    <Button
                        variant="outline"
                        colorScheme="yellow"
                    >
                        <UpdateSessionState onUpdate={() => onUpdate()} session={session} />
                    </Button>
                    <Button
                        isDisabled={!(session.state == "Accomplie" || (session.state == "En cours"))}
                        onPress={openPresenceModal}
                        variant="outline"
                        colorScheme="blueGray"
                    >
                        <Icon
                            name="check"
                            type="light"
                            size={20}
                            color={colors.primary.toString()}
                        />
                    </Button>
                    <Button
                        variant="outline"
                        colorScheme="blueGray" onPress={openParticipantModal}>
                        <Icon
                            name="users"
                            type="light"
                            size={20}
                            color={colors.success.toString()}
                        />
                    </Button>
                </Button.Group>
            )}
        </View>
    );
};

export default SessionOverview;
