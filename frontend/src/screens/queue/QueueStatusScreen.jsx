import React from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { queueStatusStyles as styles } from "../../styles/queue/queueStatusStyle";
import { useLanguage } from "../../context/LanguageContext";

export default function QueueStatusScreen({ navigation, route }) {
    const { t } = useLanguage();

    const position = route.params?.position ?? 2;

    const appointment = route.params?.appointment ?? {
        estimatedTime: "12:30",
        waitingTime: "5 min",
        employee: "Dr. Emma Ficher",
        room: "305 A",
        service: "General Consultation",
    };

    const getStatus = () => {
        if (position <= 2) {
            return {
                color: "#2ECC40",
                background: "#DDF8DF",
            };
        }

        if (position <= 5) {
            return {
                color: "#FFBD16",
                background: "#FFF1AE",
            };
        }

        return {
            color: "#F21B0C",
            background: "#FFDADA",
        };
    };

    const status = getStatus();

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* PURPLE HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={28}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        {t.queueStatusTitle}
                    </Text>

                    <Text style={styles.headerDescription}>
                        {t.queueStatusDescription}
                    </Text>
                </View>

                {/* POSITION */}
                <View
                    style={[
                        styles.positionCircle,
                        {
                            borderColor: status.color,
                        },
                    ]}
                >
                    <Text style={styles.positionNumber}>
                        {position}
                    </Text>

                    <Text style={styles.positionText}>
                        {t.position}
                    </Text>
                </View>

                <Text style={styles.infoText}>
                    {t.queueStatusInfo}
                </Text>

                {/* INFORMATION */}
                <View style={styles.cards}>
                    <View
                        style={[
                            styles.smallCard,
                            {
                                backgroundColor: status.background,
                                borderColor: status.color,
                            },
                        ]}
                    >
                        <Text style={styles.cardLabel}>
                            {t.estimatedEntryTime}
                        </Text>

                        <Text style={styles.cardValue}>
                            {appointment.estimatedTime}
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.smallCard,
                            {
                                backgroundColor: status.background,
                                borderColor: status.color,
                            },
                        ]}
                    >
                        <Text style={styles.cardLabel}>
                            {t.approximateWaitingTime}
                        </Text>

                        <Text style={styles.cardValue}>
                            {appointment.waitingTime}
                        </Text>
                    </View>

                    <View style={styles.smallCard}>
                        <Text style={styles.cardLabel}>
                            {t.employee}
                        </Text>

                        <Text style={styles.cardValue}>
                            {appointment.employee}
                        </Text>
                    </View>

                    <View style={styles.smallCard}>
                        <Text style={styles.cardLabel}>
                            {t.roomLabel}
                        </Text>

                        <Text style={styles.cardValue}>
                            {appointment.room}
                        </Text>
                    </View>

                    <View style={styles.serviceCard}>
                        <Text style={styles.cardLabel}>
                            {t.serviceName}
                        </Text>

                        <Text style={styles.cardValue}>
                            {appointment.service}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}