import React from "react";
import {
    Image,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { popUpWindowStyles as styles } from "../../styles/popUpWindows/popUpWindowStyle";
import { useLanguage } from "../../context/LanguageContext";

export default function PopUpWindow({
                                        type,
                                        appointment,
                                        timeLeft = "2:00",
                                        onConfirm,
                                        onDecline,
                                        onSelectTime,
                                    }) {
    const { t } = useLanguage();

    const isConfirmation = type === "confirmation";
    const isUrgent = type === "urgent";
    const isLastMinute = type === "lastMinute";

    const timeOptions = [
        {
            value: "now",
            label: t.now,
        },
        {
            value: "+5 min",
            label: `+5 ${t.min}`,
        },
        {
            value: "+10 min",
            label: `+10 ${t.min}`,
        },
        {
            value: "+15 min",
            label: `+15 ${t.min}`,
        },
    ];

    return (
        <View
            style={[
                styles.container,
                isConfirmation && styles.confirmationContainer,
                isUrgent && styles.urgentContainer,
                isLastMinute && styles.lastMinuteContainer,
            ]}
        >
            {/* TIMER */}
            <View style={styles.timer}>
                <Ionicons
                    name="timer-outline"
                    size={16}
                    color="#111111"
                />

                <Text style={styles.timerText}>
                    {timeLeft}
                </Text>
            </View>

            {/* TITLE */}
            <Text style={styles.title}>
                {isConfirmation && t.confirmationPopupTitle}
                {isUrgent && t.urgentPopupTitle}
                {isLastMinute && t.lastMinutePopupTitle}
            </Text>

            {/* DESCRIPTION */}
            <Text style={styles.description}>
                {isConfirmation && t.confirmationPopupDescription}
                {isUrgent && t.urgentPopupDescription}
                {isLastMinute && t.lastMinutePopupDescription}
            </Text>

            {/* INSTITUTION - only urgent / last minute */}
            {!isConfirmation && (
                <View style={styles.institutionCard}>
                    <Image
                        source={{
                            uri: appointment.institution.image,
                        }}
                        style={styles.institutionImage}
                    />

                    <View style={styles.institutionInfo}>
                        <View style={styles.tagsRow}>
                            <View style={styles.categoryTag}>
                                <Text style={styles.categoryText}>
                                    {appointment.institution.category}
                                </Text>
                            </View>

                            <View style={styles.ratingTag}>
                                <Text style={styles.star}>
                                    ★
                                </Text>

                                <Text style={styles.ratingText}>
                                    {appointment.institution.rating}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.institutionName}>
                            {appointment.institution.name}
                        </Text>

                        <Text style={styles.address}>
                            {appointment.institution.address}
                        </Text>
                    </View>
                </View>
            )}

            {/* APPOINTMENT */}
            <View style={styles.appointmentCard}>
                <View>
                    <Text style={styles.serviceName}>
                        {appointment.service}
                    </Text>

                    <Text style={styles.duration}>
                        {appointment.duration}
                    </Text>
                </View>

                <View style={styles.appointmentRight}>
                    <View style={styles.dateBadge}>
                        <Text style={styles.dateText}>
                            {appointment.date}
                        </Text>
                    </View>

                    <View style={styles.timeBadge}>
                        <Ionicons
                            name="time-outline"
                            size={14}
                            color="#333333"
                        />

                        <Text style={styles.timeText}>
                            {appointment.time}
                        </Text>
                    </View>
                </View>
            </View>

            {/* CONFIRMATION BUTTONS */}
            {isConfirmation && (
                <View style={styles.confirmationButtons}>
                    <TouchableOpacity
                        style={styles.yesButton}
                        activeOpacity={0.85}
                        onPress={onConfirm}
                    >
                        <Text style={styles.yesButtonText}>
                            {t.yes}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.noButton}
                        activeOpacity={0.85}
                        onPress={onDecline}
                    >
                        <Text style={styles.noButtonText}>
                            {t.no}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* URGENT / LAST MINUTE */}
            {!isConfirmation && (
                <>
                    <View style={styles.timeOptions}>
                        {timeOptions.map((time) => (
                            <TouchableOpacity
                                key={time.value}
                                style={styles.timeOptionButton}
                                activeOpacity={0.85}
                                onPress={() =>
                                    onSelectTime?.(time.value)
                                }
                            >
                                <Text style={styles.timeOptionText}>
                                    {time.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.declineButton}
                        activeOpacity={0.85}
                        onPress={onDecline}
                    >
                        <Text style={styles.declineButtonText}>
                            {t.decline}
                        </Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}