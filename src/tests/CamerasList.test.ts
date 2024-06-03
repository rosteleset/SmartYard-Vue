import {mount, VueWrapper} from '@vue/test-utils';
import {ComponentPublicInstance} from 'vue';
import {beforeEach, describe, expect, it} from 'vitest';
import CamerasList from '@/components/CamerasList.vue';
import VideoCard from '@/components/VideoCard.vue';
import {Camera} from '@/types/camera';
import {defaultGlobal, mockCamera} from "@/tests/__mocks.ts";

type TestWrapper<T> = VueWrapper<ComponentPublicInstance & T>

const mockCameras: Camera[] = [
    mockCamera
];

describe('CamerasList', () => {
    let wrapper: TestWrapper<Partial<typeof CamerasList>>

    beforeEach(() => {
        wrapper = mount(CamerasList, {
            props: {
                cameras: mockCameras,
            },
            global: defaultGlobal
        });
    });

    it('renders a list of cameras', () => {
        const videoComponents = wrapper.findAllComponents(VideoCard);
        expect(videoComponents).toHaveLength(mockCameras.length);
        videoComponents.forEach((videoWrapper, index) => {
            expect(videoWrapper.props('camera')).toEqual(mockCameras[index]);
            expect(videoWrapper.props('index')).toBe(index + 1);
        });
    });

    it('applies correct grid layout based on config', () => {
        const camerasListElement = wrapper.find('.cameras__list');
        expect(camerasListElement.exists()).toBe(true);

        // Check the number of columns based on the computed value
        const computedColumns = wrapper.vm.columns;
        const expectedColumns = 4;
        expect(computedColumns).toBe(expectedColumns);
    });
});
