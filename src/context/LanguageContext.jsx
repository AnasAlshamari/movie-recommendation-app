import React, { createContext, useState, useEffect, useContext } from 'react';
import { translations } from '../services/localization';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(localStorage.getItem('tawsyah_lang') || 'ar');

    useEffect(() => {
        localStorage.setItem('tawsyah_lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }, [lang]);

    const toggleLanguage = () => {
        setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
    };

    const t = (key) => {
        return translations[lang][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
