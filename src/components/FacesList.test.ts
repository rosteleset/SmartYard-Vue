import {mount} from '@vue/test-utils';
import {describe, it, expect, vi} from 'vitest';
import FacesList from '@/components/FacesList.vue';
import FacesListItem from '@/components/FacesListItem.vue';
import {mockFaces} from "@/mocks/Faces.ts";

vi.mock('@/components/FacesListItem.vue')

describe('FacesList', () => {
    const faces = mockFaces;

    it('renders FacesListItem for each face in props', () => {
        const wrapper = mount(FacesList, {
            props: {faces}
        });

        const items = wrapper.findAllComponents(FacesListItem);
        // Количество элементов должно быть равно количеству объектов в faces плюс один пустой элемент
        expect(items).toHaveLength(faces.length + 1);
    });

    it('renders FacesListItem even when faces is an empty array', () => {
        const wrapper = mount(FacesList, {
            props: {faces: []}
        });

        const items = wrapper.findAllComponents(FacesListItem);
        // Количество элементов должно быть 1, так как мы добавляем один пустой элемент
        expect(items).toHaveLength(1);
    });

    it('passes the correct props to FacesListItem', () => {
        const wrapper = mount(FacesList, {
            props: {faces}
        });

        const items = wrapper.findAllComponents(FacesListItem);
        faces.forEach((face, index) => {
            expect(items[index].props('face')).toEqual(face);
        });
    });
});
