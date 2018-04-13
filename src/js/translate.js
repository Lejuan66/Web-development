/*
 * File: translate.js
 * Brief: Translation engine. every object in DOM with attribute "data-translation=[label]"
 *        is looked up in translations.js and generated depending on defualt or chosen language
 */

class Translate {
    /*
     * Constructor
     */
    constructor() {
        this.translations = window.translations;
        this.currentLang = "";
        if (!this.hasSavedLang()) {
            this.detect();
        }
    }

    /*
     * Detect browser language, defualt language is set to english if
     * no other browser language matches
     */
    detect() {
        var navlang = window.navigator.language;
        if (navlang.search("zh") >= 0) {
            this.change("zh"); //Chineese
        } else if (navlang.search("sv") >= 0) {
            this.change("sv");
        }
        else {
            this.change("en");
        }
    }

    /*
     * Check if language preference is stored
     */
    hasSavedLang() {
        if (window.localStorage.hasOwnProperty("myLanguage")) {
            this.change(window.localStorage.getItem("myLanguage"));
            return true;
        }
        return false;
    }

    /*
     * Change language preference
     */
    change(lang) {
        localStorage.setItem("myLanguage", lang)
        this.currentLang = lang;
        this.translate();
    }

    /*
     * Translate DOM with data-translation attributes
     */
    translate() {
        var parent = this;
        $("[data-translation]").each(function(i) {
            var label = $(this).data("translation");
            var str = "TRANSLATION_MISSING";
            if (parent.translations.hasOwnProperty(label) && parent.translations[label].hasOwnProperty(parent.currentLang)) {
                str =  parent.translations[label][parent.currentLang];
            }
            $(this).text(str);
            if (str == "TRANSLATION_MISSING") {
                console.warn("Missing label: " + label);
            }
        });

    }

    /*
     * Lookup translations of label from translations.js
     */
    t(label) {
        if (this.translations.hasOwnProperty(label) && this.translations[label].hasOwnProperty(this.currentLang)) {
            return this.translations[label][this.currentLang];
        }
        console.warn("Missing label: " + label);
        return "TRANSLATION_MISSING";
    }
}
