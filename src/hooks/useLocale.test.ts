import {describe, expect, it, Mock, vi} from "vitest";
import useLocale from "@/hooks/useLocale.ts";
import {useI18n} from "vue-i18n";
import {ref} from "vue";
import {LOCAL_STORAGE_KEY} from "@/i18n.ts";

vi.mock("vue-i18n")

describe("useLocale", () => {

    it('должен возвращать правильные значения', () => {
        (useI18n as Mock).mockReturnValue({
            locale: ref('en'),
        })
        const {localizedDayjs} = useLocale();
        const date = new Date(2020, 0, 1);
        const localizedDate = localizedDayjs.value(date);

        expect(localizedDate.locale()).toBe('en');
    });

    it('должен изменять локаль', () => {
        const {locale, changeLocale} = useLocale();
        changeLocale('fr');

        expect(locale.value).toBe('fr');
        expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBe('fr')
    });
})