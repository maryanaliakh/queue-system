import React from "react";
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { homeStyles as styles } from "../../styles/home/homeStyles";
import EmptyState from "../../components/EmptyState";
import {
    categories,
    clinics,
    recentAppointments,
} from "../../data/mockData";
import { useLanguage } from "../../context/LanguageContext";

function ClinicCard({ clinic, appointment = null, onPress }) {
    return (
        <TouchableOpacity
            style={[
                styles.clinicCard,
                appointment
                    ? styles.seeAllAppointmentCard
                    : styles.seeAllClinicCard,
            ]}
            activeOpacity={0.85}
            onPress={onPress}
        >
            <View style={styles.clinicTop}>
                <Image
                    source={{ uri: clinic.image }}
                    style={styles.clinicImage}
                />

                <View style={styles.clinicInfo}>
                    <View style={styles.tagsRow}>
                        <View style={styles.categoryTag}>
                            <Text style={styles.categoryTagText}>
                                {clinic.category}
                            </Text>
                        </View>

                        <View style={styles.ratingTag}>
                            <Text style={styles.star}>★</Text>

                            <Text style={styles.ratingText}>
                                {clinic.rating}
                            </Text>
                        </View>
                    </View>

                    <Text
                        style={styles.clinicName}
                        numberOfLines={1}
                    >
                        {clinic.name}
                    </Text>

                    <Text
                        style={styles.clinicAddress}
                        numberOfLines={1}
                    >
                        {clinic.address}
                    </Text>
                </View>
            </View>

            {appointment && (
                <View style={styles.appointmentInfo}>
                    <View>
                        <Text style={styles.appointmentTitle}>
                            {appointment.service}
                        </Text>

                        <Text style={styles.appointmentDuration}>
                            {appointment.duration}
                        </Text>
                    </View>

                    <View style={styles.dateTag}>
                        <Text style={styles.dateText}>
                            {appointment.date} {appointment.time}
                        </Text>
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
}

export default function SeeAllScreen({ route, navigation }) {
    const { t } = useLanguage();
    const { type } = route.params;

    const titles = {
        categories: t.categories,
        recommended: t.recommended,
        appointments: t.recentAppointments,
        nearby: t.clinicsNearYou,
    };

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.seeAllHeader}>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons
                        name="chevron-back"
                        size={28}
                        color="#5657C4"
                    />
                </TouchableOpacity>

                <Text style={styles.seeAllTitle}>
                    {titles[type]}
                </Text>

            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.seeAllContent}
            >

                {/* CATEGORIES */}
                {type === "categories" && (
                    <View style={styles.categoriesGrid}>
                        {categories.map((category, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.categoryCardLarge}
                                activeOpacity={0.8}
                                onPress={() =>
                                    navigation.navigate("Search", {
                                        category: category.title.replace("\n", " "),
                                    })
                                }
                            >
                                <MaterialCommunityIcons
                                    name={category.icon}
                                    size={42}
                                    color={
                                        index === 0
                                            ? "#1DB5D8"
                                            : index === 1
                                                ? "#67C96B"
                                                : index === 2
                                                    ? "#5A96E8"
                                                    : "#F18AB3"
                                    }
                                />

                                <Text style={styles.categoryCardLargeTitle}>
                                    {category.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* CLINICS */}
                {(type === "recommended" || type === "nearby") && (
                    <View style={styles.verticalCards}>
                        {clinics.length === 0 ? (
                            <EmptyState
                                title={
                                    type === "recommended"
                                        ? t.noRecommendations
                                        : t.noNearbyClinics
                                }
                                description={
                                    type === "recommended"
                                        ? t.recommendedEmpty
                                        : t.nearbyClinicsEmpty
                                }
                                style={styles.emptyState}
                                titleStyle={styles.emptyTitle}
                                descriptionStyle={styles.emptyDescription}
                            />
                        ) : (
                            clinics.map((clinic) => (
                                <ClinicCard
                                    key={clinic.id}
                                    clinic={clinic}
                                    onPress={() =>
                                        navigation.navigate("InstitutionDetails", {
                                            institution: clinic,
                                        })
                                    }
                                />
                            ))
                        )}
                    </View>
                )}

                {/* APPOINTMENTS */}
                {type === "appointments" && (
                    <View style={styles.verticalCards}>
                        {recentAppointments.length === 0 ? (
                            <EmptyState
                                title={t.noRecentAppointments}
                                description={t.recentAppointmentsEmpty}
                                style={styles.emptyState}
                                titleStyle={styles.emptyTitle}
                                descriptionStyle={styles.emptyDescription}
                            />
                        ) : (
                            recentAppointments.map((appointment) => {
                                const clinic = clinics.find(
                                    (clinic) => clinic.id === appointment.clinicId
                                );

                                if (!clinic) {
                                    return null;
                                }

                                return (
                                    <ClinicCard
                                        key={appointment.id}
                                        clinic={clinic}
                                        appointment={appointment}
                                        onPress={() =>
                                            navigation.navigate("AppointmentDetails", {
                                                appointment: {
                                                    ...appointment,
                                                    clinic,
                                                },
                                            })
                                        }
                                    />
                                );
                            })
                        )}
                    </View>
                )}

            </ScrollView>
        </View>
    );
}