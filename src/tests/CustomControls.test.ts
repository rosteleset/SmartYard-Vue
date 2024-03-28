import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";
import CustomControls from "../components/CustomControls.vue";

test("воспроизводит видео при нажатии на кнопку Play", async () => {
  // Создаем фиктивный элемент видео
  const videoElement = document.createElement("video");

  // Создаем компонент VideoControls и монтируем его
  const wrapper = mount(CustomControls, {
    props: {
      videoElement: videoElement,
      range: {
        date: new Date(),
        streamUrl: "test",
        from: 100,
        duration: 100,
      },
    },
  });

  // Симулируем клик на кнопку Play
  await wrapper.find(".button").trigger("click");

  // Ожидаем, что компонент VideoControls эмитирует событие "pause"
  expect(wrapper.emitted().pause).toBeTruthy();
});

test("перемотка видео при изменении положения ползунка", async () => {
  // Создаем фиктивный элемент видео
  const videoElement = document.createElement("video");

  // Создаем компонент VideoControls и монтируем его
  const wrapper = mount(CustomControls, {
    props: {
      videoElement: videoElement,
      range: {
        date: new Date(),
        streamUrl: "test",
        from: 100,
        duration: 100,
      },
    },
  });

  // Имитируем перемещение ползунка
  await wrapper.find(".custom-slider").setValue(50);

  // Ожидаем, что текущее время видео изменится
  expect(videoElement.currentTime).toBe(50);
});
