import React, { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { editProfileStyles as styles } from "../../styles/profile/editProfileStyle";
import { useLanguage } from "../../context/LanguageContext";

export default function EditProfileScreen({ navigation }) {
    const { t } = useLanguage();

    const [firstName, setFirstName] = useState("Devid");
    const [lastName, setLastName] = useState("Jonson");

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
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

                    <TouchableOpacity
                        style={styles.saveButton}
                        activeOpacity={0.8}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons
                            name="checkmark"
                            size={30}
                            color="#5657C4"
                        />
                    </TouchableOpacity>
                </View>

                {/* AVATAR */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatar}>
                        <Ionicons
                            name="person-outline"
                            size={62}
                            color="#111111"
                        />

                        <TouchableOpacity
                            style={styles.changePhotoButton}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="person-add"
                                size={15}
                                color="#111111"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* FORM */}
                <View style={styles.form}>
                    <View style={styles.field}>
                        <Text style={styles.label}>
                            {t.firstName}
                        </Text>

                        <TextInput
                            value={firstName}
                            onChangeText={setFirstName}
                            style={styles.input}
                            placeholderTextColor="#999999"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>
                            {t.lastName}
                        </Text>

                        <TextInput
                            value={lastName}
                            onChangeText={setLastName}
                            style={styles.input}
                            placeholderTextColor="#999999"
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}