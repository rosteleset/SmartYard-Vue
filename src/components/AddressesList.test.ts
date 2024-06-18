import {beforeEach, describe, expect, it, vi} from "vitest";
import {mount} from "@vue/test-utils";
import AddressesList from "@/components/AddressesList.vue";
import AddressesListItem from "@/components/AddressesListItem.vue";
import {useAddressesStore} from "@/store/addresses";
import TestWrapper from "@/mocks/TestWrapper.ts";
import {defaultGlobal} from "@/mocks/__mockedGlobal.ts";
import {mockBuildings} from "@/mocks/Building.ts";

// Мокаем хранилище адресов
vi.mock('@/components/AddressesListItem.vue')
vi.mock("@/store/addresses");

describe("AddressesList", () => {
    let wrapper: TestWrapper<Partial<typeof AddressesList>>
    // const addressesStore = __mockedStore(useAddressesStore);
    beforeEach(() => {
        // Устанавливаем мок для хранилища адресов
        (useAddressesStore as any).mockReturnValue({
            addresses: mockBuildings
        })

        // Монтируем компонент
        wrapper = mount(AddressesList, {
            global: defaultGlobal
        });
    });

    it("renders AddressesListItem for each address", () => {
        // Ищем все компоненты AddressesListItem
        const items = wrapper.findAllComponents(AddressesListItem);

        // Проверяем, что количество элементов списка соответствует количеству адресов в хранилище
        expect(items.length).toBe(2); // Здесь установите нужное количество адресов

        // Проверяем, что каждый компонент AddressesListItem получает правильное свойство building
        expect(items[0].props("building")).toEqual(mockBuildings[0]);
        expect(items[1].props("building")).toEqual(mockBuildings[1]);
        // Добавьте здесь дополнительные проверки, если это необходимо
    });
});
