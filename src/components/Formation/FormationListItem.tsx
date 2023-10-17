import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from "native-base";
import ColoredBox from '../../ui/ColoredBox';
import Icon from '@expo/vector-icons/FontAwesome';
import { t } from 'i18next';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import { FormationItem, useFormationRating } from '../../api';
import SessionOverview from './SessionOverview';
import ShowSessionsByRessourceList from './ShowSessionsByRessourceList';
import RatingOverview from './RatingOverview';

interface FormationItemProps {
    item: FormationItem;
    navigation: any;
    isUsersFormation: boolean;
    onUpdate: () => void;
}

const FormationListItem = ({ navigation, item, isUsersFormation, onUpdate }: FormationItemProps) => {
    const { colors } = useTheme();

    const getColorByState = (state) => {
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

    const formatDate = (givenDate) => {
        const parts = givenDate.split(' ')[0].split('-');

        const year = parts[0];
        const month = parts[1];
        const day = parts[2];

        const formattedDate = `${day}/${month}/${year}`;

        return formattedDate
    }
    const { isLoading, error, data: rating } = useFormationRating(item.trainingID);

    const filteredSession = item.sessions?.filter((session) => !(session.state == 'Annulée'));

    const color = getColorByState(item.state);

    const styles = StyleSheet.create({
        iconContainer: {
            display: 'flex',
            marginHorizontal: 3,
        },
        container: {
            margin: 10
        },
        content: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
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
        stateBox: {
            backgroundColor: color.toString(),
            padding: 10,
            borderRadius: 8,
        },
        state: {
            fontWeight: 'bold',
            fontSize: 12,
            color: color.toString()
        },
        sessionState: {
            fontWeight: 'bold',
            fontSize: 12,
        },
        borderTop: {
            borderTopColor: colors.gray[200],
            borderTopWidth: 1
        },
    });


    return (
        <View style={[styles.container]}>
            <ColoredBox brTopColor={color} color={'white'}>

                <Collapse>
                    <CollapseHeader>
                        <View style={[{ marginVertical: 5 }]}>
                            <View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={styles.title}>
                                        {(item.title.length > 25) ? (item?.title.substring(0, 30) + '...') : item?.title}
                                    </Text>
                                    <Icon
                                        name={'chevron-down'} size={12} type="light" style={[styles.detail]}
                                    />
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[styles.detail]}> {`${t("formation.dateFromTo", { beginDate: formatDate(item.beginDate), endDate: formatDate(item.endDate) })}`}</Text>
                                </View>
                            </View>
                        </View>
                    </CollapseHeader>
                    <CollapseBody>

                        {(item.state != 'Prévisible' && !isLoading && !!rating) && (
                            <RatingOverview rating={rating} />
                        )}
                        {!isUsersFormation ? (
                            (!filteredSession || filteredSession.length === 0) ? <Text style={[styles.detail, { textAlign: 'center' }]}>{`${t("formation.noSessions")}`}</Text> : (
                                <>
                                    <Text style={[styles.title, { marginBottom: 15 }]}>{`${t("formation.sessions")}`}</Text>
                                    {filteredSession.map((session, index) => (
                                        <SessionOverview isTrainingProject={item.isTrainingProject} projectID={item.projectID} onUpdate={() => onUpdate()} key={index} session={session} />
                                    ))}
                                </>
                            ))
                            : (
                                <ShowSessionsByRessourceList onUpdate={() => onUpdate()} trainingID={item?.trainingID} />
                            )
                        }
                    </CollapseBody>
                </Collapse>
            </ColoredBox>
        </View>
    );
};


export default FormationListItem;

