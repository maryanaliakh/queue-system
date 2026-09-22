import React from "react";
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { appointmentsStyles as styles } from "../../styles/appointments/appointmentsStyle";
import BottomNavigation from "../../components/BottomNavigation";
import EmptyState from "../../components/EmptyState";
import { useLanguage } from "../../context/LanguageContext";

// const appointments = [];
const appointments = [
    {
        id: 1,
        section: "today",
        service: "General Consultation",
        duration: "20 min",
        date: "28 May 2026",
        time: "12:30",
        doctor: "Dr. Emma Ficher",
        room: "305 A",

        position: 3,
        waitingTime: "5 min",

        status: "active",
        image:
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300",
    },
    {
        id: 2,
        section: "july",
        service: "General Consultation",
        duration: "20 min",
        date: "28 May 2026",
        time: "12:30",
        doctor: "Dr. Emma Ficher",
        room: "305 A",

        position: 3,
        waitingTime: "5 min",

        status: "upcoming",
        image:
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300",
    },
];

function AppointmentCard({ appointment, navigation }) {
    const { t } = useLanguage();

    const openAppointmentDetails = () => {
        navigation.navigate("AppointmentDetails", {
            appointment,
        });
    };

    const openQueueStatus = (event) => {
        event.stopPropagation();

        navigation.navigate("QueueStatus", {
            position: appointment.position,
            appointment: {
                estimatedTime: appointment.time,
                waitingTime: appointment.waitingTime,
                employee: appointment.doctor,
                room: appointment.room,
                service: appointment.service,
            },
        });
    };

    return (
        <TouchableOpacity
            style={styles.appointmentCard}
            activeOpacity={0.9}
            onPress={openAppointmentDetails}
        >
            {/* SERVICE */}
            <View style={styles.serviceRow}>
                <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>
                        {appointment.service}
                    </Text>

                    <Text style={styles.duration}>
                        {appointment.duration}
                    </Text>
                </View>

                <View style={styles.dateTimeRow}>
                    <View style={styles.dateBadge}>
                        <Text style={styles.dateText}>
                            {appointment.date}
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.timeBadge,
                            appointment.status === "active"
                                ? styles.timeBadgeActive
                                : styles.timeBadgeUpcoming,
                        ]}
                    >
                        <Ionicons
                            name="time-outline"
                            size={13}
                            color="#333333"
                        />

                        <Text style={styles.timeText}>
                            {appointment.time}
                        </Text>
                    </View>
                </View>
            </View>

            {/* DIVIDER */}
            <View style={styles.divider} />

            {/* DOCTOR */}
            <View style={styles.doctorRow}>
                <View style={styles.doctorInfo}>
                    <Image
                        source={{ uri: appointment.image }}
                        style={styles.doctorImage}
                    />

                    <Text style={styles.doctorName}>
                        {appointment.doctor}
                    </Text>
                </View>

                <View style={styles.roomInfo}>
                    <View style={styles.roomBadge}>
                        <Text style={styles.roomNumber}>
                            {appointment.room}
                        </Text>
                    </View>

                    <Text style={styles.roomLabel}>
                        {t.roomLabel}
                    </Text>
                </View>
            </View>

            {/* QUEUE STATUS */}
            {appointment.status === "active" && (
                <TouchableOpacity
                    style={styles.queueButton}
                    activeOpacity={0.9}
                    onPress={openQueueStatus}
                >
                    <Text style={styles.queueButtonText}>
                        {t.queueStatus}
                    </Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
}

export default function AppointmentsScreen({ navigation }) {
    const { t } = useLanguage();

    const getSectionTitle = (section) => {
        if (section === "today") {
            return t.today;
        }

        if (section === "july") {
            return t.july;
        }

        return section;
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {t.appointmentsTitle}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.notificationButton}
                    activeOpacity={1}
                    onPress={() =>
                        navigation.navigate("Notifications")
                    }
                >
                    <Ionicons
                        name="notifications"
                        size={27}
                        color="#111111"
                    />
                </TouchableOpacity>

                {appointments.length === 0 ? (
                    <EmptyState
                        title={t.noActiveAppointments}
                        description={
                            t.noActiveAppointmentsDescription
                        }
                        style={styles.emptyState}
                        titleStyle={styles.emptyTitle}
                        descriptionStyle={
                            styles.emptyDescription
                        }
                    />
                ) : (
                    appointments.map((appointment) => (
                        <View
                            key={appointment.id}
                            style={styles.section}
                        >
                            <Text style={styles.sectionTitle}>
                                {getSectionTitle(
                                    appointment.section
                                )}
                            </Text>

                            <AppointmentCard
                                appointment={appointment}
                                navigation={navigation}
                            />
                        </View>
                    ))
                )}

                <TouchableOpacity
                    style={styles.historyButton}
                    activeOpacity={0.9}
                    onPress={() =>
                        navigation.navigate(
                            "AppointmentsHistory"
                        )
                    }
                >
                    <Text style={styles.historyButtonText}>
                        {t.appointmentsHistory}
                    </Text>
                </TouchableOpacity>

                <View style={styles.bottomSpace} />
            </ScrollView>

            <BottomNavigation
                navigation={navigation}
                active="appointments"
            />
        </View>
    );
}