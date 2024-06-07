import {beforeEach, describe, expect, it, vi} from "vitest";
import {ComponentPublicInstance, defineComponent, h} from "vue";
import useEvents from "@/hooks/useEvents.ts";
import useFaces from "@/hooks/useFaces.ts";
import {mount, VueWrapper} from "@vue/test-utils";
import useApi from "@/hooks/useApi.ts";

vi.mock('./useApi');

const mockGet = vi.fn().mockReturnValue(Promise.resolve({data: []}));

type TestWrapper<T> = VueWrapper<ComponentPublicInstance & T>

const TestComponent = defineComponent({
    props: {
        flatId: String
    },
    setup(props) {
        return useFaces(props.flatId);
    },
    render() {
        return h('div');
    }
});

describe('useFaces', () => {
    let wrapper: TestWrapper<Partial<typeof TestComponent>>;

    beforeEach(() => {
        (useApi as any).mockReturnValue({
            get: mockGet
        });

        wrapper = mount(TestComponent, {
            props: {
                flatId: 'flat1'
            }
        })
    })

    it('useFaces initializes with empty array of faces', () => {
        expect(wrapper)
    })
})