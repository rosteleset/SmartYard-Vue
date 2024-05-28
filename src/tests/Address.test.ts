import Address from "@/components/Address.vue";
import {createTestingPinia} from "@pinia/testing";
import {mount, VueWrapper} from "@vue/test-utils";
import {expect, test, vi} from "vitest";
import {Building} from "@/types/building.ts";

const mockTFunction = () => "Translated Text";
const mockUseEvents = vi.fn();

const pinia = createTestingPinia({createSpy: vi.fn});

test("displays address label", async () => {
    const houseId = "123456";

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
    console.log(wrapper.text())
    expect(wrapper.text()).toContain("Translated Text");
});
