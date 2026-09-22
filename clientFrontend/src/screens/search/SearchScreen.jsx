import React, { useEffect, useRef, useState } from "react";
import {
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { searchStyles as styles } from "../../styles/search/searchStyle";
import BottomNavigation from "../../components/BottomNavigation";
import EmptyState from "../../components/EmptyState";
import { useLanguage } from "../../context/LanguageContext";

const categories = [
    {
        value: "All",
        translationKey: "all",
    },
    {
        value: "Healthcare",
        translationKey: "categoryHealthcare",
    },
    {
        value: "Banking & Finance",
        translationKey: "categoryBankingFinance",
    },
    {
        value: "Government Services",
        translationKey: "categoryGovernmentServices",
    },
    {
        value: "Beauty & Wellness",
        translationKey: "categoryBeautyWellness",
    },
];

const clinics = [
    {
        id: 1,
        name: "Nova Medical Clinic",
        address: "24 Green Street, Warsaw",
        category: "Healthcare",
        rating: "4.5",
        image:
            "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=300",

        service: {
            name: "General Consultation",
            duration: "20 min",
            description:
                "Consultation with a doctor for health assessment, diagnosis, medical advice, and treatment recommendations.",
            spots: 10,
            queue: 10,
            waitingTime: 5,
        },
    },
    {
        id: 2,
        name: "City Health Center",
        address: "15 Main Street, Poznan",
        category: "Healthcare",
        rating: "4.8",
        image:
            "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300",

        service: {
            name: "Medical Examination",
            duration: "30 min",
            description:
                "General medical examination performed by a healthcare professional.",
            spots: 8,
            queue: 6,
            waitingTime: 5,
        },
    },
];

function ClinicCard({
                        clinic,
                        showService = false,
                        onPress,
                        onJoinQueue,
                        t,
                    }) {
    const category = categories.find(
        (item) => item.value === clinic.category
    );

    return (
        <View
            style={[
                styles.clinicCard,
                showService && styles.clinicCardExpanded,
            ]}
        >
            {/* CLINIC */}
            <TouchableOpacity
                style={styles.clinicTop}
                activeOpacity={0.8}
                onPress={onPress}
            >
                <Image
                    source={{ uri: clinic.image }}
                    style={styles.clinicImage}
                />

                <View style={styles.clinicInfo}>
                    <View style={styles.tagsRow}>
                        <View style={styles.categoryTag}>
                            <Text style={styles.categoryTagText}>
                                {category
                                    ? t[category.translationKey]
                                    : clinic.category}
                            </Text>
                        </View>

                        <View style={styles.ratingTag}>
                            <Text style={styles.star}>
                                ★
                            </Text>

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
            </TouchableOpacity>

            {/* SERVICE */}
            {showService && clinic.service && (
                <View style={styles.serviceContainer}>
                    <Text style={styles.serviceName}>
                        {clinic.service.name}
                    </Text>

                    <Text style={styles.serviceDuration}>
                        {clinic.service.duration}
                    </Text>

                    <Text style={styles.serviceDescription}>
                        {clinic.service.description}
                    </Text>

                    {/* QUEUE INFORMATION */}
                    <View style={styles.queueInfo}>
                        <View style={styles.spotsBadge}>
                            <Text style={styles.spotsText}>
                                {clinic.service.spots} {t.spotsRemaining}
                            </Text>
                        </View>

                        <View style={styles.queueBadge}>
                            <MaterialCommunityIcons
                                name="account-group-outline"
                                size={15}
                                color="#111111"
                            />

                            <Text style={styles.queueText}>
                                {clinic.service.queue} {t.queue}
                            </Text>
                        </View>

                        <View style={styles.waitingBadge}>
                            <MaterialCommunityIcons
                                name="timer-outline"
                                size={15}
                                color="#555555"
                            />

                            <Text style={styles.waitingText}>
                                + {clinic.service.waitingTime} {t.min}
                            </Text>
                        </View>
                    </View>

                    {/* JOIN QUEUE */}
                    <TouchableOpacity
                        style={styles.joinButton}
                        activeOpacity={0.85}
                        onPress={onJoinQueue}
                    >
                        <Text style={styles.joinButtonText}>
                            {t.joinQueue}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

export default function SearchScreen({ navigation, route }) {
    const { t } = useLanguage();

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [categoryPositions, setCategoryPositions] = useState({});

    const searchInputRef = useRef(null);
    const categoriesScrollRef = useRef(null);

    useEffect(() => {
        const x = categoryPositions[selectedCategory];

        if (x !== undefined) {
            categoriesScrollRef.current?.scrollTo({
                x: Math.max(0, x - 25),
                animated: true,
            });
        }
    }, [selectedCategory, categoryPositions]);

    useEffect(() => {
        if (route.params?.focusSearch) {
            searchInputRef.current?.focus();

            navigation.setParams({
                focusSearch: false,
            });
        }

        if (route.params?.category) {
            setSelectedCategory(route.params.category);

            navigation.setParams({
                category: undefined,
            });
        }
    }, [
        route.params?.focusSearch,
        route.params?.category,
    ]);

    const filteredClinics = clinics.filter((clinic) => {
        const matchesCategory =
            selectedCategory === "All" ||
            clinic.category === selectedCategory;

        const searchValue = search.trim().toLowerCase();

        const matchesSearch =
            searchValue === "" ||
            clinic.name.toLowerCase().includes(searchValue) ||
            clinic.service?.name.toLowerCase().includes(searchValue);

        return matchesCategory && matchesSearch;
    });

    const selectedCategoryData = categories.find(
        (category) => category.value === selectedCategory
    );

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>
                    {t.searchTitle}
                </Text>

                <TouchableOpacity
                    style={styles.notificationButton}
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

            {/* SEARCH */}
            <View style={styles.searchSection}>
                <View style={styles.searchWrapper}>
                    <Ionicons
                        name="search-outline"
                        size={20}
                        color="#858585"
                    />

                    <TextInput
                        ref={searchInputRef}
                        value={search}
                        onChangeText={setSearch}
                        placeholder={t.searchPlaceholder}
                        placeholderTextColor="#999999"
                        style={styles.searchInput}
                    />
                </View>
            </View>

            {/* EVERYTHING AFTER SEARCH SCROLLS */}
            <ScrollView
                style={styles.results}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* CATEGORIES */}
                <ScrollView
                    ref={categoriesScrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesScroll}
                    contentContainerStyle={styles.categories}
                >
                    {categories.map((category) => {
                        const active =
                            selectedCategory === category.value;

                        return (
                            <TouchableOpacity
                                key={category.value}
                                style={styles.categoryButton}
                                onLayout={(event) => {
                                    const { x } =
                                        event.nativeEvent.layout;

                                    setCategoryPositions((prev) => ({
                                        ...prev,
                                        [category.value]: x,
                                    }));
                                }}
                                onPress={() =>
                                    setSelectedCategory(category.value)
                                }
                            >
                                <Text
                                    style={[
                                        styles.categoryText,
                                        active &&
                                        styles.categoryTextActive,
                                    ]}
                                >
                                    {t[category.translationKey]}
                                </Text>

                                {active && (
                                    <View
                                        style={styles.categoryUnderline}
                                    />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* RESULTS HEADER */}
                <View style={styles.resultsHeader}>
                    <Text style={styles.resultsTitle}>
                        {selectedCategoryData
                            ? t[selectedCategoryData.translationKey]
                            : selectedCategory}
                    </Text>

                    <Text style={styles.resultsCountText}>
                        {filteredClinics.length} {t.results}
                    </Text>
                </View>

                {/* RESULTS */}
                <View style={styles.resultsContent}>
                    {filteredClinics.length === 0 ? (
                        <EmptyState
                            title={t.noResults}
                            description={t.noResultsDescription}
                            style={styles.emptyState}
                            titleStyle={styles.emptyTitle}
                            descriptionStyle={styles.emptyDescription}
                        />
                    ) : (
                        filteredClinics.map((clinic) => (
                            <ClinicCard
                                key={clinic.id}
                                clinic={clinic}
                                showService={search.length > 0}
                                t={t}
                                onPress={() =>
                                    navigation.navigate(
                                        "InstitutionDetails",
                                        {
                                            institution: clinic,
                                        }
                                    )
                                }
                                onJoinQueue={() =>
                                    navigation.navigate(
                                        "SelectDate",
                                        {
                                            service: clinic.service,
                                            institution: clinic,
                                        }
                                    )
                                }
                            />
                        ))
                    )}
                </View>

                <View style={styles.bottomSpace} />
            </ScrollView>

            {/* BOTTOM NAVIGATION */}
            <BottomNavigation
                navigation={navigation}
                active="search"
            />
        </View>
    );
}