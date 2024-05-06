import Address from "@/components/Address.vue";
import {createTestingPinia} from "@pinia/testing";
import {mount, VueWrapper} from "@vue/test-utils";
import {expect, test, vi} from "vitest";
import {Building} from "@/types/building.ts";

const mockTFunction = () => "Translated Text";
const mockGetAddressByHouseId = vi.fn();
const mockGetClientsByHouseId = vi.fn();
const mockUseEvents = vi.fn();

const pinia = createTestingPinia({createSpy: vi.fn});

test("displays address label", async () => {
    const houseId = "123456";
    vi.mock("@/store/addresses", () => ({
        useAddressesStore: () => ({
            getAddressByHouseId: mockGetAddressByHouseId,
            getClientsByHouseId: mockGetClientsByHouseId,
        }),
    }));
    vi.mock("@/hooks/useCameras", () => {
        return {
            default: () => ({cameras: []})
        };
    })
    mockUseEvents.mockReturnValue([]);

    const wrapper: VueWrapper<any> = mount(Address, {
        props: {
            building: {houseId} as Building,
        },
        global: {
            plugins: [pinia],
            mocks: {
                $t: mockTFunction,
                $router: {push: vi.fn()},
            },
        },
    });

    expect(wrapper.text()).toContain("Translated Text");
});
