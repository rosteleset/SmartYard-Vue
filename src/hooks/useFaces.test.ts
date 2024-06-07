import {beforeEach, describe, expect, it, vi} from "vitest";
import {defineComponent, h} from "vue";
import useFaces from "@/hooks/useFaces.ts";
import {flushPromises, mount} from "@vue/test-utils";
import useApi from "@/hooks/useApi.ts";
import {mockFaces} from "@/mocks/Faces.ts";

vi.mock('./useApi');

const mockGet = vi.fn().mockImplementation((flatId?: string) => {
    if (flatId !== undefined)
        return Promise.resolve(mockFaces)
    else
        return Promise.resolve([])
});

const mockRequest = vi.fn()

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

    beforeEach(() => {
        (useApi as any).mockReturnValue({
            get: mockGet,
            request: mockRequest
        });
    })

    it('useFaces initializes with empty array of faces', async () => {
        const wrapper = mount(TestComponent)
        expect(wrapper.vm.faces).toHaveLength(0)
        await flushPromises();
        expect(wrapper.vm.faces).toHaveLength(0)
    })

    // Загрузка лиц при предоставлении flatId
    it('useFaces loads faces when flatId is provided', async () => {
        const wrapper = mount(TestComponent, {
            props: {
                flatId: 'flat1'
            }
        })
        await flushPromises();

        expect(wrapper.vm.faces).toEqual(mockFaces);
    });

    // Добавление нового лица
    it('useFaces adds a new face', async () => {
        mockRequest.mockResolvedValue({faceId: 'newFace'});
        const wrapper = mount(TestComponent);
        await flushPromises();

        expect(await wrapper.vm.add('event1', 'test')).toEqual('newFace');
        expect(mockRequest).toHaveBeenCalledWith('frs/like', {event: 'event1', comment: 'test'});
    });

    // Удаление лица
    it('useFaces removes a face', async () => {
        const wrapper = mount(TestComponent, {
            props: {
                flatId: 'flat1'
            }
        })
        await flushPromises();

        await wrapper.vm.remove({event: 'event1', faceId: 'face1', flatId: 'flat1'})

        expect(mockRequest).toHaveBeenCalledWith('frs/disLike', {
            event: 'event1',
            flatId: 'flat1',
            faceId: 'face1'
        });
    });
})