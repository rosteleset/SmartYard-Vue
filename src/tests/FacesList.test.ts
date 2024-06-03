import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import FacesList from '@/components/FacesList.vue';
import FacesListItem from '@/components/FacesListItem.vue';
import { Face } from '@/types/faces';

describe('FacesList', () => {
    it('renders a list of FacesListItem components with provided faces', () => {
        const faces: Face[] = [
            { faceId: '1', image: 'http://example.com/image1.jpg' },
            { faceId: '2', image: 'http://example.com/image2.jpg' },
            { faceId: '3', image: 'http://example.com/image3.jpg' },
        ];

        const wrapper = mount(FacesList, {
            props: { faces }
        });

        const items = wrapper.findAllComponents(FacesListItem);
        expect(items.length).toBe(faces.length + 1); // Includes the additional FacesListItem for adding new face
        faces.forEach((face, index) => {
            expect(items[index].props().face).toEqual(face);
        });
    });

    it('renders an additional FacesListItem for adding a new face', () => {
        const faces: Face[] = [];
        const wrapper = mount(FacesList, {
            props: { faces }
        });

        const items = wrapper.findAllComponents(FacesListItem);
        expect(items.length).toBe(1); // Only the additional FacesListItem should be rendered
        expect(items[0].props().face).toBeUndefined();
    });

    it('renders correctly with no faces', () => {
        const faces: Face[] = [];
        const wrapper = mount(FacesList, {
            props: { faces }
        });

        expect(wrapper.findAllComponents(FacesListItem).length).toBe(1);
    });
});
