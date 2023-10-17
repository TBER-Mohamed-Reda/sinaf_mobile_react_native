import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Input, Pressable, Text, View, useTheme } from "native-base";
import Participant from "./Participant";
import Icon from '@expo/vector-icons/FontAwesome';
import { Ressource, useGetSessionAbsence, useGetSessionPresence, useGetUsersInProduction } from "../../api";
import { t } from "i18next";

type ParticipantsListProps = {
  sessionID: number;
  participants: Ressource[];
  onUpdate: () => void;
  isTrainingProject: boolean;
  projectID: number;
};

const ShowListParticipants = ({ sessionID, isTrainingProject, projectID, onUpdate }: ParticipantsListProps) => {
  const { colors } = useTheme();
  
  const participants: any[] = [];

  const { data: presence, refresh: refreshPresence } = useGetSessionPresence(sessionID);
  const { data: absence, refresh: refreshAbsence } = useGetSessionAbsence(sessionID);

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

  const refreshParticipants = () => {
    refreshAbsence();
    refreshPresence();
  }

  const [searchParticipant, setSearchParticipant] = useState("");
  const [filteredParticipants, setFilteredParticipants] = useState<any[]>([]);
  const [searchUser, setSearchUser] = useState("");
  const [filteredUsersInProd, setFilteredUsersInProd] = useState<any[]>([]);
  const [showParticipants, setShowParticipants] = useState(true)

  const params = {
    lastNameCriteria: '',
    sessionId: sessionID,
    isTrainingProject,
    projectID
  }

  const { data: UsersInProd, refresh: refreshUsersInProduction } = useGetUsersInProduction(params)

  const handleSearchParticipant = (query) => {
    setSearchParticipant(query);

    setFilteredParticipants(participants.filter(function (el) {
      return el.firstName.toLowerCase().includes(query.toLowerCase()) || el.lastName.toLowerCase().includes(query.toLowerCase())
    }));
  };

  const handleSearchUser = (query) => {
    setSearchUser(query);

    !!UsersInProd && setFilteredUsersInProd(UsersInProd.filter(function (el) {
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

  const showUsersInProductionComponent = () => {
    refreshUsersInProduction()
    setShowParticipants(false)
  }

  const showParticipantsComponent = () => {
    refreshParticipants();
    setShowParticipants(true)
  }

  return (
    showParticipants ? (
      <>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Input
              placeholder="Search"
              value={searchParticipant}
              onChangeText={handleSearchParticipant}
            />
          </View>
          <Pressable onPress={() => showUsersInProductionComponent()}><Icon name={"user-plus"} size={20} color={colors.blue[600]} /></Pressable>
        </View>

        {(participants.length > 0 && (searchParticipant === "" || filteredParticipants.length > 0))
          ? ((searchParticipant !== ""
              ? filteredParticipants
              : participants).map((participant) => (
                <Participant
                  onUpdate={() => refreshParticipants()}
                  sessionID={sessionID}
                  markPresence={false}
                  key={participant.ressourceId}
                  user={participant}
                  isDelete={true}
                />
              ))
            )
          : <Text style={[styles.detail, { textAlign: 'center' }]}>{`${t("formation.noParticipants")}`}</Text>}
      </>
    ) : (
      <>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Input
              placeholder="Search"
              value={searchUser}
              onChangeText={handleSearchUser}
            />
          </View>
          <Pressable onPress={() => showParticipantsComponent()}><Text>{`${t("actions.end")}`}</Text></Pressable>
        </View>

        {((!!UsersInProd && UsersInProd.length > 0)
          && (searchUser === "" || filteredUsersInProd.length > 0))
          ? ((searchUser !== ""
              ? filteredUsersInProd
              : UsersInProd).map((user) => (
                <Participant
                  updateUsersList={() => refreshUsersInProduction()}
                  onUpdate={() => onUpdate()}
                  sessionID={sessionID}
                  markPresence={false}
                  key={user.ressourceId}
                  user={user}
                  addParticipants={true}
                />
              ))
            )
          : <Text style={[styles.detail, { textAlign: 'center' }]}>{`${t("formation.noUsers")}`}</Text>}
      </>
    )
  );
};

export default ShowListParticipants;
