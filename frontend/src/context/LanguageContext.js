import React, { createContext, useContext, useEffect, useState } from "react";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { translations } from "../i18n/translations";

const LanguageContext = createContext();

const LANGUAGE_STORAGE_KEY = "app_language";

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState("en");
    const [isLanguageReady, setIsLanguageReady] = useState(false);

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

            if (savedLanguage) {
                setLanguageState(savedLanguage);
                return;
            }

            const deviceLanguage = Localization.getLocales()[0]?.languageCode;
            const defaultLanguage = deviceLanguage === "pl" ? "pl" : "en";

            setLanguageState(defaultLanguage);
        } catch (error) {
            setLanguageState("en");
        } finally {
            setIsLanguageReady(true);
        }
    };

    const changeLanguage = async (newLanguage) => {
        setLanguageState(newLanguage);
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage: changeLanguage,
                t: translations[language],
                isLanguageReady,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}