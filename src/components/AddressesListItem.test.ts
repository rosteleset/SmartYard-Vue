import {beforeEach, describe, expect, it, vi} from "vitest";
import {mount} from "@vue/test-utils";
import Address from "@/components/Address.vue"; // Предполагается, что компонент Address существует и импортируется правильно
import AddressesListItem from "@/components/AddressesListItem.vue";
import {useRouter} from "vue-router";
import {mockBuildings} from "@/mocks/Building.ts";
import TestWrapper from "@/mocks/TestWrapper.ts";
import {defaultGlobal} from "@/mocks/__mockedGlobal.ts";

// Создаем mock для useRouter
vi.mock("vue-router");
vi.mock('@/components/Address.vue')

describe("AddressesListItem", () => {
    let wrapper: TestWrapper<Partial<typeof AddressesListItem>>
    let routerMock;
    const building = mockBuildings[0]

    beforeEach(() => {
        routerMock = {
            push: vi.fn()
        };
        (useRouter as any).mockReturnValue(routerMock);
        wrapper = mount(AddressesListItem, {
            props: {building},
            global: defaultGlobal
        });
    });

    it("renders the component", () => {


        expect(wrapper.find(".address__label").text()).toBe(building.address);
        expect(wrapper.findComponent(Address).exists()).toBe(true);
    });

    it("toggles content visibility on click", async () => {

        const arrowButton = wrapper.find(".address__more");

        expect(wrapper.findComponent(Address).exists()).toBe(true);

        await arrowButton.trigger("click");

        expect(wrapper.findComponent(Address).exists()).toBe(false);

        await arrowButton.trigger("click");

        expect(wrapper.findComponent(Address).exists()).toBe(true);
    });

    it("navigates to settings on settings button click", async () => {

        const settingsButton = wrapper.findAll("button").at(0);
        await settingsButton?.trigger("click");
        expect(routerMock.push).toHaveBeenCalledWith(`/settings/${building.houseId}`);
    });
});
