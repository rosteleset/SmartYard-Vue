import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import ru from "./locales/ru.json";

const DEFAULT_LOCALE = import.meta.env.VITE_DEFAULT_LOCALE;

const messages = {
  en: en,
  ru: ru,
};

// Создаем экземпляр i18n
const i18n = createI18n({
  legacy: false,
  fallbackLocale: DEFAULT_LOCALE,
  locale: DEFAULT_LOCALE,
  messages,
});

export default i18n;
