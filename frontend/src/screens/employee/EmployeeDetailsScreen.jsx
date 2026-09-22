import React from "react";
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { employeeDetailsStyles as styles } from "../../styles/employee/employeeDetailsStyle";
import { useLanguage } from "../../context/LanguageContext";

const workingHours = [
    { day: "Monday", from: "10:00", to: "20:00" },
    { day: "Tuesday", from: "10:00", to: "20:00" },
    { day: "Wednesday", from: "10:00", to: "20:00" },
    { day: "Thursday", from: "10:00", to: "20:00" },
    { day: "Friday", from: "10:00", to: "20:00" },
    { day: "Saturday", dayOff: true },
    { day: "Sunday", dayOff: true },
];

const services = [
    {
        id: 1,
        name: "General Consultation",
        duration: "20 min",
        description:
            "Consultation with a doctor for health assessment, diagnosis, medical advice, and treatment recommendations.",
    },
    {
        id: 2,
        name: "General Consultation",
        duration: "20 min",
        description:
            "Consultation with a doctor for health assessment, diagnosis, medical advice, and treatment recommendations.",
    },
];

export default function EmployeeDetailsScreen({ navigation }) {
    const { t } = useLanguage();
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    activeOpacity={0.8}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons
                        name="chevron-back"
                        size={27}
                        color="#5657C4"
                    />
                </TouchableOpacity>

            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* EMPLOYEE */}
                <View style={styles.employeeHeader}>
                    <Image
                        source={{
                            uri: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300",
                        }}
                        style={styles.employeeImage}
                    />

                    <View style={styles.roomBadge}>
                        <Text style={styles.roomNumber}>305 A</Text>
                    </View>

                    <Text style={styles.roomLabel}>{t.roomLabel}</Text>

                    <Text style={styles.employeeName}>
                        Emma Ficher
                    </Text>
                </View>

                {/* CONTACT */}
                <View style={styles.contacts}>
                    <View style={styles.contactRow}>
                        <Ionicons
                            name="call"
                            size={16}
                            color="#111111"
                        />

                        <Text style={styles.contactText}>
                            +48 123 456 789
                        </Text>
                    </View>

                    <View style={styles.contactRow}>
                        <Ionicons
                            name="mail"
                            size={16}
                            color="#111111"
                        />

                        <Text style={styles.contactText}>
                            username@gmail.com
                        </Text>
                    </View>
                </View>

                {/* WORKING HOURS */}
                <Text style={styles.sectionTitle}>
                    {t.workingHours}
                </Text>

                <View style={styles.workingHours}>
                    {workingHours.map((item) => (
                        <View
                            key={item.day}
                            style={styles.workingRow}
                        >
                            <Text style={styles.day}>
                                {item.day}
                            </Text>

                            {item.dayOff ? (
                                <>
                                    <Text style={styles.dayOff}>
                                        {t.dayOff}
                                    </Text>

                                    <Text style={styles.dayOff}>
                                        {t.dayOff}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <View style={styles.timeGroup}>
                                        <Text style={styles.timeLabel}>
                                            {t.fromText}
                                        </Text>

                                        <Text style={styles.time}>
                                            {item.from}
                                        </Text>
                                    </View>

                                    <View style={styles.timeGroup}>
                                        <Text style={styles.timeLabel}>
                                            {t.toText}
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

                {/* INSTITUTION */}
                <Text style={styles.sectionTitle}>
                    {t.institutionTitle}
                </Text>

                <TouchableOpacity
                    style={styles.institutionCard}
                    activeOpacity={0.85}
                    onPress={() =>
                        navigation.navigate("InstitutionDetails", {
                            institution: {
                                id: 1,
                                name: "Nova Medical Clinic",
                                category: "Healthcare",
                                rating: "4.5",
                                address: "24 Green Street, Warsaw",
                                image:
                                    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300",
                            },
                        })
                    }
                >
                    <Image
                        source={{
                            uri: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300",
                        }}
                        style={styles.institutionImage}
                    />

                    <View style={styles.institutionInfo}>
                        <View style={styles.tagsRow}>
                            <View style={styles.categoryTag}>
                                <Text style={styles.categoryText}>
                                    Healthcare
                                </Text>
                            </View>

                            <View style={styles.ratingTag}>
                                <Text style={styles.star}>★</Text>

                                <Text style={styles.ratingText}>
                                    4.5
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.institutionName}>
                            Nova Medical Clinic
                        </Text>

                        <Text style={styles.institutionAddress}>
                            24 Green Street, Warsaw
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* SERVICES */}
                <Text style={styles.sectionTitle}>
                    {t.services}
                </Text>

                {services.map((service) => (
                    <View
                        key={service.id}
                        style={styles.serviceCard}
                    >
                        <Text style={styles.serviceName}>
                            {service.name}
                        </Text>

                        <Text style={styles.serviceDuration}>
                            {service.duration}
                        </Text>

                        <Text style={styles.serviceDescription}>
                            {service.description}
                        </Text>
                    </View>
                ))}

                <View style={styles.bottomSpace} />
            </ScrollView>
        </View>
    );
}