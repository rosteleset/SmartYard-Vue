import { Events, onMounted, ref, watch } from "vue";
import { get } from "../api";
import { Event, EventDay } from "../types/events";

interface EventStoreItem {
    date: EventDay,
    events: Event[]
}

const events = ref<EventStoreItem[]>([])

export const useEvents = (flatId: number) => {
    onMounted(() => {
        get<EventDay[]>('address/plogDays', { flatId })
            .then(async response => {
                const result: EventStoreItem[] = response.map(date => ({ date, events: [] }));

                // Запускаем все запросы параллельно
                await Promise.all(result.map(async item => {
                    try {
                        const _events = await get<Event[]>('address/plog', { flatId, day: item.date.day });
                        item.events = _events;
                    } catch (error) {
                        console.error('Ошибка при получении событий', error);
                        // Обработка ошибок для каждого запроса
                    }
                }));

                // Обновляем значение один раз после завершения всех запросов
                events.value = result;
            })
            .catch(error => {
                console.error('Ошибка при получении дней событий', error);
                // Общая обработка ошибок
            });
    });

    return {
        events,
    }
}