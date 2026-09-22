import React, { useState } from "react";
import {
    Image,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { appointmentDetailsStyles as styles } from "../../styles/appointments/appointmentDetailsStyle";
import { useLanguage } from "../../context/LanguageContext";

export default function AppointmentDetailsScreen({ navigation }) {
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const { t } = useLanguage();

    return (
        <View style={styles.container}>
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

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* SERVICE */}
                <Text style={styles.sectionTitle}>
                    {t.service}
                </Text>

                <View style={styles.details}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                            {t.name}
                        </Text>

                        <Text style={styles.detailValue}>
                            General Consultation
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                            {t.description}
                        </Text>

                        <Text style={styles.detailValue}>
                            Before the procedure, it is recommended to avoid
                            direct sun exposure, aggressive skincare products,
                            and alcohol for 24 hours. Please arrive with clean
                            skin and inform the specialist about any allergies
                            or medical conditions. Following these
                            recommendations will help achieve the best results
                            and ensure your comfort during the treatment.
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                            {t.duration}
                        </Text>

                        <Text style={styles.detailValue}>
                            20 min
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                            {t.data}
                        </Text>

                        <Text style={styles.detailValue}>
                            28 May 2026
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                            {t.roomLabel}
                        </Text>

                        <Text style={styles.detailValue}>
                            305 A
                        </Text>
                    </View>
                </View>

                {/* CLIENT */}
                <Text style={styles.sectionTitle}>
                    {t.client}
                </Text>

                <View style={styles.clientHeader}>
                    <View style={styles.clientAvatar}>
                        <Ionicons
                            name="person-outline"
                            size={31}
                            color="#111111"
                        />
                    </View>

                    <Text style={styles.clientName}>
                        Devid Jonson
                    </Text>
                </View>

                <View style={styles.details}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                            {t.name}
                        </Text>

                        <Text style={styles.detailValue}>
                            Devid Jonson
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                            {t.phoneNumber}
                        </Text>

                        <Text style={styles.detailValue}>
                            +48 123 456 789
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                            {t.email}
                        </Text>

                        <Text style={styles.detailValue}>
                            client@gmail.com
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                            {t.notes}
                        </Text>

                        <Text style={styles.detailValue}>
                            Before the procedure, it is recommended to avoid
                            direct sun exposure, aggressive skincare products,
                            and alcohol for 24 hours.
                        </Text>
                    </View>
                </View>

                {/* EMPLOYEE */}
                <Text style={styles.sectionTitle}>
                    {t.employee}
                </Text>

                <TouchableOpacity
                    style={styles.employeeCard}
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate("EmployeeDetails")}
                >
                    <View style={styles.employeeInfo}>
                        <Image
                            source={{
                                uri: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300",
                            }}
                            style={styles.employeeImage}
                        />

                        <Text style={styles.employeeName}>
                            Dr. Emma Ficher
                        </Text>
                    </View>

                    <View style={styles.roomInfo}>
                        <View style={styles.roomBadge}>
                            <Text style={styles.roomNumber}>
                                305 A
                            </Text>
                        </View>

                        <Text style={styles.roomLabel}>
                            {t.roomLabel}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* LOCATION */}
                <Text style={styles.sectionTitle}>
                    {t.location}
                </Text>

                <TouchableOpacity
                    style={styles.locationCard}
                    activeOpacity={0.85}
                    onPress={() =>
                        navigation.navigate("InstitutionDetails", {
                            institution: {
                                id: 1,
                                name: "Nova Medical Clinic",
                                address: "24 Green Street, Warsaw",
                                category: "Healthcare",
                                rating: "4.5",
                                image:
                                    "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=300",
                            },
                        })
                    }
                >
                    <Image
                        source={{
                            uri: "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=300",
                        }}
                        style={styles.locationImage}
                    />

                    <View style={styles.locationInfo}>
                        <View style={styles.tagsRow}>
                            <View style={styles.categoryTag}>
                                <Text style={styles.categoryText}>
                                    Healthcare
                                </Text>
                            </View>

                            <View style={styles.ratingTag}>
                                <Text style={styles.star}>
                                    ★
                                </Text>

                                <Text style={styles.ratingText}>
                                    4.5
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.locationName}>
                            Nova Medical Clinic
                        </Text>

                        <Text style={styles.locationAddress}>
                            24 Green Street, Warsaw
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* CANCEL */}
                <TouchableOpacity
                    style={styles.cancelButton}
                    activeOpacity={0.9}
                    onPress={() => setCancelModalVisible(true)}
                >
                    <Text style={styles.cancelButtonText}>
                        {t.cancelAppointment}
                    </Text>
                </TouchableOpacity>

                <View style={styles.bottomSpace} />
            </ScrollView>

            <Modal
                visible={cancelModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setCancelModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {t.modalTitleAppointment}
                        </Text>

                        <TouchableOpacity
                            style={styles.modalBackButton}
                            activeOpacity={0.9}
                            onPress={() => setCancelModalVisible(false)}
                        >
                            <Text style={styles.modalBackText}>
                                {t.back}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            activeOpacity={0.9}
                            onPress={() => {
                                //request api
                                setCancelModalVisible(false);
                            }}
                        >
                            <Text style={styles.modalCancelText}>
                                {t.cancelAppointment}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
}