import { defineStore } from 'pinia';
import dayjs, { Dayjs } from 'dayjs';
import { computed, ref } from 'vue';

type Locale = 'ru' | 'en'

export const useLocaleStore = defineStore('locale', () => {
    const locale = ref<Locale>('ru')

    const localizedDayjs = computed(() => {
        return (date?: string | number | Date | Dayjs) => {
            return dayjs(date).locale(locale.value);
        };
    });

    const changeLocale = (newLocale: Locale) => {
        locale.value = newLocale;
        dayjs.locale(newLocale);
    }

    return {
        locale,
        changeLocale,
        localizedDayjs
    }
});

