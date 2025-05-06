import { CookieConsentConfig } from 'vanilla-cookieconsent'

export const consentPluginConfig: CookieConsentConfig = {
    cookie: {
        expiresAfterDays: 365,
    },

    guiOptions: {
        consentModal: {
            layout: 'box',
            position: 'bottom center',
            equalWeightButtons: true,
            flipButtons: false,
        },
        preferencesModal: {
            layout: 'box',
            position: 'right',
            equalWeightButtons: true,
            flipButtons: false,
        },
    },

    categories: {
        necessary: {
            readOnly: true,
            enabled: true,
        },
        analytics: {
            autoClear: {
                cookies: [
                    {
                        name: /^(_ga|_gid)/,
                    },
                ],
            },
            services: {
                'Google Analytics': {
                    label: 'Google Analytics',
                    cookies: [
                        {
                            name: /^_ga|_gid/,
                        },
                    ],
                },
            },
        },
        marketing: {},
    },
    language: {
        default: 'en',
        autoDetect: 'document',
        translations: {
            en: {
                consentModal: {
                    title: 'We value your privacy',
                    description:
                        'We use cookies to enhance your browsing experience, serve personalised ads or content, and analyse our traffic. By clicking "Accept All", you consent to our use of cookies. <a href="/en/privacy-policy">Cookie Policy</a>',
                    acceptAllBtn: 'Accept all',
                    acceptNecessaryBtn: 'Reject all',
                    showPreferencesBtn: 'Customize',
                },
                preferencesModal: {
                    title: 'Customise Consent Preferences',
                    acceptAllBtn: 'Accept all',
                    acceptNecessaryBtn: 'Reject all',
                    savePreferencesBtn: 'Accept current selection',
                    closeIconLabel: 'Close modal',
                    sections: [
                        {
                            description:
                                'We use cookies to help you navigate efficiently and perform certain functions. You will find detailed information about all cookies under each consent category below.',
                        },
                        {
                            title: 'Necessary cookies',
                            description:
                                'Necessary cookies are required to enable the basic features of this site, such as providing secure log-in or adjusting your consent preferences. These cookies do not store any personally identifiable data.',

                            //this field will generate a toggle linked to the 'necessary' category
                            linkedCategory: 'necessary',
                            cookieTable: {
                                caption: 'List of cookies',
                                headers: {
                                    name: 'Name',
                                    description: 'Description',
                                    duration: 'Duration',
                                },
                                body: [
                                    {
                                        name: 'cc_cookie',
                                        description: 'Store the cookie consent preferences',
                                        duration: '1 year',
                                    },
                                    {
                                        name: 'NEXT_LOCALE',
                                        description: 'Identifies the language of the user',
                                        duration: '1 year',
                                    },
                                ],
                            },
                        },
                        {
                            title: 'Performance and Analytics',
                            description:
                                'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.',
                            linkedCategory: 'analytics',
                        },
                        {
                            title: 'Marketing and Advertising',
                            description:
                                'Advertisement cookies are used to provide visitors with customised advertisements based on the pages you visited previously and to analyse the effectiveness of the ad campaigns.',
                            linkedCategory: 'marketing',
                        },
                    ],
                },
            },
            pl: {
                consentModal: {
                    title: 'Cenimy Twoją prywatność',
                    description:
                        'Używamy plików cookie, aby poprawić komfort przeglądania, wyświetlać spersonalizowane reklamy lub treści oraz analizować nasz ruch. Klikając „Akceptuj wszystko”, wyrażasz zgodę na używanie przez nas plików cookie. <a href="/pl/privacy-policy">Polityka Cookie</a>',
                    acceptAllBtn: 'Akceptuj wszystko',
                    acceptNecessaryBtn: 'Odrzuć wszystko',
                    showPreferencesBtn: 'Dostosuj',
                },
                preferencesModal: {
                    title: 'Dostosuj preferencje zgody',
                    acceptAllBtn: 'Akceptuj wszystko',
                    acceptNecessaryBtn: 'Odrzuć wszystko',
                    savePreferencesBtn: 'Akceptuj bieżący wybór',
                    closeIconLabel: 'Zamknij okno',
                    sections: [
                        {
                            description:
                                'Używamy plików cookie, aby ułatwić Ci poruszanie się i wykonywanie określonych funkcji. Szczegółowe informacje o wszystkich plikach cookie znajdziesz poniżej w każdej kategorii zgody.',
                        },
                        {
                            title: 'Niezbędne pliki cookie',
                            description:
                                'Niezbędne pliki cookie są wymagane do włączenia podstawowych funkcji tej strony, takich jak zapewnienie bezpiecznego logowania lub dostosowanie preferencji zgody. Te pliki cookie nie przechowują żadnych danych umożliwiających identyfikację osoby.',
                            linkedCategory: 'necessary',
                            cookieTable: {
                                caption: 'Lista plików cookie',
                                headers: {
                                    name: 'Nazwa',
                                    description: 'Opis',
                                    duration: 'Czas trwania',
                                },
                                body: [
                                    {
                                        name: 'cc_cookie',
                                        description: 'Przechowuje preferencje zgody na pliki cookie',
                                        duration: '1 rok',
                                    },
                                    {
                                        name: 'NEXT_LOCALE',
                                        description: 'Określa język użytkownika',
                                        duration: '1 rok',
                                    },
                                ],
                            },
                        },
                        {
                            title: 'Wydajność i analityka',
                            description:
                                'Te pliki cookie zbierają informacje o tym, jak korzystasz z naszej strony internetowej. Wszystkie dane są anonimowe i nie mogą być wykorzystane do identyfikacji użytkownika.',
                            linkedCategory: 'analytics',
                        },
                        {
                            title: 'Marketing i reklama',
                            description:
                                'Reklamowe pliki cookie są używane do wyświetlania odwiedzającym spersonalizowanych reklam na podstawie wcześniej odwiedzanych stron oraz do analizy skuteczności kampanii reklamowych.',
                            linkedCategory: 'marketing',
                        },
                    ],
                },
            },
            de: {
                consentModal: {
                    title: 'Wir schätzen Ihre Privatsphäre',
                    description:
                        'Wir verwenden Cookies, um Ihr Surferlebnis zu verbessern, personalisierte Werbung oder Inhalte bereitzustellen und unseren Datenverkehr zu analysieren. Durch Klicken auf „Alle akzeptieren“ stimmen Sie der Verwendung von Cookies zu. <a href="/en/privacy-policy">Cookie-Richtlinie</a>',
                    acceptAllBtn: 'Alle akzeptieren',
                    acceptNecessaryBtn: 'Alle ablehnen',
                    showPreferencesBtn: 'Anpassen',
                },
                preferencesModal: {
                    title: 'Einwilligungspräferenzen anpassen',
                    acceptAllBtn: 'Alle akzeptieren',
                    acceptNecessaryBtn: 'Alle ablehnen',
                    savePreferencesBtn: 'Aktuelle Auswahl akzeptieren',
                    closeIconLabel: 'Fenster schließen',
                    sections: [
                        {
                            description:
                                'Wir verwenden Cookies, um Ihnen eine effiziente Navigation zu ermöglichen und bestimmte Funktionen auszuführen. Detaillierte Informationen zu allen Cookies finden Sie in den folgenden Zustimmungskategorien.',
                        },
                        {
                            title: 'Notwendige Cookies',
                            description:
                                'Notwendige Cookies sind erforderlich, um grundlegende Funktionen dieser Website zu ermöglichen, z. B. sicheres Einloggen oder das Speichern Ihrer Einwilligungspräferenzen. Diese Cookies speichern keine personenbezogenen Daten.',
                            linkedCategory: 'necessary',
                            cookieTable: {
                                caption: 'Liste der Cookies',
                                headers: {
                                    name: 'Name',
                                    description: 'Beschreibung',
                                    duration: 'Dauer',
                                },
                                body: [
                                    {
                                        name: 'cc_cookie',
                                        description: 'Speichert die Cookie-Einwilligungspräferenzen',
                                        duration: '1 Jahr',
                                    },
                                    {
                                        name: 'NEXT_LOCALE',
                                        description: 'Identifiziert die Sprache des Benutzers',
                                        duration: '1 Jahr',
                                    },
                                ],
                            },
                        },
                        {
                            title: 'Leistung und Analyse',
                            description:
                                'Diese Cookies sammeln Informationen darüber, wie Sie unsere Website nutzen. Alle Daten sind anonymisiert und können nicht zur Identifizierung verwendet werden.',
                            linkedCategory: 'analytics',
                        },
                        {
                            title: 'Marketing und Werbung',
                            description:
                                'Werbe-Cookies werden verwendet, um Besuchern personalisierte Werbung basierend auf zuvor besuchten Seiten anzuzeigen und die Wirksamkeit von Werbekampagnen zu analysieren.',
                            linkedCategory: 'marketing',
                        },
                    ],
                },
            },
        },
    },
}
