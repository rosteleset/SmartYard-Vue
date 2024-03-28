import ModalComponent from "@/components/Modal.vue";
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// beforeEach(() => {
//   // create teleport target
//   const el = document.createElement("div");
//   el.id = "modal";

//   document.appendChild(el);
// });

// afterEach(() => {
//   // clean up
//   document.body.outerHTML = "";
// });

test("отображает модальное окно при открытии", async () => {
  // Монтируем компонент с isOpen = true
  const wrapper = mount(ModalComponent, {
    props: {
      isOpen: true,
    },
    global: {
      stubs: {
        teleport: true,
      },
    },
  });

  // Проверяем, что модальное окно отображается
  expect(wrapper.html()).toContain("modal__overlay");
});

