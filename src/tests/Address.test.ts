import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import Address from "../components/Address.vue";
import { createTestingPinia } from '@pinia/testing';

const pinia = createTestingPinia({ createSpy: vi.fn }); 
const mockTFunction = () => "Translated Text";
const mockGetAddressByHouseId = vi.fn();

test("displays address label", async () => {
  const houseId = "123456";
  vi.mock("../store/addresses", () => ({
    useAddressesStore: () => ({
      getAddressByHouseId: mockGetAddressByHouseId,
    }),
  }));

  const wrapper = mount(Address, {
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

// test("opens settings page when settings button clicked", async () => {
//   const houseId = "123456";
//   const mockRouter = { push: vi.fn() };

//   const wrapper = mount(Address, {
//     props: {
//       houseId: houseId,
//     },
//     global: {
//       mocks: {
//         $t: mockTFunction,
//         $router: mockRouter,
//       },
//     },
//   });

//   await wrapper.find("button.settings-button").trigger("click");

//   expect(mockRouter.push).toHaveBeenCalledWith(`/settings/${houseId}`);
// });
