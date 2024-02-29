import { createI18n } from "vue-i18n"
import en from './locales/en.json'
import ru from './locales/ru.json'


const messages = {
    en: en,
    ru: ru
}

// Создаем экземпляр i18n без установки начальной локали
const i18n = createI18n({
    legacy: false,
    fallbackLocale:'ru',
    locale: 'ru',
    messages,
});

export default i18n