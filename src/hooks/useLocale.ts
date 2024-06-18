import dayjs, {Dayjs} from "dayjs";
import {computed} from "vue";
import {useI18n} from "vue-i18n";
import {LOCAL_STORAGE_KEY} from "../i18n";

const useLocale = () => {
  const { locale, availableLocales, t } = useI18n();

  const localizedDayjs = computed(() => {
    return (date?: string | number | Date | Dayjs) => {
      return dayjs(date).locale(locale.value);
    };
  });

  const changeLocale = (value: string) => {
    locale.value = value;
    localStorage.setItem(LOCAL_STORAGE_KEY, value);
  };

  return {
    locale,
    changeLocale,
    availableLocales,
    t,
    localizedDayjs,
  };
};

export default useLocale