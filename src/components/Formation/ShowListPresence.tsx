import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Input, Text, View, useTheme } from "native-base";

import {
    useGetSessionAbsence,
    useGetSessionPresence,
} from "../../api";
import Participant from "./Participant";
import { t } from "i18next";

const ShowListPresence = ({ isOpen, sessionID, state }) => {
    const { colors } = useTheme();

    const participants: any[] = [];

    const { data: presence, refresh: refreshPresence } = useGetSessionPresence(sessionID);
    const { data: absence, refresh: refreshAbsence } = useGetSessionAbsence(sessionID);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredParticipants, setFilteredParticipants] = useState<any[]>([]);


    if (presence) {
        presence.forEach((element) => {
            const modifiedElement = { ...element, isPresent: true };
            participants.push(modifiedElement);
        });
    };

    if (absence) {
        absence.forEach((element) => {
            const modifiedElement = { ...element, isPresent: false };
            participants.push(modifiedElement);
        });
    };

    useEffect(() => {
        refreshAbsence();
        refreshPresence();
    }, [isOpen, filteredParticipants]);

    const handleSearch = (query) => {
        setSearchQuery(query);

        setFilteredParticipants(participants.filter(function (el) {
            return el.firstName.toLowerCase().includes(query.toLowerCase()) || el.lastName.toLowerCase().includes(query.toLowerCase())
        }));
    };

    const styles = StyleSheet.create({
        borderTop: {
            borderTopColor: colors.gray[200],
            borderTopWidth: 1,
        },
        detail: {
            fontSize: 12,
            marginBottom: 5,
            color: colors.gray[400],
        },
    });

    return (
        <>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            {(participants.length > 0
                && (searchQuery === "" || filteredParticipants.length > 0))
                ? ((searchQuery !== ""
                    ? filteredParticipants
                    : participants).map(
                        (participant, index) => (
                            <Participant
                                sessionID={sessionID}
                                markPresence={(state == "Accomplie" || (state == "En cours"))}
                                key={participant.ressourceId}
                                user={participant}
                            />
                        )
                    ))
                : <Text style={[styles.detail, { textAlign: 'center' }]}>{`${t("formation.noParticipants")}`}</Text>}
        </>
    );
};

export default ShowListPresence;
