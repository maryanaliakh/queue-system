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

import { selectDateStyles as styles } from "../../styles/appointments/selectDateStyle";
import { useLanguage } from "../../context/LanguageContext";

const employees = [
    {
        id: 0,
        name: null,
        image: null,
    },
    {
        id: 1,
        name: "Emma",
        image:
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300",
    },
    {
        id: 2,
        name: "Emma",
        image:
            "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300",
    },
    {
        id: 3,
        name: "Emma",
        image:
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300",
    },
];

const days = [
    { day: 1, disabled: true },
    { day: 2, disabled: true },
    { day: 3, disabled: true },

    { day: 4, disabled: true },
    { day: 5, disabled: true },
    { day: 6, disabled: true },
    { day: 7, disabled: true },
    { day: 8, disabled: true },
    { day: 9, disabled: true },
    { day: 10, disabled: true },

    { day: 11, disabled: true },
    { day: 12, disabled: true },
    { day: 13, disabled: true },
    { day: 14, disabled: true },
    { day: 15, disabled: true },
    { day: 16, disabled: true },
    { day: 17, disabled: true },

    { day: 18, disabled: true },
    { day: 19, disabled: true },
    { day: 20, disabled: true },
    { day: 21, status: "red" },
    { day: 22, status: "yellow" },
    { day: 23, disabled: true },
    { day: 24, disabled: true },

    { day: 25, status: "green" },
    { day: 26, status: "green" },
    { day: 27, status: "green" },
    { day: 28, status: "yellow" },
    { day: 29, status: "green" },
    { day: 30, disabled: true },
    { day: 31, disabled: true },
];

export default function SelectDateScreen({
                                             navigation,
                                             route,
                                         }) {
    const { t } = useLanguage();

    const { service, institution } = route.params;

    const [selectedEmployee, setSelectedEmployee] =
        useState(0);

    const [selectedDay, setSelectedDay] =
        useState(28);

    const [note, setNote] = useState("");

    const weekDays = [
        t.monShort,
        t.tueShort,
        t.wedShort,
        t.thuShort,
        t.friShort,
        t.satShort,
        t.sunShort,
    ];

    const selectedEmployeeData = employees.find(
        (employee) =>
            employee.id === selectedEmployee
    );

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

                <Text style={styles.headerTitle}>
                    {t.selectDateTitle}
                </Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* EMPLOYEES */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.employees}
                >
                    {employees.map((employee) => {
                        const selected =
                            selectedEmployee === employee.id;

                        return (
                            <TouchableOpacity
                                key={employee.id}
                                style={styles.employee}
                                activeOpacity={0.8}
                                onPress={() =>
                                    setSelectedEmployee(
                                        employee.id
                                    )
                                }
                            >
                                <View
                                    style={[
                                        styles.employeeAvatar,
                                        selected &&
                                        styles.employeeAvatarSelected,
                                    ]}
                                >
                                    {employee.image ? (
                                        <Image
                                            source={{
                                                uri: employee.image,
                                            }}
                                            style={
                                                styles.employeeImage
                                            }
                                        />
                                    ) : (
                                        <Ionicons
                                            name="person-outline"
                                            size={27}
                                            color="#111111"
                                        />
                                    )}

                                    {selected && (
                                        <View
                                            style={
                                                styles.selectedEmployeeBadge
                                            }
                                        >
                                            <Ionicons
                                                name="checkmark"
                                                size={10}
                                                color="#FFFFFF"
                                            />
                                        </View>
                                    )}
                                </View>

                                <Text
                                    style={styles.employeeName}
                                    numberOfLines={1}
                                >
                                    {employee.id === 0
                                        ? t.noPreference
                                        : employee.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* CALENDAR HEADER */}
                <View style={styles.calendarHeader}>
                    <Text style={styles.month}>
                        {t.may} 2026
                    </Text>

                    <View style={styles.monthButtons}>
                        <TouchableOpacity
                            style={styles.monthButton}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="chevron-back"
                                size={22}
                                color="#111111"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.monthButton}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="chevron-forward"
                                size={22}
                                color="#111111"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* WEEK DAYS */}
                <View style={styles.weekRow}>
                    {weekDays.map((day) => (
                        <Text
                            key={day}
                            style={styles.weekDay}
                        >
                            {day}
                        </Text>
                    ))}
                </View>

                {/* CALENDAR */}
                <View style={styles.calendar}>
                    {/* May 1 2026 = Friday */}
                    {Array.from({ length: 4 }).map(
                        (_, index) => (
                            <View
                                key={`empty-${index}`}
                                style={styles.dayContainer}
                            />
                        )
                    )}

                    {days.map((item) => {
                        const selected =
                            selectedDay === item.day;

                        // May 1, 2026 is Friday
                        const dayOfWeek =
                            (item.day + 3) % 7;

                        const isWeekend =
                            dayOfWeek === 5 ||
                            dayOfWeek === 6;

                        return (
                            <View
                                key={item.day}
                                style={styles.dayContainer}
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.dayButton,

                                        item.disabled &&
                                        !isWeekend
                                            ? styles.disabledDayButton
                                            : null,

                                        !item.disabled &&
                                        !selected
                                            ? styles.availableDayButton
                                            : null,

                                        isWeekend &&
                                        styles.weekendDayButton,

                                        selected &&
                                        styles.selectedDayButton,
                                    ]}
                                    disabled={item.disabled}
                                    activeOpacity={0.8}
                                    onPress={() =>
                                        setSelectedDay(
                                            item.day
                                        )
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.dayText,

                                            item.disabled &&
                                            styles.disabledDayText,

                                            isWeekend &&
                                            styles.weekendDayText,

                                            selected &&
                                            styles.selectedDayText,
                                        ]}
                                    >
                                        {item.day}
                                    </Text>

                                    {item.status && (
                                        <View
                                            style={[
                                                styles.statusLine,

                                                item.status ===
                                                "green" &&
                                                styles.greenStatus,

                                                item.status ===
                                                "yellow" &&
                                                styles.yellowStatus,

                                                item.status ===
                                                "red" &&
                                                styles.redStatus,
                                            ]}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>

                {/* SERVICE */}
                <View style={styles.serviceCard}>
                    <Text style={styles.serviceName}>
                        {service.name}
                    </Text>

                    <View style={styles.serviceMeta}>
                        <Text style={styles.duration}>
                            {service.duration}
                        </Text>

                        <Text style={styles.date}>
                            {selectedDay} {t.may} 2026
                        </Text>
                    </View>

                    <View style={styles.serviceBadges}>
                        <View style={styles.spotsBadge}>
                            <Text style={styles.spotsText}>
                                {service.spots}{" "}
                                {t.spotsRemaining}
                            </Text>
                        </View>

                        <View style={styles.queueBadge}>
                            <MaterialCommunityIcons
                                name="account-group-outline"
                                size={14}
                                color="#555555"
                            />

                            <Text style={styles.queueText}>
                                {service.queue} {t.queue}
                            </Text>
                        </View>

                        <View style={styles.queueBadge}>
                            <MaterialCommunityIcons
                                name="timer-outline"
                                size={14}
                                color="#555555"
                            />

                            <Text style={styles.queueText}>
                                12:30 {t.estimatedTime}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.selectedEmployee}>
                        <View
                            style={
                                styles.selectedEmployeeLeft
                            }
                        >
                            <View style={styles.smallAvatar}>
                                <Ionicons
                                    name="person-outline"
                                    size={21}
                                    color="#111111"
                                />
                            </View>

                            <Text
                                style={
                                    styles.selectedEmployeeName
                                }
                            >
                                {selectedEmployee === 0
                                    ? t.noPreference
                                    : selectedEmployeeData?.name}
                            </Text>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.8}
                        >
                            <Text style={styles.changeText}>
                                {t.change}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* NOTES */}
                <Text style={styles.notesTitle}>
                    {t.visitNotesQuestion}
                </Text>

                <TextInput
                    style={styles.notesInput}
                    value={note}
                    onChangeText={setNote}
                    placeholder={t.yourNote}
                    placeholderTextColor="#999999"
                    multiline
                    textAlignVertical="top"
                />

                {/* CONTINUE */}
                <TouchableOpacity
                    style={styles.continueButton}
                    activeOpacity={0.85}
                    onPress={() =>
                        navigation.navigate(
                            "QueueSuccess"
                        )
                    }
                >
                    <Text
                        style={styles.continueButtonText}
                    >
                        {t.continue}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}