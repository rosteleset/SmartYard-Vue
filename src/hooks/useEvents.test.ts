import {beforeEach, describe, expect, it, Mock, vi} from 'vitest';
import {defineComponent, h} from 'vue';
import useEvents from './useEvents';
import useApi from './useApi';
import {flushPromises, mount} from "@vue/test-utils";
import {mockEvents} from "@/mocks/Events.ts";

// Мокируем useApi
vi.mock('./useApi');

const TestComponent = defineComponent({
    props: {
        flatIds: {
            type: Array as () => Array<string>,
            required: true,
        }
    },
    setup(props) {
        return useEvents(props.flatIds);
    },
    render() {
        return h('div');
    }
});

describe('useEvents', () => {
    // Создаем мок для метода get из useApi
    const mockGet = vi.fn();
    // Перед каждым тестом сбрасываем мок и устанавливаем его заново
    beforeEach(() => {
        mockGet.mockReset();
        (useApi as Mock).mockReturnValue({get: mockGet});
    });

    it('loads days on mount', async () => {
        // Мокируем результаты запроса для метода get
        mockGet.mockResolvedValueOnce([
            {day: '2024-06-01'},
            {day: '2024-06-02'}
        ]);

        // Монтируем компонент
        const wrapper = mount(TestComponent, {
            props: {
                flatIds: ['flat1', 'flat2']
            }
        });
        // Ждем завершения всех асинхронных задач
        await flushPromises();

        // Проверяем, что метод get был вызван с правильными параметрами
        expect(mockGet).toHaveBeenCalledWith('address/plogDays', {flatId: 'flat1', events: undefined});
        expect(mockGet).toHaveBeenCalledWith('address/plogDays', {flatId: 'flat2', events: undefined});

        // Проверяем, что дни загружены правильно
        expect(wrapper.vm.days).toEqual([
            {day: '2024-06-02'},
            {day: '2024-06-01'}
        ]);


    });

    it('loads events', async () => {
        // Мокируем результаты запроса для метода get
        mockGet.mockResolvedValueOnce([
            {day: '2024-06-01'}
        ]);

        const wrapper = mount(TestComponent, {
            props: {
                flatIds: ['flat1', 'flat2']
            }
        });
        // Ждем завершения всех асинхронных задач
        await flushPromises();

        mockGet.mockResolvedValueOnce(mockEvents);
        expect(await wrapper.vm.getEvents(wrapper.vm.days[0])).toEqual(mockEvents);
        //  Проверяем, что метод get был вызван с правильными параметрами для загрузки событий
        expect(mockGet).toHaveBeenLastCalledWith('address/plog', {flatId: 'flat2', day: '2024-06-01'});

    });

    it('filter events', async () => {
        mockGet.mockResolvedValueOnce([
            {day: '2024-06-01'}
        ]);

        const wrapper = mount(TestComponent, {
            props: {
                flatIds: ['flat1']
            }
        });

        await flushPromises();
        mockGet.mockResolvedValue(mockEvents);
        wrapper.vm.eventType = '1'
        expect(await wrapper.vm.getEvents(wrapper.vm.days[0])).toEqual([mockEvents[0]]);
    });
});
