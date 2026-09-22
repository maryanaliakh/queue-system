import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { profileStyles as styles } from "../../styles/profile/profileStyle";
import BottomNavigation from "../../components/BottomNavigation";
import { useLanguage } from "../../context/LanguageContext";

const menuItems = [
    {
        titleKey: "helpSupport",
        screen: "HelpSupport",
    },
    {
        titleKey: "termsConditions",
        screen: "TermsConditions",
    },
    {
        titleKey: "privacyPolicy",
        screen: "PrivacyPolicy",
    },
    {
        titleKey: "changePassword",
        screen: "ChangePassword",
    },
    {
        titleKey: "language",
        screen: "ChangeLanguage",
    },
];

export default function ProfileScreen({ navigation }) {
    const { t } = useLanguage();

    const [deleteModalVisible, setDeleteModalVisible] =
        useState(false);

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* PURPLE BACKGROUND */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logo}>
                            <Text style={styles.logoGreen}>
                                Q
                            </Text>

                            <Text style={styles.logoWhite}>
                                ast
                            </Text>
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.notificationButton}
                        onPress={() =>
                            navigation.navigate("Notifications")
                        }
                    >
                        <Ionicons
                            name="notifications"
                            size={27}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                </View>

                {/* PROFILE CARD */}
                <TouchableOpacity
                    style={styles.profileCard}
                    activeOpacity={1}
                    onPress={() =>
                        navigation.navigate("ProfileDetails")
                    }
                >
                    <View style={styles.userRow}>
                        <View style={styles.avatar}>
                            <Ionicons
                                name="person-outline"
                                size={45}
                                color="#111111"
                            />
                        </View>

                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>
                                Devid Jonson
                            </Text>

                            <Text style={styles.userEmail}>
                                username@gmail.com
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* MENU */}
                <View style={styles.menu}>
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.screen}
                            style={styles.menuItem}
                            activeOpacity={0.8}
                            onPress={() =>
                                navigation.navigate(item.screen)
                            }
                        >
                            <Text style={styles.menuText}>
                                {t[item.titleKey]}
                            </Text>

                            <Ionicons
                                name="chevron-forward"
                                size={27}
                                color="#111111"
                            />
                        </TouchableOpacity>
                    ))}

                    {/* LOG OUT */}
                    <TouchableOpacity
                        style={styles.menuItem}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.logoutText}>
                            {t.logout}
                        </Text>
                    </TouchableOpacity>

                    {/* DELETE ACCOUNT */}
                    <TouchableOpacity
                        style={styles.menuItem}
                        activeOpacity={0.8}
                        onPress={() =>
                            setDeleteModalVisible(true)
                        }
                    >
                        <Text style={styles.deleteText}>
                            {t.deleteAccount}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <BottomNavigation
                navigation={navigation}
                active="profile"
            />

            {/* DELETE ACCOUNT MODAL */}
            <Modal
                visible={deleteModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setDeleteModalVisible(false)
                }
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {t.deleteAccountQuestion}
                        </Text>

                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            activeOpacity={0.85}
                            onPress={() =>
                                setDeleteModalVisible(false)
                            }
                        >
                            <Text style={styles.modalCancelText}>
                                {t.cancel}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalDeleteButton}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.modalDeleteText}>
                                {t.deleteAccount}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}