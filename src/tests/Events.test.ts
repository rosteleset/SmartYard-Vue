import Events from "@/components/Events.vue";
import { Building } from "@/types/building";
import { Client } from "@/types/user";
import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import dayjs from "dayjs";
import { expect, test, vi } from "vitest";
import { ref } from "vue";

const pinia = createTestingPinia({ createSpy: vi.fn });
const mockTFunction = (s: string) => s;

vi.mock("../store/addresses", () => ({
  useAddressesStore: () => ({
    getAddressByHouseId: () => ({} as Building),
    getClientsByHouseId: () => ref([{} as Client]),
  }),
}));
vi.mock("../hooks/locale", () => ({
  useLocale: () => ({
    localizedDayjs: { value: dayjs },
    t: mockTFunction,
  }),
}));
vi.mock("../hooks/events", () => ({
  useEvents: () => ({
    events: [],
  }),
}));

test("Component renders correctly", async () => {
  const wrapper = mount(Events, {
    props: {
      houseId: "1",
    },
    global: {
      plugins: [pinia],
      mocks: {
        $t: mockTFunction,
      },
    },
  });

  expect(wrapper.find(".events__list").exists()).toBe(true);
});
