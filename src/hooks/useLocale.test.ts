import {describe, expect, it, Mock, vi} from "vitest";
import useLocale from "@/hooks/useLocale.ts";
import {useI18n} from "vue-i18n";
import {ref} from "vue";
import {LOCAL_STORAGE_KEY} from "@/i18n.ts";

vi.mock("vue-i18n")

describe("useLocale", () => {

    it('should return correct values', () => {
        // Мокаем useI18n чтобы возвращала локаль 'en'
        (useI18n as Mock).mockReturnValue({
            locale: ref('en'),
        })
        const {localizedDayjs} = useLocale();
        const date = new Date(2020, 0, 1);
        const localizedDate = localizedDayjs.value(date);

        // Проверяем, что локализованная дата имеет локаль 'en'
        expect(localizedDate.locale()).toBe('en');
    });

    it('should change locale', () => {
        // Используем useLocale и изменяем локаль на 'ru'
        const {locale, changeLocale} = useLocale();
        changeLocale('ru');

        // Проверяем, что локаль изменена на 'ru' и сохранена в localStorage
        expect(locale.value).toBe('ru');
        expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBe('ru')
    });
})
