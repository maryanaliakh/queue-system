import React, { useState } from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";

import { notificationsStyles as styles } from "../../styles/notifications/notificationsStyle";
import BottomNavigation from "../../components/BottomNavigation";
import EmptyState from "../../components/EmptyState";
import { useLanguage } from "../../context/LanguageContext";

const initialNotifications = {
    today: [
        {
            id: 1,
            type: "waiting",
            title: "Waiting Time Changed",
            text: "Your estimated waiting time has been updated.",
            highlight: "Current wait time: 20 minutes.",
            time: "15:34",
            read: false,

            details:
                "The estimated waiting time for your appointment has changed. Your current estimated waiting time is 20 minutes. Please stay nearby and check the queue status regularly.",
        },
        {
            id: 2,
            type: "turn",
            title: "It’s Your Turn to Enter",
            text: "Your appointment is starting now. Please proceed to",
            highlight: "Room 204.",
            time: "15:34",
            read: false,

            details:
                "It is now your turn. Please proceed to Room 204 for your appointment. If you are unable to arrive, your place in the queue may be skipped.",
        },
        {
            id: 3,
            type: "confirm",
            title: "Please Confirm Your Arrival",
            text: "Appointments without confirmation may be canceled automatically.",
            time: "15:34",
            timer: "2:00",
            read: false,

            details:
                "Please confirm that you have arrived at the institution. You have 2 minutes to confirm your arrival before the appointment may be canceled automatically.",
        },
        {
            id: 4,
            type: "available",
            title: "A Spot Has Become Available 🔥",
            text: "A place in the queue has just opened up for you. Choose your preferred time to move forward.",
            time: "15:34",
            timer: "2:00",
            read: false,

            details:
                "A place has become available earlier than expected. You can accept the available spot within the next 2 minutes.",
        },
        {
            id: 5,
            type: "lastChance",
            title: "Last Chance To Get A Spot 🔥",
            text: "A place in the queue has just opened up for you. Choose your preferred time to move forward.",
            time: "15:34",
            timer: "2:00",
            read: false,

            details:
                "This is your last opportunity to take the available place in the queue. Confirm within 2 minutes or the place will be offered to another client.",
        },
        {
            id: 6,
            type: "confirmed",
            title: "Appointment Confirmed",
            text: "Your appointment has been successfully confirmed. Please arrive on time.",
            time: "15:34",
            read: false,

            details:
                "Your appointment has been successfully confirmed. Please arrive on time and proceed to the specified room when your appointment begins.",
        },
        {
            id: 7,
            type: "almostTurn",
            title: "Almost Your Turn",
            text: "You are next in the queue. Please be ready to enter.",
            time: "15:34",
            read: false,

            details:
                "You are currently next in the queue. Please stay nearby and be ready to enter when you receive the next notification.",
        },
        {
            id: 8,
            type: "cancelled",
            title: "Appointment Cancelled",
            text: "Your queue position has been skipped due to no response or late arrival.",
            time: "15:34",
            read: false,

            details:
                "Your appointment has been cancelled because your queue position was skipped due to no response or late arrival.",
        },
        {
            id: 9,
            type: "completed",
            title: "Appointment Completed",
            text: "Your appointment has been successfully completed. You can review it anytime in your recent",
            highlight: "appointments history.",
            time: "15:34",
            read: false,

            details:
                "Your appointment has been successfully completed. You can review the appointment information in your appointment history.",
        },
    ],

    lastWeek: [],
};

function NotificationCard({ notification, onPress }) {
    const isTurn = notification.type === "turn";
    const isRead = notification.read;

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            style={[
                styles.card,

                !isRead &&
                notification.type === "turn" &&
                styles.turnCard,

                !isRead &&
                notification.type === "available" &&
                styles.availableCard,

                !isRead &&
                notification.type === "lastChance" &&
                styles.lastChanceCard,

                isRead && styles.readCard,
            ]}
        >
            <View style={styles.cardContent}>
                {/* ICON */}
                {notification.type === "waiting" && (
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="time-outline"
                            size={29}
                            color={
                                isRead
                                    ? "#AAAAAA"
                                    : "#111111"
                            }
                        />
                    </View>
                )}

                {notification.type === "turn" && (
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons
                            name="door-open"
                            size={29}
                            color={
                                isRead
                                    ? "#AAAAAA"
                                    : "#FFFFFF"
                            }
                        />
                    </View>
                )}

                {notification.type === "completed" && (
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="checkmark-circle-outline"
                            size={30}
                            color={
                                isRead
                                    ? "#A8CDAE"
                                    : "#57D96B"
                            }
                        />
                    </View>
                )}

                {notification.type === "confirmed" && (
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="checkmark-circle-outline"
                            size={30}
                            color={
                                isRead
                                    ? "#AAAAAA"
                                    : "#00C817"
                            }
                        />
                    </View>
                )}

                {notification.type === "almostTurn" && (
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="arrow-forward-circle-outline"
                            size={30}
                            color={
                                isRead
                                    ? "#AAAAAA"
                                    : "#FFB800"
                            }
                        />
                    </View>
                )}

                {notification.type === "cancelled" && (
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="close-circle-outline"
                            size={30}
                            color={
                                isRead
                                    ? "#AAAAAA"
                                    : "#FF1717"
                            }
                        />
                    </View>
                )}

                <View style={styles.notificationInfo}>
                    {/* TITLE */}
                    <View style={styles.titleRow}>
                        <Text
                            style={[
                                styles.cardTitle,
                                isTurn &&
                                !isRead &&
                                styles.whiteText,
                                isRead &&
                                styles.readTitle,
                            ]}
                        >
                            {isRead
                                ? notification.title
                                    .replace("🔥", "")
                                    .trim()
                                : notification.title}
                        </Text>

                        {/* TIMER */}
                        {notification.timer && (
                            <View
                                style={[
                                    styles.timerBadge,
                                    isRead &&
                                    styles.readTimerBadge,
                                ]}
                            >
                                <Ionicons
                                    name="alarm-outline"
                                    size={14}
                                    color={
                                        isRead
                                            ? "#AAAAAA"
                                            : "#111111"
                                    }
                                />

                                <Text
                                    style={[
                                        styles.timerText,
                                        isRead &&
                                        styles.readTimerText,
                                    ]}
                                >
                                    {notification.timer}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* MESSAGE */}
                    <View style={styles.messageRow}>
                        <Text
                            style={[
                                styles.cardText,
                                isTurn &&
                                !isRead &&
                                styles.turnDescription,
                                isRead &&
                                styles.readText,
                            ]}
                        >
                            {notification.text}

                            {notification.highlight && (
                                <Text
                                    style={[
                                        styles.highlight,
                                        isTurn &&
                                        !isRead &&
                                        styles.turnHighlight,
                                        isRead &&
                                        styles.readHighlight,
                                    ]}
                                >
                                    {" "}
                                    {notification.highlight}
                                </Text>
                            )}
                        </Text>

                        {/* TIME */}
                        <Text
                            style={[
                                styles.time,
                                isTurn &&
                                !isRead &&
                                styles.turnTime,
                                isRead &&
                                styles.readTime,
                            ]}
                        >
                            {notification.time}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default function NotificationsScreen({
                                                navigation,
                                            }) {
    const { t } = useLanguage();

    const [notifications, setNotifications] =
        useState(initialNotifications);

    const openNotification = (notification) => {
        setNotifications((prev) => ({
            today: prev.today.map((item) =>
                item.id === notification.id
                    ? {
                        ...item,
                        read: true,
                    }
                    : item
            ),

            lastWeek: prev.lastWeek.map((item) =>
                item.id === notification.id
                    ? {
                        ...item,
                        read: true,
                    }
                    : item
            ),
        }));

        navigation.navigate("NotificationDetails", {
            notification: {
                ...notification,
                read: true,
            },
        });
    };

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
                    {t.notificationsTitle}
                </Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* TODAY */}
                <Text style={styles.sectionTitle}>
                    {t.today}
                </Text>

                {notifications.today.length === 0 ? (
                    <EmptyState
                        title={t.noNotificationsToday}
                        description={
                            t.noNotificationsTodayDescription
                        }
                        style={styles.emptyState}
                        titleStyle={styles.emptyTitle}
                        descriptionStyle={
                            styles.emptyDescription
                        }
                    />
                ) : (
                    notifications.today.map(
                        (notification) => (
                            <NotificationCard
                                key={notification.id}
                                notification={notification}
                                onPress={() =>
                                    openNotification(
                                        notification
                                    )
                                }
                            />
                        )
                    )
                )}

                {/* LAST WEEK */}
                {notifications.lastWeek.length > 0 && (
                    <>
                        <Text
                            style={[
                                styles.sectionTitle,
                                styles.lastWeekTitle,
                            ]}
                        >
                            {t.lastWeek}
                        </Text>

                        {notifications.lastWeek.map(
                            (notification) => (
                                <NotificationCard
                                    key={notification.id}
                                    notification={
                                        notification
                                    }
                                    onPress={() =>
                                        openNotification(
                                            notification
                                        )
                                    }
                                />
                            )
                        )}
                    </>
                )}

                <View style={styles.bottomSpace} />
            </ScrollView>

            <BottomNavigation
                navigation={navigation}
            />
        </View>
    );
}