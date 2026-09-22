import React, {useState} from "react";
import {Image, ScrollView, Text, TextInput, TouchableOpacity, View,} from "react-native";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import BottomNavigation from "../../components/BottomNavigation";
import PopUpWindow from "../../components/popUpWindows/PopUpWindow";
import EmptyState from "../../components/EmptyState";
import { useLanguage } from "../../context/LanguageContext";

import {homeStyles as styles} from "../../styles/home/homeStyles";

import {
    categories,
    clinics,
    recentAppointments,
} from "../../data/mockData";

function ClinicCard({clinic, appointment = null, onPress,}) {
    const CardWrapper = onPress ? TouchableOpacity : View;

    return (
        <CardWrapper
            style={styles.clinicCard}
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
                        <Text
                            style={styles.appointmentTitle}
                            numberOfLines={2}
                        >
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
        </CardWrapper>
    );
}

export default function HomeScreen({ navigation }) {
    const { t } = useLanguage();
    const [search, setSearch] = useState("");
    const [queueAction, setQueueAction] = useState({
        type: "confirmation", // confirmation, urgent, lastMinute or null
        timeLeft: "2:00",

        appointment: {
            id: 1,
            service: "General Consultation",
            duration: "20 min",
            date: "28 May 2026",
            time: "12:30",

            institution: {
                id: 1,
                name: "Nova Medical Clinic",
                address: "24 Green Street, Warsaw",
                category: "Healthcare",
                rating: "4.5",
                image:
                    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300",
            },
        },
    });

    return (
        <View style={styles.container}>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}
                <View
                    style={[
                        styles.header,
                        queueAction && styles.headerExpanded,
                    ]}
                >
                    <View style={styles.logoContainer}>
                        <Text style={styles.logo}>
                            <Text style={styles.logoGreen}>Q</Text>
                            <Text style={styles.logoWhite}>ast</Text>
                        </Text>

                        <TouchableOpacity
                            style={styles.notificationButton}
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate("Notifications")}
                        >
                            <Ionicons
                                name="notifications"
                                size={27}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* SEARCH */}
                <TouchableOpacity
                    style={styles.searchWrapper}
                    activeOpacity={1}
                    onPress={() =>
                        navigation.navigate("Search", {
                            focusSearch: true,
                        })
                    }
                >
                    <Ionicons
                        name="search-outline"
                        size={20}
                        color="#858585"
                        style={styles.searchIcon}
                    />

                    <TextInput
                        value={search}
                        placeholder={t.searchPlaceholder}
                        placeholderTextColor="#999999"
                        style={styles.searchInput}
                        editable={false}
                        pointerEvents="none"
                    />
                </TouchableOpacity>

                {queueAction && (
                    <PopUpWindow
                        type={queueAction.type}
                        appointment={queueAction.appointment}
                        timeLeft={queueAction.timeLeft}

                        onConfirm={() => {
                            setQueueAction(null);
                        }}

                        onDecline={() => {
                            setQueueAction(null);
                        }}

                        onSelectTime={(time) => {
                            console.log("Selected time:", time);
                            setQueueAction(null);
                        }}
                    />
                )}

                    {/* CATEGORIES */}
                <View style={{ height: 35 }} />
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            {t.categories}
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("SeeAll", {
                                    type: "categories",
                                })
                            }
                        >
                            <Text style={styles.seeAll}>
                                {t.seeAll}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesList}
                    >
                        {categories.map((category, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.categoryCard}
                                activeOpacity={0.8}
                                onPress={() =>
                                    navigation.navigate("Search", {
                                        category: category.title.replace("\n", " "),
                                    })
                                }
                            >
                                <MaterialCommunityIcons
                                    name={category.icon}
                                    size={38}
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

                                <Text style={styles.categoryTitle}>
                                    {category.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* RECOMMENDED */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            {t.recommended}
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("SeeAll", {
                                    type: "recommended",
                                })
                            }
                        >
                            <Text style={styles.seeAll}>
                                {t.seeAll}
                            </Text>
                        </TouchableOpacity>
                    </View>

                        {clinics.length === 0 ? (
                            <EmptyState
                                description={t.recommendedEmpty}
                                style={styles.emptyRecommended}
                                descriptionStyle={styles.emptyDescription}
                            />
                        ) : (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.cardsList}
                            >
                                {clinics.map((clinic) => (
                                    <ClinicCard
                                        key={clinic.id}
                                        clinic={clinic}
                                        onPress={() =>
                                            navigation.navigate("InstitutionDetails", {
                                                institution: clinic,
                                            })
                                        }
                                    />
                                ))}
                            </ScrollView>
                        )}

                {/* RECENT APPOINTMENTS */}
                <View style={styles.appointmentsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            {t.recentAppointments}
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("SeeAll", {
                                    type: "appointments",
                                })
                            }
                        >
                            <Text style={styles.seeAll}>
                                {t.seeAll}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {recentAppointments.length === 0 ? (
                        <EmptyState
                            description={t.recentAppointmentsEmpty}
                            style={styles.emptyRecentAppointments}
                            descriptionStyle={styles.emptyDescription}
                        />
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.cardsList}
                        >
                            {recentAppointments.map((appointment) => {
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
                            })}
                        </ScrollView>
                    )}
                </View>

                    {/* CLINICS NEAR YOU */}
                    <View style={styles.nearbySection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>
                                {t.clinicsNearYou}
                            </Text>

                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("SeeAll", {
                                        type: "nearby",
                                    })
                                }
                            >
                                <Text style={styles.seeAll}>
                                    {t.seeAll}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {clinics.length === 0 ? (
                            <EmptyState
                                description={t.nearbyClinicsEmpty}
                                style={styles.emptyNearby}
                                descriptionStyle={styles.emptyDescription}
                            />
                        ) : (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.cardsList}
                            >
                                {clinics.map((clinic) => (
                                    <ClinicCard
                                        key={clinic.id}
                                        clinic={clinic}
                                        onPress={() =>
                                            navigation.navigate("InstitutionDetails", {
                                                institution: clinic,
                                            })
                                        }
                                    />
                                ))}
                            </ScrollView>
                        )}
                    </View>

                    <View style={styles.bottomSpace} />
                </ScrollView>

                {/* BOTTOM NAVIGATION */}
                <BottomNavigation
                    navigation={navigation}
                    active="home"
                />
            </View>
    );
}