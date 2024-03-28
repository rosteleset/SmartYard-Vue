import { test, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import DoorComponent from "@/components/Door.vue";
import { Domophone } from "@/types/domophone";
import { createTestingPinia } from "@pinia/testing";

// Подготовка данных для теста
const mockDomophone: Domophone = {
  domophoneId: 1,
  doorId: 1,
  icon: "entrance",
  name: "Главный вход",
  blocked: "2024-03-30",
  dst: "2024-03-29",
};

const mockTFunction = () => "Translated Text";
const pinia = createTestingPinia({ createSpy: vi.fn });

test("отображает название домофона", async () => {
  // Монтируем компонент
  const wrapper = mount(DoorComponent, {
    props: {
      data: mockDomophone,
    },
    plugins: [pinia],
    global: {
      mocks: {
        $t: mockTFunction,
      },
    },
  });

  // Проверяем, что компонент отображает правильное название домофона
  expect(wrapper.text()).toContain("Главный вход");
});

test("вызывает функцию открытия двери при нажатии на кнопку", async () => {
  const mockOpenDoor = vi.hoisted(()=>vi.fn())
  // Мокаем функцию открытия двери
  vi.mock("../api/openDoor", () => ({
    default: mockOpenDoor,
  }));
  // Монтируем компонент
  const wrapper = mount(DoorComponent, {
    props: {
      data: mockDomophone,
    },
    plugins: [pinia],
    global: {
      mocks: {
        $t: mockTFunction,
      },
    },
  });

  // Нажимаем на кнопку
  await wrapper.find("button").trigger("click");

  // Проверяем, что функция открытия двери была вызвана с правильными аргументами
  expect(mockOpenDoor).toHaveBeenCalledWith(mockDomophone.domophoneId);
});
