import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { DrawerItem } from "@react-navigation/drawer";
import { Pressable, useTheme } from "native-base";
import Icon from '@expo/vector-icons/FontAwesome';
import { t } from "i18next";
import { useAuth } from "../core";
type Props = {
    label: string;
    navigation: any;
    icon: string;
    subItems?: {
        label: string;
        icon: string;
        permissions: string[]
    }[];
    selected?: boolean;
    currentRoute: string
};
function CustomDrawerItem({ currentRoute, label, navigation, icon, subItems }: Props) {

    const [currentRole, setCurrentRole] = useState<string>('');

    const { hasRole } = useAuth();

    useEffect(() => {
        Promise.all([hasRole("Admin"), hasRole("Pilote"),hasRole("Formateur")]).then(reponses => {
            const [isAdmin, isPilote, isFormateur] = reponses;
            if(isAdmin) {
                setCurrentRole("Admin");
            }else if(isPilote) {
                setCurrentRole("Pilote")
            }else if(isFormateur) {
                setCurrentRole("Formateur")
            }else {
                setCurrentRole("Col");
            }
        });
    }, []);

    const [expanded, setExpanded] = useState(false);
    const [isCollapseOpen, setIsCollapseOpen] = useState(false);
    const { colors } = useTheme();
    const styles = StyleSheet.create({
        container: {
            display: 'flex',
            width: '100%',
            justifyContent: "space-between",
            paddingRight: 5,
            flexDirection: 'row',
            alignItems: 'center'
        },
        iconContainer: {
            position: "absolute",
            right: 0,
            top: '40.54%',
            flexDirection: "column",
            alignItems: "center",
            paddingRight: 16,
        },
        subItem: {
            marginLeft: 20,
            color: colors.gray[600],
            fontSize: 16,
            fontWeight: "normal",
        },
        borderTop: {
            borderTopColor: colors.gray[200],
            borderTopWidth: 1
        },
        activeDrawer: {
            borderLeftColor: '#437EF7',
            borderLeftWidth: 4,
            backgroundColor: 'rgba(67, 126, 247, 0.2)'
        },
        activeText: {
            color: '#437EF7',
        },
    });
    const toggleExpand = () => {
        setExpanded(!expanded);
    }
    const handlePress = () => {
        if (subItems) {
            setIsCollapseOpen(!isCollapseOpen);
            toggleExpand();
        } else {
            navigation.navigate(label);
        }
    }
    return (
        <>
            <Pressable
                style={[
                    styles.container,
                    currentRoute == label && styles.activeDrawer
                ]}
                onPress={handlePress}
            >
                <DrawerItem
                    label={`${t("routes." + label)}`}
                    labelStyle={{
                        color: (currentRoute == label ? '#437EF7' : colors.gray[600])
                    }}
                    onPress={handlePress}
                    pressColor={'#ffff'}
                    pressOpacity={0}
                    icon={() => (
                        <Icon
                            name={icon}
                            size={15}
                            type="light"
                            color={currentRoute == label ? '#437EF7' : colors.gray[600]}
                        />
                    )}
                    style={{ width: '100%' }}
                />
                {subItems && (
                    <TouchableOpacity style={styles.iconContainer} onPress={toggleExpand}>
                        <Icon
                            name={isCollapseOpen ? "chevron-up" : "chevron-down"}
                            size={10}
                            type='light'
                        />
                    </TouchableOpacity>
                )}
            </Pressable>
            {subItems && expanded && (
                <>
                    {subItems.map((subItem, subIndex) => (
                        (
                            subItem.permissions.includes(currentRole)
                        ) &&
                        <DrawerItem
                            key={subIndex}
                            label={`${t("routes." + subItem.label)}`}

                            labelStyle={{
                                color: (currentRoute == subItem.label ? '#437EF7' : colors.gray[600])
                            }}
                            onPress={() => navigation.navigate(subItem.label)}
                            pressColor={'#ffff'}
                            pressOpacity={0}
                            style={[
                                currentRoute == subItem.label && styles.activeDrawer,
                                { alignSelf: 'flex-end', width: '80%' }
                            ]}
                            icon={() => (
                                <Icon
                                    name={subItem.icon} size={15} type="light" color={currentRoute == subItem.label ? '#437EF7' : colors.gray[600]}
                                />
                            )}
                        />
                    ))}
                </>
            )}
        </>
    );
}
export default CustomDrawerItem;
