import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View, Button, Input, Modal, useTheme, Spinner } from "native-base";
import {
    RateRequest,
    RessourceParams,
    useRessource,
    useSaveUserRating,
    useSessionByRessourceRating,
    useUpdateUserRating,
} from "../../api";
import { useAuth } from "../../core";
import { t } from "i18next";
import CustomRatingInput from "../../ui/CustomRatingInput";

type ratingProps = {
    sessionID: number;
    onUpdate: () => void;
};

const Rate: React.FC<ratingProps> = ({ sessionID, onUpdate }: ratingProps) => {
    const { colors } = useTheme();
    const { ressourceId, username } = useAuth();
    const [supportsQuality, setSupportsQuality] = useState<number>(0);
    const [animatorIntervention, setAnimatorIntervention] = useState<number>(0);
    const [generalAmbience, setGeneralAmbience] = useState<number>(0);
    const [comment, setComment] = useState("");
    const [request, setRequest] = useState<RateRequest | null>(null);
    const [updateReq, setUpdateReq] = useState<RateRequest | null>(null);
    const { data: ressource } = useRessource({ username } as RessourceParams);

    const [open, setOpen] = useState(false);
    const openModal = () => {
        setOpen(true);
    };
    const params = {
        sessionID,
        ressourceId,
    };

    const { isLoading, error, data: rating, refresh } = useSessionByRessourceRating(params);


    const handelSave = () => {
        setOpen(false);
        setRequest({
            sessionID,
            supportsQuality,
            generalAmbience,
            animatorIntervention,
            ressource,
            comment,
        });
    };

    const { isLoading: saving } = useSaveUserRating(request!);

    const handelUpdate = () => {
        setOpen(false);
        setUpdateReq({
            sessionID,
            supportsQuality,
            generalAmbience,
            animatorIntervention,
            ressource,
            comment,
        });
    };

    const { isLoading: updating } = useUpdateUserRating(updateReq!);

    useEffect(() => {
        if (!!rating) {
            setComment(rating?.comment)
            setAnimatorIntervention(rating?.animatorIntervention)
            setGeneralAmbience(rating?.generalAmbience)
            setSupportsQuality(rating?.supportsQuality)
        }
    }, [rating])

    useEffect(() => {
        refresh()
        onUpdate()

    }, [saving, updating])


    const styles = StyleSheet.create({
        title: {
            fontSize: 18,
            marginBottom: 5,
            textTransform: "capitalize",
            color: colors.gray[600],
        },
        detail: {
            fontSize: 12,
            marginBottom: 5,
            color: colors.gray[400],
        },
    });


    if (isLoading && !!rating) {
        return <Spinner />
    }
    return (
        <View style={[styles.title, { marginVertical: 5 }]}>
            <Button backgroundColor="primary" onPress={openModal}>
                {t("actions.rate")}
            </Button>

            <Modal isOpen={open} onClose={() => setOpen(false)} safeAreaTop={true}>
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton />
                    <Modal.Header>{t("actions.rate")}</Modal.Header>
                    <Modal.Body>
                        <Text style={[styles.detail]}>{t("formation.supportsQuality")}</Text>
                        <CustomRatingInput onValueChange={value => setSupportsQuality(value)} defaultValue={supportsQuality} />
                        <Text style={[styles.detail]}>{t("formation.animatorIntervention")}</Text>
                        <CustomRatingInput  onValueChange={value => setAnimatorIntervention(value)} defaultValue={animatorIntervention} />
                        <Text style={[styles.detail]}>{t("formation.generalAmbience")}</Text>
                        <CustomRatingInput  onValueChange={value => setGeneralAmbience(value)} defaultValue={generalAmbience} />

                        <Input marginTop={5} defaultValue={rating?.comment || ''} onChangeText={setComment} isRequired={true} />

                        <Button.Group marginTop={5} space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => setOpen(false)}>
                                {t("actions.cancel")}
                            </Button>
                            {rating ? (
                                <Button variant="ghost" colorScheme="blueGray" onPress={handelUpdate}>
                                    {t("actions.edit")}
                                </Button>
                            ) : (
                                <Button variant="ghost" colorScheme="blueGray" onPress={handelSave}>
                                    {t("actions.save")}
                                </Button>
                            )}
                        </Button.Group>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </View>
    );
};

export default Rate;
