import {defineComponent, h} from 'vue';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {flushPromises, mount} from '@vue/test-utils';
import useCameras from './useCameras';
import useApi from './useApi';
import {mockCameras} from "@/mocks/Camera.ts";

// Мокируем useApi
vi.mock('./useApi');

// Определяем компонент-обертку для тестирования
const TestComponent = defineComponent({
    props: {
        houseId: String,
        overview: Boolean
    },
    setup(props) {
        return useCameras({
            houseId: props.houseId,
            overview: props.overview
        });
    },
    render() {
        return h('div');
    }
});

describe('useCameras', () => {
    // Создаем мок для метода get
    const mockGet = vi.fn();

    // Перед каждым тестом сбрасываем мок и устанавливаем его заново
    beforeEach(() => {
        mockGet.mockReset();
        (useApi as any).mockReturnValue({
            get: mockGet
        });
    });

    // Тест: загрузка камер при монтировании
    it('loads cameras on mount', async () => {
        // Мокируем вызов get и устанавливаем возврат данных
        mockGet.mockResolvedValue(mockCameras);

        // Монтируем компонент
        const wrapper = mount(TestComponent, {
            props: {
                houseId: 'testHouseId'
            }
        });
        // Ждем завершения всех асинхронных задач
        await flushPromises();

        // Проверяем, что метод get был вызван с правильными параметрами
        expect(mockGet).toHaveBeenCalledWith('cctv/all', { houseId: 'testHouseId' });
        // Получаем данные из компонента и проверяем их
        const { cameras } = wrapper.vm;
        expect(cameras).toEqual(mockCameras);
    });

    // Тест: загрузка обзорных камер, если overview равно true
    it('loads overview cameras if overview is true', async () => {
        mockGet.mockResolvedValue(mockCameras);

        const wrapper = mount(TestComponent, {
            props: {
                houseId: 'testHouseId',
                overview: true
            }
        });
        await flushPromises();

        // Проверяем, что метод get был вызван с правильными параметрами для overview
        expect(mockGet).toHaveBeenCalledWith('cctv/overview', { houseId: 'testHouseId' });
        // Получаем данные из компонента и проверяем их
        const { cameras } = wrapper.vm;
        expect(cameras).toEqual(mockCameras);
    });

    // Тест: установка пустого массива камер, если API возвращает null
    it('sets cameras to an empty array if API returns null', async () => {
        mockGet.mockResolvedValue(null);

        const wrapper = mount(TestComponent, {
            props: {
                houseId: 'testHouseId'
            }
        });
        await flushPromises();

        // Проверяем, что метод get был вызван с правильными параметрами
        expect(mockGet).toHaveBeenCalledWith('cctv/all', { houseId: 'testHouseId' });
        // Получаем данные из компонента и проверяем, что это пустой массив
        const { cameras } = wrapper.vm;
        expect(cameras).toEqual([]);
    });
});
