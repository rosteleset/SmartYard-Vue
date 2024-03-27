import { test, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import DoorComponent from "@/components/Door.vue";
import { Domophone } from "@/types/domophone";
import { mockOpenDoor } from "@/tests/mocks";

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

test("отображает название домофона", async () => {
  // Монтируем компонент
  const wrapper = mount(DoorComponent, {
    props: {
      data: mockDomophone,
    },
    global: {
      mocks: {
        $t: mockTFunction,
      },
    },
  });

  // Проверяем, что компонент отображает правильное название домофона
  expect(wrapper.text()).toContain("Главный вход");
});

// test("вызывает функцию открытия двери при нажатии на кнопку", async () => {
  
//   // Монтируем компонент
//   const wrapper = mount(DoorComponent, {
//     props: {
//       data: mockDomophone,
//     },
//     global: {
//       mocks: {
//         $t: mockTFunction,
//       },
//     },
//   });

//   // Нажимаем на кнопку
//   await wrapper.find("button").trigger("click");

//   // Проверяем, что функция открытия двери была вызвана с правильными аргументами
//   expect(mockOpenDoor).toHaveBeenCalledWith(mockDomophone.domophoneId);
// });
