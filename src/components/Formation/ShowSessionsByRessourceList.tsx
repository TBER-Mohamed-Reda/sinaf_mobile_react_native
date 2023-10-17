import React from "react";
import { StyleSheet } from "react-native";
import { Text, View, useTheme } from "native-base";
import { t } from "i18next";
import { FormationSession, useFormationSessions } from "../../api";
import { useAuth } from "../../core";
import SessionOverview from "./SessionOverview";
import Rate from "./Rate";

type SessionProps = {
    trainingID: number;
    sessions?: FormationSession[];
    onUpdate: () => void;
}
const ShowSessionsByRessourceList: React.FC<SessionProps> = ({ trainingID, onUpdate }: SessionProps) => {
    const { colors } = useTheme();
    const { ressourceId } = useAuth();
    const params = {
        trainingID,
        ressourceID: ressourceId
    }
    
    const { isLoading, error, data: sessions } = useFormationSessions(params);
    const filteredSession = sessions?.filter((session) => !(session.state == 'Annulée'));


    const styles = StyleSheet.create({
        title: {
            fontSize: 18,
            marginBottom: 5,
            textTransform: 'capitalize',
            color: colors.gray[600],
        },
        detail: {
            fontSize: 12,
            marginBottom: 5,
            color: colors.gray[400],
        },
    });

    return (
        <>
            {(!filteredSession || filteredSession.length === 0) ? <Text style={[styles.detail, { textAlign: 'center' }]}>{`${t("formation.noSessions")}`}</Text> : (
                <Text style={[styles.title, { marginBottom: 15 }]}>{`${t("formation.sessions")}`}</Text>
            )}
            {
                filteredSession && filteredSession.map((session, index) => (
                    !(session.state == 'Annulée') && (
                        <View key={index}>
                            <SessionOverview rate={true} onUpdate={() => onUpdate()} key={index} session={session} />
                        </View>
                    )
                ))
            }
        </>
    );
};
export default ShowSessionsByRessourceList;