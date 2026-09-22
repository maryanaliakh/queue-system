import React from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { notificationDetailsStyles as styles } from "../../styles/notifications/notificationDetailsStyle";
import { useLanguage } from "../../context/LanguageContext";

export default function NotificationDetailsScreen({navigation, route,}) {
    const { t } = useLanguage();
    const { notification } = route.params;

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name="chevron-back"
                        size={28}
                        color="#5657C4"
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    {t.notificationDetailsTitle}
                </Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* TITLE */}
                <View style={styles.titleRow}>
                    <Text style={styles.title}>
                        {notification.title
                            .replace("🔥", "")
                            .trim()}
                    </Text>

                    <Text style={styles.time}>
                        {notification.time}
                    </Text>
                </View>

                {/* DESCRIPTION */}
                <Text style={styles.description}>
                    {notification.details}
                </Text>

                {/* DETAILS */}
                <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>
                        {t.details}
                    </Text>

                    {/* WAITING */}
                    {notification.type === "waiting" && (
                        <>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>
                                    {t.currentWaitingTime}
                                </Text>

                                <Text style={styles.detailValue}>
                                    20 {t.minutes}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>
                                    {t.updatedAt}
                                </Text>

                                <Text style={styles.detailValue}>
                                    {notification.time}
                                </Text>
                            </View>
                        </>
                    )}

                    {/* TURN */}
                    {notification.type === "turn" && (
                        <>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>
                                    {t.roomLabel}
                                </Text>

                                <Text style={styles.detailValue}>
                                    204
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>
                                    {t.appointmentStatus}
                                </Text>

                                <Text style={styles.detailValue}>
                                    {t.ready}
                                </Text>
                            </View>
                        </>
                    )}

                    {/* CONFIRM */}
                    {notification.type === "confirm" && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>
                                {t.status}
                            </Text>

                            <Text style={styles.detailValue}>
                                {t.confirmationRequired}
                            </Text>
                        </View>
                    )}

                    {/* AVAILABLE */}
                    {notification.type === "available" && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>
                                {t.status}
                            </Text>

                            <Text style={styles.detailValue}>
                                {t.spotAvailable}
                            </Text>
                        </View>
                    )}

                    {/* LAST CHANCE */}
                    {notification.type === "lastChance" && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>
                                {t.status}
                            </Text>

                            <Text style={styles.detailValue}>
                                {t.lastChance}
                            </Text>
                        </View>
                    )}

                    {/* COMPLETED */}
                    {notification.type === "completed" && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>
                                {t.status}
                            </Text>

                            <Text style={styles.detailValue}>
                                {t.completed}
                            </Text>
                        </View>
                    )}

                    {/* TIME REMAINING */}
                    {notification.timer && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>
                                {t.timeRemaining}
                            </Text>

                            <Text style={styles.detailValue}>
                                {notification.timer}
                            </Text>
                        </View>
                    )}

                    {/* CONFIRMED */}
                    {notification.type === "confirmed" && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>
                                {t.status}
                            </Text>

                            <Text style={styles.detailValue}>
                                {t.confirmed}
                            </Text>
                        </View>
                    )}

                    {/* ALMOST TURN */}
                    {notification.type === "almostTurn" && (
                        <>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>
                                    {t.queueStatus}
                                </Text>

                                <Text style={styles.detailValue}>
                                    {t.next}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>
                                    {t.position}
                                </Text>

                                <Text style={styles.detailValue}>
                                    1
                                </Text>
                            </View>
                        </>
                    )}

                    {/* CANCELLED */}
                    {notification.type === "cancelled" && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>
                                {t.status}
                            </Text>

                            <Text style={styles.detailValue}>
                                {t.cancelled}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}