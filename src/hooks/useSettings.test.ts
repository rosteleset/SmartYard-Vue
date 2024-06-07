import {beforeEach, describe, expect, it, Mock, vi} from "vitest";
import useSettings from "@/hooks/useSettings.ts";
import useApi from "@/hooks/useApi.ts";
import {flushPromises, mount} from "@vue/test-utils";
import {mockSettings} from "@/mocks/Settings.ts";

vi.mock('@/hooks/useApi.ts');

const mockGet = vi.fn();


describe("useSettings", () => {
    const mockFlatId = "123";

    const TestComponent = {
        setup() {
            return useSettings(mockFlatId);
        },
        render() {
            return null;
        }
    };

    beforeEach(() => {
        mockGet.mockReset();
        (useApi as Mock).mockReturnValue({
            get: mockGet,
        });
    });

    it('should load settings on mount', async () => {
        // Мокаем ответ get для загрузки настроек
        mockGet.mockResolvedValue(mockSettings[0]);


        // Монтируем компонент и проверяем, что настройки загружены
        const wrapper = mount(TestComponent);
        await flushPromises();

        expect(mockGet).toHaveBeenCalledWith("address/intercom", {flatId: mockFlatId});
        expect(wrapper.vm.settings).toEqual(mockSettings[0]);
    });

    it('should load settings when load is called', async () => {
        // Мокаем ответ get для загрузки настроек
        mockGet.mockResolvedValue(mockSettings[0]);

        const {load, settings} = useSettings(mockFlatId);
        load();
        await flushPromises();

        // Проверяем, что настройки загружены при вызове load
        expect(mockGet).toHaveBeenCalledWith("address/intercom", {flatId: mockFlatId});
        expect(settings.value).toEqual(mockSettings[0]);
    });

    it('should save updated settings', async () => {
        const updatedSettings = mockSettings[1];
        mockGet.mockResolvedValue(updatedSettings);

        const {save, settings} = useSettings(mockFlatId);
        save(updatedSettings);
        await flushPromises();

        // Проверяем, что настройки сохранены и обновлены
        expect(mockGet).toHaveBeenCalledWith("address/intercom", {flatId: mockFlatId, settings: updatedSettings});
        expect(settings.value).toEqual(updatedSettings);
    });
});
