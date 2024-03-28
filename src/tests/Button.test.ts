import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import Button from "@/components/Button.vue";

test("рендерит кнопку с правильными классами и свойствами", async () => {
  const wrapper = mount(Button, {
    props: {
      variant: "primary",
      bordered: true,
      disabled: false,
    },
    slots: {
      default: "Нажми меня",
    },
  });

  // Проверяем, имеет ли кнопка правильные классы
  expect(wrapper.classes()).toContain("button");
  expect(wrapper.classes()).toContain("button-bordered");
  expect(wrapper.classes()).toContain("button-primary");

  // Проверяем, имеет ли кнопка правильный текст
  expect(wrapper.text()).toContain("Нажми меня");

  // Проверяем, не отключена ли кнопка
  expect(wrapper.attributes("disabled")).toBeFalsy();
});

test("эмитирует событие клика при нажатии на кнопку", async () => {
  const wrapper = mount(Button, {
    props: {
      variant: "primary",
    },
    slots: {
      default: "Нажми меня",
    },
    global: {
      plugins: [],
    },
  });

  // Симулируем клик по кнопке
  await wrapper.find(".button").trigger("click");

  // Ожидаем, что будет эмитировано событие клика
  expect(wrapper.emitted().click).toBeTruthy();
});
