import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Image,
} from "react-native";

import { forgotPasswordUser } from "../api/authApi";
import { useLanguage } from "../context/LanguageContext";
import { useMessage } from "../context/MessageContext";
import { authStyles as styles } from "../styles/authStyles";

export default function ForgotPasswordScreen({ navigation }) {
    const [login, setLogin] = useState("");
    const [loading, setLoading] = useState(false);

    const { t } = useLanguage();
    const { showMessage } = useMessage();

    const handleForgotPassword = async () => {
        if (!login.trim()) {
            showMessage(t.enterEmailOrPhone, "error");
            return;
        }

        try {
            setLoading(true);

            const data = await forgotPasswordUser({
                login: login.trim(),
            });

            showMessage(`${data.message}\nTest code: ${data.verification_code}`, "success");

            setTimeout(() => {
                navigation.navigate("Code", {
                    login: login.trim(),
                    verificationCode: data.verification_code,
                    flow: "reset",
                });
            }, 1000);
        } catch (error) {
            showMessage(error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <TouchableOpacity
                style={styles.languageButton}
                onPress={() => navigation.navigate("Language")}
            >
                <Text style={styles.languageText}>{t.languageName}</Text>
                <Image
                    source={require("../../assets/down-arrow.png")}
                    style={styles.languageArrow}
                />
            </TouchableOpacity>

            <Text style={[styles.logo, styles.logoMargin]}>
                <Text style={styles.logoGreen}>Q</Text>
                <Text style={styles.logoBlue}>ast</Text>
            </Text>

            <Text style={[styles.title, styles.titleForgot]}>
                {t.forgotPasswordTitle}
            </Text>

            <View style={styles.inputWrapper}>
                <Image
                    source={require("../../assets/email.png")}
                    style={styles.inputIcon}
                />

                <TextInput
                    style={styles.input}
                    placeholder={t.emailOrPhone}
                    placeholderTextColor="#9E9E9E"
                    value={login}
                    onChangeText={setLogin}
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.forgotPasswordSpacer} />

            <TouchableOpacity
                style={styles.mainButton}
                onPress={handleForgotPassword}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.mainButtonText}>
                        {t.confirmButton || t.confirm}
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.bottomRow}
                activeOpacity={1}
                onPress={() => navigation.navigate("Login")}
            >
                <Text style={styles.bottomText}>{t.rememberPassword} </Text>
                <Text style={styles.linkText}>{t.loginLink}</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}