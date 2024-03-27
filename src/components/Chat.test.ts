import { mount } from "@vue/test-utils";
import { test, expect, vi } from "vitest";
import Chat from "@/components/Chat.vue";
// Создаем фиктивные моки и стабы
const mockGet = vi.fn(() =>
  Promise.resolve({ code: "<p>Текст входящего сообщения</p>" })
);
vi.mock("@/hooks/useApi", () => ({
  useApi: () => ({
    get: mockGet,
  }),
}));

test("отображает полученные данные из API", async () => {
  // Монтируем компонент InboxComponent с моками
  const wrapper = mount(Chat, {});

  // Ожидаем, что компонент пока не отобразил входящие сообщения
  expect(wrapper.html()).not.toContain("Текст входящего сообщения");

  // Ждем завершения всех асинхронных операций
  await flushPromises();

  // Переименованный метод flushPromises, он ждет завершения всех асинхронных операций
  function flushPromises() {
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  // Ожидаем, что компонент отобразит полученные данные
  expect(wrapper.html()).toContain("Текст входящего сообщения");

});
