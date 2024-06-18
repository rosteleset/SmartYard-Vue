import {beforeEach, describe, expect, it, vi} from "vitest";
import {mount} from "@vue/test-utils";
import AddressSettings from "@/components/AddressSettings.vue";
import NotFound from "@/components/NotFound.vue";
import {useAddressesStore} from "@/store/addresses";
import useLocale from "@/hooks/useLocale";
import {defaultGlobal, mockTFunction} from "@/mocks/__mockedGlobal.ts";
import {ref} from "vue";
import TestWrapper from "@/mocks/TestWrapper.ts";

// Mocking useAddressesStore
vi.mock("@/store/addresses", () => ({
    useAddressesStore: vi.fn()
}));

// Mocking useLocale
vi.mock("@/hooks/useLocale", () => ({
    default: vi.fn()
}));

vi.mock("@/components/FlatSettings.vue")
vi.mock("@/components/Tabs.vue")
vi.mock("@/components/NotFound.vue")

describe("AddressSettings", () => {
    const mockGetAddressByHouseId = vi.fn();
    const mockGetClientsByHouseId = vi.fn();

    beforeEach(() => {
        (useAddressesStore as any).mockReturnValue({
            getAddressByHouseId: mockGetAddressByHouseId,
            getClientsByHouseId: mockGetClientsByHouseId
        });
        (useLocale as any).mockReturnValue({t: mockTFunction});
    });

    it("renders the component with address and clients", async () => {
        const houseId = "1";
        const address = {address: "123 Main St"};
        const clients = [
            {flatId: "101", flatNumber: "101"},
            {flatId: "102", flatNumber: "102"}
        ];

        mockGetAddressByHouseId.mockReturnValue(ref(address));
        mockGetClientsByHouseId.mockReturnValue(ref(clients));

        const wrapper = mount(AddressSettings, {
            props: {houseId},
            global: defaultGlobal
        });


        expect(wrapper.find(".label").text()).toBe(address.address);
        const tabs = wrapper.findComponent({name: "Tabs"})
        expect(tabs.exists()).toBe(true);
        expect(tabs.props('tabs').length).toBe(clients.length);
    });

    it("renders NotFound when no address or clients", async () => {
        const houseId = "1";

        mockGetAddressByHouseId.mockReturnValue(null);
        mockGetClientsByHouseId.mockReturnValue({value: []});

        const wrapper = mount(AddressSettings, {
            props: {houseId},
            global: defaultGlobal
        });

        expect(wrapper.findComponent(NotFound).exists()).toBe(true);
    });

    it("computes clientsWithTitles correctly", async () => {
        const houseId = "1";
        const clients = [
            {flatId: "101", flatNumber: "101"},
            {flatId: "102", flatNumber: "102"}
        ];

        mockGetClientsByHouseId.mockReturnValue({value: clients});

        const wrapper: TestWrapper<Partial<typeof AddressSettings>> = mount(AddressSettings, {
            props: {houseId},
            global: defaultGlobal
        });

        const computedClients = wrapper.vm.clientsWithTitles;
        expect(computedClients).toEqual(clients.map(client => ({
            tabId: client.flatId,
            tabTitle: `Translated addresses.flat`
        })));
    });
});
