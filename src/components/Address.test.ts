import Address from "@/components/Address.vue";
import { createTestingPinia } from "@pinia/testing";
import { mount, VueWrapper } from "@vue/test-utils";
import { expect, test, vi } from "vitest";

const mockTFunction = () => "Translated Text";
const mockGetAddressByHouseId = vi.fn();
const mockGetClientsByHouseId = vi.fn();
const mockUseEvents = vi.fn();

const pinia = createTestingPinia({ createSpy: vi.fn });

test("displays address label", async () => {
  const houseId = "123456";
  vi.mock("@/store/addresses", () => ({
    useAddressesStore: () => ({
      getAddressByHouseId: mockGetAddressByHouseId,
      getClientsByHouseId: mockGetClientsByHouseId,
    }),
  }));
  mockUseEvents.mockReturnValue([]);

  const wrapper: VueWrapper<any> = mount(Address, {
    props: {
      houseId: houseId,
    },
    global: {
      plugins: [pinia],
      mocks: {
        $t: mockTFunction,
        $router: { push: vi.fn() },
      },
    },
  });

  expect(wrapper.text()).toContain("Translated Text");
});

// test("toggles address open state when header is clicked", async () => {
//   const houseId = "123456";
//   vi.mock("../store/addresses", () => ({
//     useAddressesStore: () => ({
//       getAddressByHouseId: () => mockBuilding,
//       getClientsByHouseId: () => [mockClient],
//     }),
//   }));

//   const wrapper: VueWrapper<any> = mount(Address, {
//     props: {
//       houseId: houseId,
//     },
//     global: {
//       plugins: [pinia],
//       mocks: {
//         $t: mockTFunction,
//         $router: { push: vi.fn() },
//       },
//     },
//   });

//   // Initially isOpen should be true
//   expect(wrapper.vm.isOpen).toBe(true);

//   // Simulate header click
//   await wrapper.find(".address__header").trigger("click");

//   // After click, isOpen should be false
//   expect(wrapper.vm.isOpen).toBe(false);
// });

// test("redirects to settings page when settings button is clicked", async () => {
//   const houseId = "123456";
//   vi.mock("../store/addresses", () => ({
//     useAddressesStore: () => ({
//       getAddressByHouseId: mockGetAddressByHouseId,
//       getClientsByHouseId:mockGetClientsByHouseId
//     }),
//   }));

//   const routerPushMock = vi.fn();
//   const wrapper: VueWrapper<any> = mount(Address, {
//     props: {
//       houseId: houseId,
//     },
//     global: {
//       plugins: [pinia],
//       mocks: {
//         $t: mockTFunction,
//         $router: { push: routerPushMock },
//       },
//     },
//   });

//   // Simulate settings button click
//   await wrapper.find("button.settings-button").trigger("click");

//   // Expect router push to be called with correct path
//   expect(routerPushMock).toHaveBeenCalledWith(`/settings/${houseId}`);
// });

// test("does not display address content when building is not found", async () => {
//   const houseId = "123456";
//   vi.mock("../store/addresses", () => ({
//     useAddressesStore: () => ({
//       getAddressByHouseId: mockGetAddressByHouseId,
//       getClientsByHouseId:mockGetClientsByHouseId
//     }),
//   }));

//   const wrapper: VueWrapper<any> = mount(Address, {
//     props: {
//       houseId: houseId,
//     },
//     global: {
//       plugins: [pinia],
//       mocks: {
//         $t: mockTFunction,
//         $router: { push: vi.fn() },
//       },
//     },
//   });

//   // Expect global error message to be displayed
//   expect(wrapper.text()).toContain("addresses.not-found");

//   // Expect address content not to be rendered
//   expect(wrapper.find(".address__doors").exists()).toBe(false);
//   expect(wrapper.findComponent(Cameras).exists()).toBe(false);
//   expect(wrapper.findComponent(Events).exists()).toBe(false);
// });
