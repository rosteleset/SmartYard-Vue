import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { ComponentPublicInstance, defineComponent, h, ref } from "vue";
import useZoom from "@/hooks/useZoom.ts";
import { flushPromises, mount, VueWrapper } from "@vue/test-utils";

type TestWrapper<T> = VueWrapper<ComponentPublicInstance & T>;

const mockVideoElement = ref<HTMLVideoElement | null>(null);

const TestComponent = defineComponent({
    setup() {
        return useZoom(mockVideoElement);
    },
    render() {
        return h('video', { style: { width: '640px', height: '480px' } });
    }
});

describe("useZoom", () => {
    let wrapper: TestWrapper<Partial<typeof TestComponent>>;
    let container: HTMLDivElement;

    // Инициализация контейнера и монтирование компонента перед каждым тестом
    beforeEach(async () => {
        container = document.createElement('div');
        document.body.appendChild(container);

        wrapper = mount(TestComponent, {
            attachTo: container
        });

        await flushPromises();

        // Инициализация mockVideoElement
        mockVideoElement.value = wrapper.find('video').element as HTMLVideoElement;
        await flushPromises();
    });

    // Очистка после каждого теста
    afterEach(() => {
        wrapper.unmount();
        document.body.removeChild(container);
    });

    // Проверка начальных значений
    it("should set initial values correctly", () => {
        expect(wrapper.vm.onDrag).toBe(false);
        expect(wrapper.vm.scale).toBe(1);
        expect(wrapper.vm.videoStyles).toEqual({ transformOrigin: '0% 0%', transform: 'scale(1)' });
    });

    // Проверка обработки события прокрутки
    it("should handle scroll event correctly", async () => {
        const scrollEvent = new WheelEvent("wheel", { deltaY: -1 });
        mockVideoElement.value?.dispatchEvent(scrollEvent);
        await flushPromises();

        expect(wrapper.vm.scale).toBeGreaterThan(1);
        expect(wrapper.vm.videoStyles.transform).toBe(`scale(${wrapper.vm.scale})`);
    });

    // Проверка обработки событий перетаскивания
    it("should handle drag events correctly", async () => {
        wrapper.vm.scale = 2;
        const mouseDownEvent = new MouseEvent("mousedown", {
            clientX: 20,
            clientY: 20
        });
        mockVideoElement.value?.dispatchEvent(mouseDownEvent);
        await flushPromises();

        const dragEvent = new MouseEvent("mousemove", {
            clientX: 25,
            clientY: 15
        });
        document.dispatchEvent(dragEvent);
        await flushPromises();

        await new Promise(resolve => setTimeout(resolve, 600));

        expect(wrapper.vm.onDrag).toBe(true);
        expect(wrapper.vm.videoStyles).not.toEqual({ transformOrigin: '0% 0%', transform: 'scale(2)' });
    });

    // Проверка остановки перетаскивания после события mouseup
    it("should stop drag after mouseup event", async () => {
        const mouseDownEvent = new MouseEvent("mousedown", {
            clientX: 20,
            clientY: 20
        });
        mockVideoElement.value?.dispatchEvent(mouseDownEvent);
        await flushPromises();

        const dragEvent = new MouseEvent("mousemove", {
            clientX: 25,
            clientY: 15
        });
        document.dispatchEvent(dragEvent);
        await flushPromises();

        const mouseUpEvent = new MouseEvent("mouseup");
        document.dispatchEvent(mouseUpEvent);
        await flushPromises();

        await new Promise(resolve => setTimeout(resolve, 600));

        expect(wrapper.vm.onDrag).toBe(false);
    });
});
