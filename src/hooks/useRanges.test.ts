import {beforeEach, describe, expect, it, Mock, vi} from "vitest";
import {defineComponent, h, PropType} from "vue";
import {Camera} from "@/types/camera.ts";
import useRanges from "@/hooks/useRanges.ts";
import {flushPromises, mount} from "@vue/test-utils";
import {mockCameras} from "@/mocks/Cameras.ts";
import useApi from "@/hooks/useApi.ts";
import {mockStreams} from "@/mocks/Streams.ts";
import axios from "axios";

vi.mock('./useApi');
vi.mock('axios')

const mockCamera = mockCameras[0]
const TestComponent = defineComponent({
    props: {
        camera: {
            type: Object as PropType<Camera>,
            required: true,
        }
    },
    setup(props) {
        return useRanges(props.camera);
    },
    render() {
        return h('div');
    }
});
const mockGet = vi.fn().mockImplementation(async (path: string, params?: any) => {
    if (path && params['cameraId'] === mockCamera.id)
        return mockStreams
    else
        return []
})

describe('useRanges', () => {

    (useApi as Mock).mockReturnValue({
        get: mockGet,
    });
    (axios.get as Mock).mockResolvedValue({data: {"119002": {"from": 1622530800, "to": 1622532600}}});

    beforeEach(() => {
        // Код, который выполняется перед каждым тестом
    })

    it('Initialization and return correct values', async () => {
        // Тест на проверку инициализации и возврата правильных значений
        const wrapper = mount(TestComponent, {
            props: {
                camera: mockCameras[1]
            }
        })
        await flushPromises();
        expect(wrapper.vm.streams).toHaveLength(0);
    })

    it('Correctness of getRbtRanges function on successful request', async () => {
        // Тест на корректность работы функции getRbtRanges при успешном запросе
        const wrapper = mount(TestComponent, {
            props: {
                camera: mockCamera
            }
        })
        await flushPromises();
        expect(wrapper.vm.streams).toEqual(mockStreams);
        expect(mockGet).toHaveBeenCalledWith('cctv/ranges', {cameraId: mockCamera.id});
    });

    it('Correctness of getDmRanges function on successful request', async () => {
        // Тест на корректность работы функции getDmRanges при успешном запросе
        const wrapper = mount(TestComponent, {
            props: {
                camera: mockCameras[4]
            }
        })
        expect(axios.get).toHaveBeenCalledWith(`${mockCameras[4].url}/recording_status.json`)
        await flushPromises();

        expect(wrapper.vm.streams).toEqual([mockStreams[1]]);
    })
})
