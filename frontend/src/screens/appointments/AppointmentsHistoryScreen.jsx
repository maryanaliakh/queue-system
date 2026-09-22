import React from "react";
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { appointmentsHistoryStyles as styles } from "../../styles/appointments/appointmentsHistoryStyle";
import BottomNavigation from "../../components/BottomNavigation";
import EmptyState from "../../components/EmptyState";
import { useLanguage } from "../../context/LanguageContext";

// const appointments = [];
const appointments = [
    {
        id: 1,
        section: "today",
        clinic: "Nova Medical Clinic",
        address: "24 Green Street, Warsaw",
        category: "Healthcare",
        rating: "4.5",
        service: "General Consultation",
        duration: "20 min",
        date: "28 May 2026",
        time: "12:30",
        rated: false,
        image:
            "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300",
    },
    {
        id: 2,
        section: "may",
        clinic: "Nova Medical Clinic",
        address: "24 Green Street, Warsaw",
        category: "Healthcare",
        rating: "4.5",
        service: "General Consultation",
        duration: "20 min",
        date: "20 May 2026",
        time: "12:30",
        rated: true,
        image:
            "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300",
    },
];

function HistoryCard({ appointment, navigation }) {
    const { t } = useLanguage();

    const getCategoryName = (category) => {
        if (category === "Healthcare") {
            return t.categoryHealthcare;
        }

        if (category === "Banking & Finance") {
            return t.categoryBankingFinance;
        }

        if (category === "Government Services") {
            return t.categoryGovernmentServices;
        }

        if (category === "Beauty & Wellness") {
            return t.categoryBeautyWellness;
        }

        if (category === "Education") {
            return t.categoryEducation;
        }

        if (category === "Transport") {
            return t.categoryTransport;
        }

        if (category === "Insurance") {
            return t.categoryInsurance;
        }

        if (category === "Legal Services") {
            return t.categoryLegalServices;
        }

        return category;
    };

    const openAppointmentDetails = () => {
        navigation.navigate("AppointmentDetails", {
            appointment,
        });
    };

    const openRateVisit = (event) => {
        event.stopPropagation();

        navigation.navigate("AppointmentCompleted", {
            appointment,
        });
    };

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={openAppointmentDetails}
        >
            {/* CLINIC */}
            <View style={styles.clinicRow}>
                <Image
                    source={{ uri: appointment.image }}
                    style={styles.clinicImage}
                />

                <View style={styles.clinicInfo}>
                    <View style={styles.tagsRow}>
                        <View style={styles.categoryTag}>
                            <Text style={styles.categoryText}>
                                {getCategoryName(
                                    appointment.category
                                )}
                            </Text>
                        </View>

                        <View style={styles.ratingTag}>
                            <Text style={styles.star}>
                                ★
                            </Text>

                            <Text style={styles.ratingText}>
                                {appointment.rating}
                            </Text>
                        </View>
                    </View>

                    <Text
                        style={styles.clinicName}
                        numberOfLines={1}
                    >
                        {appointment.clinic}
                    </Text>

                    <Text
                        style={styles.clinicAddress}
                        numberOfLines={1}
                    >
                        {appointment.address}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* APPOINTMENT */}
            <View style={styles.appointmentRow}>
                <View style={styles.serviceInfo}>
                    <Text
                        style={styles.serviceName}
                        numberOfLines={2}
                    >
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

                    <View style={styles.timeBadge}>
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

            {/* RATE VISIT */}
            {!appointment.rated && (
                <TouchableOpacity
                    style={styles.rateButton}
                    activeOpacity={0.9}
                    onPress={openRateVisit}
                >
                    <Text style={styles.rateButtonText}>
                        {t.rateVisit}
                    </Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
}

export default function AppointmentsHistoryScreen({
                                                      navigation,
                                                  }) {
    const { t } = useLanguage();

    const getSectionTitle = (section) => {
        if (section === "today") {
            return t.today;
        }

        if (section === "may") {
            return t.may;
        }

        return section;
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>
                    {t.appointmentsHistory}
                </Text>

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
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {appointments.length === 0 ? (
                    <EmptyState
                        title={t.noAppointmentsHistory}
                        description={
                            t.noAppointmentsHistoryDescription
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

                            <HistoryCard
                                appointment={appointment}
                                navigation={navigation}
                            />
                        </View>
                    ))
                )}

                <View style={styles.bottomSpace} />
            </ScrollView>

            <BottomNavigation
                navigation={navigation}
                active="appointments"
            />
        </View>
    );
}