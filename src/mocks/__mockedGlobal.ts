import {vi} from "vitest";
import {createTestingPinia} from "@pinia/testing";
import {defineComponent} from "vue";

const pinia = createTestingPinia({createSpy: vi.fn});

export const mockTFunction = (text: string) => `Translated ${text}`;

export const FakeComponent = defineComponent({
    template: '<div><slot /></div>'
})

export const FakeTransition = defineComponent({
    emits: ['afterEnter', 'enter'],
    template: '<div><slot /></div>',
    setup(_, {emit}) {
        return {
            emitAfterEnter() {
                emit('afterEnter')
            },
            emitEnter() {
                emit('enter')
            }
        }
    },
})

export const defaultGlobal = {
    plugins: [pinia],
    mocks: {
        $t: mockTFunction,
        $router: {push: vi.fn()},
    },
    stubs: {
        transition: FakeTransition,
        teleport: true,
    },
}