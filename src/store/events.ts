// Это не глобальный стор. имеет свой набор событий для каждого экземпляра
// !!! Возможно стоит переместить 

import { onMounted, ref } from "vue";
import { get } from "../api";
import { Event, EventDay } from "../types/events";

interface EventStoreItem {
    date: EventDay,
    events: Event[]
}

export const useEvents = (flatId: number) => {
    const events = ref<EventStoreItem[]>([])

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
