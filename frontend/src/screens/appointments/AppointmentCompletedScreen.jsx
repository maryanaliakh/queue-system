import React, { useState } from "react";
import {ScrollView, Text, TouchableOpacity, View,} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import BottomNavigation from "../../components/BottomNavigation";
import { appointmentCompletedStyles as styles } from "../../styles/appointments/appointmentCompletedStyle";
import { useLanguage } from "../../context/LanguageContext";

export default function AppointmentCompletedScreen({ navigation }) {
    const [rating, setRating] = useState(0);
    const { t } = useLanguage();

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logo}>
                            <Text style={styles.logoGreen}>Q</Text>
                            <Text style={styles.logoPurple}>ast</Text>
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
                            color="#111111"
                        />
                    </TouchableOpacity>
                </View>

                {/* SUCCESS */}
                <View style={styles.resultIconWrapper}>
                    <View style={styles.circleOuter}>
                        <View style={styles.circleMiddle}>
                            <View style={styles.circleInner}>
                                <View style={styles.successCircle}>
                                    <Ionicons
                                        name="checkmark"
                                        size={28}
                                        color="#FFFFFF"
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <Text style={styles.title}>
                    {t.appointmentCompletedTitle}
                </Text>

                <Text style={styles.description}>
                    {t.appointmentCompletedDescription}
                </Text>

                <Text style={styles.ratingTitle}>
                    {t.rateExperience}
                </Text>

                {/* STARS */}
                <View style={styles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                            key={star}
                            activeOpacity={0.8}
                            onPress={() => setRating(star)}
                        >
                            <Ionicons
                                name={
                                    star <= rating
                                        ? "star"
                                        : "star-outline"
                                }
                                size={40}
                                color={
                                    star <= rating
                                        ? "#FFB800"
                                        : "#B9B9B9"
                                }
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.reviewButton}
                        activeOpacity={0.85}
                        onPress={() => {
                            // submit rating later
                        }}
                    >
                        <Text style={styles.reviewButtonText}>
                            {t.submitReview}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.historyButton}
                        activeOpacity={0.85}
                        onPress={() =>
                            navigation.navigate("AppointmentsHistory")
                        }
                    >
                        <Text style={styles.historyButtonText}>
                            Appointments History
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.hint}>
                        {t.appointmentCompletedHint}
                    </Text>
                </View>
            </ScrollView>

            <BottomNavigation
                navigation={navigation}
                active="appointments"
            />
        </View>
    );
}