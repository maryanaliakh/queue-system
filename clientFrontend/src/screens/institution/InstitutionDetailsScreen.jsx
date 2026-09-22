import React, { useState } from "react";
import {
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";

import BottomNavigation from "../../components/BottomNavigation";
import { institutionDetailsStyles as styles } from "../../styles/institution/institutionDetailsStyle";
import { useLanguage } from "../../context/LanguageContext";

const institutionDetails = {
    1: {
        description:
            "Nova Medical Clinic provides medical consultations, diagnostics, laboratory tests, and specialist care.",

        phone: "+48 123 456 789",
        email: "nova@gmail.com",

        workingHours: [
            { day: "Monday", from: "10:00", to: "20:00" },
            { day: "Tuesday", from: "10:00", to: "20:00" },
            { day: "Wednesday", holiday: true },
            { day: "Thursday", from: "10:00", to: "20:00" },
            { day: "Friday", from: "10:00", to: "20:00" },
            { day: "Saturday", closed: true },
            { day: "Sunday", closed: true },
        ],

        services: [
            {
                id: 1,
                name: "General Consultation",
                duration: "20 min",
                description:
                    "Consultation with a doctor for health assessment, diagnosis, medical advice, and treatment recommendations.",
                spots: 10,
                queue: 10,
                queueType: "yellow",
            },
            {
                id: 2,
                name: "Blood Test",
                duration: "15 min",
                description:
                    "Laboratory blood test performed by qualified medical staff.",
                spots: 8,
                queue: 5,
                queueType: "green",
            },
        ],
    },

    2: {
        description:
            "City Health Center offers primary healthcare, medical examinations, diagnostics, and preventive care.",

        phone: "+48 987 654 321",
        email: "cityhealth@gmail.com",

        workingHours: [
            { day: "Monday", from: "08:00", to: "18:00" },
            { day: "Tuesday", from: "08:00", to: "18:00" },
            { day: "Wednesday", from: "08:00", to: "18:00" },
            { day: "Thursday", from: "08:00", to: "18:00" },
            { day: "Friday", from: "08:00", to: "16:00" },
            { day: "Saturday", closed: true },
            { day: "Sunday", closed: true },
        ],

        services: [
            {
                id: 1,
                name: "General Consultation",
                duration: "20 min",
                description:
                    "General medical consultation and health assessment.",
                spots: 6,
                queue: 4,
                queueType: "green",
            },
            {
                id: 2,
                name: "Medical Examination",
                duration: "30 min",
                description:
                    "General medical examination performed by a healthcare professional.",
                spots: 5,
                queue: 7,
                queueType: "yellow",
            },
        ],
    },
};

export default function InstitutionDetailsScreen({
                                                     navigation,
                                                     route,
                                                 }) {
    const { t } = useLanguage();

    const [activeTab, setActiveTab] = useState("info");
    const [search, setSearch] = useState("");

    const selectedInstitution = route.params?.institution;

    const institution = {
        ...institutionDetails[selectedInstitution?.id],
        ...selectedInstitution,
    };

    const filteredServices = institution.services.filter((service) =>
        service.name
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    );

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
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
                </View>

                {/* INSTITUTION */}
                <View style={styles.institution}>
                    <Image
                        source={{ uri: institution.image }}
                        style={styles.institutionImage}
                    />

                    <View style={styles.institutionInfo}>
                        <View style={styles.badges}>
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>
                                    {institution.category}
                                </Text>
                            </View>

                            <View style={styles.ratingBadge}>
                                <Ionicons
                                    name="star"
                                    size={12}
                                    color="#FFC21A"
                                />

                                <Text style={styles.ratingText}>
                                    {institution.rating}
                                </Text>
                            </View>
                        </View>

                        <Text
                            style={styles.institutionName}
                            numberOfLines={2}
                        >
                            {institution.name}
                        </Text>

                        <Text
                            style={styles.address}
                            numberOfLines={2}
                        >
                            {institution.address}
                        </Text>
                    </View>
                </View>

                {/* TABS */}
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === "info" &&
                            styles.activeTab,
                        ]}
                        onPress={() => setActiveTab("info")}
                        activeOpacity={1}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "info" &&
                                styles.activeTabText,
                            ]}
                        >
                            {t.info}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === "services" &&
                            styles.activeTab,
                        ]}
                        onPress={() =>
                            setActiveTab("services")
                        }
                        activeOpacity={1}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "services" &&
                                styles.activeTabText,
                            ]}
                        >
                            {t.services}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* TAB CONTENT */}
                {activeTab === "info" ? (
                    <Info
                        institution={institution}
                        t={t}
                    />
                ) : (
                    <Services
                        services={filteredServices}
                        search={search}
                        setSearch={setSearch}
                        institution={institution}
                        navigation={navigation}
                        t={t}
                    />
                )}

                <View style={styles.bottomSpace} />
            </ScrollView>

            <BottomNavigation navigation={navigation} />
        </View>
    );
}

function Info({ institution, t }) {
    return (
        <View style={styles.tabContent}>
            <Text style={styles.description}>
                {institution.description}
            </Text>

            {/* CONTACTS */}
            <View style={styles.contactRow}>
                <Ionicons
                    name="call"
                    size={18}
                    color="#111111"
                />

                <Text style={styles.contactText}>
                    {institution.phone}
                </Text>
            </View>

            <View style={styles.contactRow}>
                <Ionicons
                    name="mail"
                    size={18}
                    color="#111111"
                />

                <Text style={styles.contactText}>
                    {institution.email}
                </Text>
            </View>

            {/* OPENING HOURS */}
            <Text style={styles.sectionTitle}>
                {t.openingHours}
            </Text>

            <View style={styles.workingHours}>
                {institution.workingHours.map((item) => (
                    <View
                        key={item.day}
                        style={styles.workingRow}
                    >
                        <Text style={styles.day}>
                            {t[item.day.toLowerCase()]}
                        </Text>

                        {item.holiday ? (
                            <>
                                <Text style={styles.holiday}>
                                    {t.holiday}
                                </Text>

                                <Text style={styles.holiday}>
                                    {t.holiday}
                                </Text>
                            </>
                        ) : item.closed ? (
                            <>
                                <Text style={styles.closed}>
                                    {t.closed}
                                </Text>

                                <Text style={styles.closed}>
                                    {t.closed}
                                </Text>
                            </>
                        ) : (
                            <>
                                <View style={styles.timeGroup}>
                                    <Text style={styles.timeLabel}>
                                        {t.from}
                                    </Text>

                                    <Text style={styles.time}>
                                        {item.from}
                                    </Text>
                                </View>

                                <View style={styles.timeGroup}>
                                    <Text style={styles.timeLabel}>
                                        {t.to}
                                    </Text>

                                    <Text style={styles.time}>
                                        {item.to}
                                    </Text>
                                </View>
                            </>
                        )}
                    </View>
                ))}
            </View>

            {/* MAP PLACEHOLDER */}
            <View style={styles.map}>
                <Ionicons
                    name="location"
                    size={38}
                    color="#E8213A"
                />

                <Text style={styles.mapText}>
                    {institution.address}
                </Text>
            </View>
        </View>
    );
}

function Services({
                      services,
                      search,
                      setSearch,
                      institution,
                      navigation,
                      t,
                  }) {
    return (
        <View style={styles.servicesContent}>
            {/* SEARCH */}
            <View style={styles.search}>
                <Ionicons
                    name="search-outline"
                    size={20}
                    color="#8E8E8E"
                />

                <TextInput
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                    placeholder={t.searchServices}
                    placeholderTextColor="#999999"
                />
            </View>

            {/* SERVICES */}
            {services.map((service) => (
                <View
                    key={service.id}
                    style={styles.serviceCard}
                >
                    <Text style={styles.serviceName}>
                        {service.name}
                    </Text>

                    <Text style={styles.duration}>
                        {service.duration}
                    </Text>

                    <Text style={styles.serviceDescription}>
                        {service.description}
                    </Text>

                    <View style={styles.queueRow}>
                        <View style={styles.spotsBadge}>
                            <Text style={styles.spotsText}>
                                {service.spots} {t.spotsRemaining}
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.queueBadge,
                                service.queueType === "green"
                                    ? styles.greenQueue
                                    : styles.yellowQueue,
                            ]}
                        >
                            <MaterialCommunityIcons
                                name="account-group-outline"
                                size={15}
                                color="#111111"
                            />

                            <Text style={styles.queueText}>
                                {service.queue} {t.queue}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.joinButton}
                        activeOpacity={0.85}
                        onPress={() =>
                            navigation.navigate("SelectDate", {
                                service,
                                institution,
                            })
                        }
                    >
                        <Text style={styles.joinButtonText}>
                            {t.joinQueue}
                        </Text>
                    </TouchableOpacity>
                </View>
            ))}

            {services.length === 0 && (
                <Text style={styles.noServices}>
                    {t.noServicesFound}
                </Text>
            )}
        </View>
    );
}