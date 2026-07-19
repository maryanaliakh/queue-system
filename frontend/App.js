import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./src/screens/SplashScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import CodeScreen from "./src/screens/CodeScreen";
import ResetPasswordScreen from "./src/screens/ResetPasswordScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import LanguageScreen from "./src/screens/LanguageScreen";
import RoleSelectionScreen from "./src/screens/RoleSelectionScreen";

import { LanguageProvider } from "./src/context/LanguageContext";
import { MessageProvider } from "./src/context/MessageContext";

const Stack = createNativeStackNavigator();

export default function App() {
    const [fontsLoaded] = useFonts({
        "Nunito-ExtraBold": require("./assets/fonts/Nunito-ExtraBold.ttf"),
        "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-Medium": require("./assets/fonts/Montserrat-Medium.ttf"),
        "Montserrat-SemiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
    });

    if (!fontsLoaded) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#FFFFFF",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator color="#5657C4" />
            </View>
        );
    }

    return (
        <LanguageProvider>
            <MessageProvider>
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Splash" component={SplashScreen} />
                        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                        <Stack.Screen name="Code" component={CodeScreen} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                        <Stack.Screen name="Language" component={LanguageScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </MessageProvider>
        </LanguageProvider>
    );
}