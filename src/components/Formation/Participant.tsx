import { Checkbox, Image, Pressable, useTheme } from 'native-base';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import { Ressource, useAddParticipantToSession, useDeleteParticipant, useMarkPresence } from '../../api';

type ParticipantProps = {
    sessionID: number;
    user: Ressource & {
        isPresent?: boolean;
    };
    markPresence: boolean;
    isDelete?: boolean;
    addParticipants?: boolean
    onUpdate: () => void;
    updateUsersList?: () => void;
};

const Participant = ({ sessionID, user, markPresence, isDelete, addParticipants, onUpdate, updateUsersList }: ParticipantProps) => {


    const { colors } = useTheme();
    const [doDelete, setDoDelete] = useState<boolean>(false)
    const [request, setRequest] = useState<{ ressourceID: number; sessionID: number } | undefined>(undefined);

    const styles = {
        userRole: {
            fontSize: 12,
            marginBottom: 5,
            color: colors.gray[400],
        },

        borderBottom: {
            borderBottomColor: colors.gray[200],
            borderBottomWidth: 1
        },
    };

    const [params, setParams] = useState({
        isPresent: undefined,
        ressourceID: user.ressourceId,
        sessionID: sessionID
    });

    const { } = useMarkPresence(params);

    const { isLoading: deleteLoading, isSuccess: isDeleteSuccess } = useDeleteParticipant(doDelete, sessionID, user.ressourceId);

    const onDelete = () => {
        setDoDelete(true);
        isDeleteSuccess && onUpdate()
    };

    const { isLoading: addLoading, isSuccess: isAddSuccess } = useAddParticipantToSession(request)

    const handelAdd = () => {
        setRequest({
            ressourceID: user.ressourceId,
            sessionID
        });

        onUpdate()
        if (updateUsersList && isAddSuccess) {
            updateUsersList();
        }
    };

    const handelChange = (value) => {
        setParams(
            {
                isPresent: value,
                ressourceID: user.ressourceId,
                sessionID: sessionID
            }
        );
    };
    return (
        <View style={[{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            alignItems: 'center'
        }, styles.borderBottom]} >
            <View style={{ maxWidth: '150%' }}>
                <Image
                    style={{ width: 25, height: 25, borderRadius: 25 }}
                    source={user?.photo ? { uri: `data:image/jpg;base64,${user?.photo}` } : require("../../../assets/profile.png")}
                    alt="Profile"
                />
            </View>
            <View style={{ width: '85%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <Text style={{
                        fontSize: 18,
                        marginBottom: 5,
                        textTransform: 'capitalize',
                        color: colors.gray[600],
                    }}>{(user.firstName + ' ' + user.lastName).length > 18 ? (user.firstName + ' ' + user.lastName).substring(0, 18) + '...' : (user.firstName + ' ' + user.lastName)} </Text>
                    <Text style={styles.userRole}>{user.profession.description}</Text>
                </View>
                {markPresence && <Checkbox aria-label='isPresent' defaultIsChecked={user.isPresent} onChange={value => handelChange(value)} value={user.ressourceId.toString()} colorScheme="green" />}
                {isDelete && <Pressable onPress={onDelete}><Icon name={"trash"} size={20} color={colors.danger.toString()} /></Pressable>}
                {addParticipants && <Pressable onPress={handelAdd}><Icon name={"plus"} size={20} color={colors.primary.toString()} /></Pressable>}
            </View>

        </View>
    );
};


export default Participant;
