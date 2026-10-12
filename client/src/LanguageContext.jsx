
import { createContext, useContext, useEffect, useState } from "react";
import translations from "./translation";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(
        localStorage.getItem("language") || "en"
    );

    useEffect(() => {
        const handleLanguageChange = (event) => {
            setLanguage(event.detail);
        };

        window.addEventListener("languageChanged", handleLanguageChange);

        return () => {
            window.removeEventListener("languageChanged", handleLanguageChange);
        };
    }, []);

    const changeLanguage = (newLanguage) => {
        if (!translations[newLanguage]) return;

        localStorage.setItem("language", newLanguage);
        setLanguage(newLanguage);

        window.dispatchEvent(
            new CustomEvent("languageChanged", {
                detail: newLanguage
            })
        );
    };

    const t = (key) => translations[language]?.[key] || translations.en[key] || key;

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error("useLanguage must be used inside LanguageProvider");
    }

    return context;
}