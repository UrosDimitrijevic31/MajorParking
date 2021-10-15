import { initReactI18next } from "react-i18next";
import XHR from "i18next-xhr-backend";
import i18next from "i18next";

import translationEn from "./locale-en.json";

i18next
    .use(XHR)
    .use(initReactI18next)
    .init({
        debug: process.env.NODE_ENV !== "production",
        lng: "en",
        fallbackLng: "en", // use sr if detected lng is not available

        // keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        },

        resources: {
            en: {
                translations: translationEn
            }
        },

        // react: {
        //     wait: true
        // }

        // have a common namespace used around the full app
        ns: ["translations"],
        defaultNS: "translations"
    });

export default i18next;
