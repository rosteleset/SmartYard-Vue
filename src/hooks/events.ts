// Это не глобальный стор. имеет свой набор событий для каждого экземпляра
// !!! Возможно стоит переместить

import { Ref, computed, onMounted, ref, watch } from "vue";
import { Event, EventDay } from "../types/events";
import { useApi } from "./useApi";

export interface EventStoreItem {
  date: EventDay;
  events: Event[];
}

export const useEvents = (
  flatIds: Ref<string[]>,
  eventType?: Ref<string | undefined>
) => {
  const {get} = useApi()
  const eventsMap = ref<{ [key: string]: Event[] }>({});

  const events = computed(() =>
    Object.keys(eventsMap.value).map((key) => ({
      date: key,
      events: eventsMap.value[key].filter(
        (event) => !eventType?.value || event.event === eventType?.value
      ),
    }))
  );

  const load = async () => {
    await Promise.all(
      flatIds.value.map((flatId) =>
        get<EventDay[]>("address/plogDays", { flatId }).then((days) => {
          if (days) days.forEach((day) => (eventsMap.value[day.day] = []));
        })
      )
    );

    await Promise.all(
      flatIds.value.map((flatId) =>
        Promise.all(
          Object.keys(eventsMap.value).map((day) =>
            get<Event[]>("address/plog", { flatId, day }).then(
              (_events) => _events && eventsMap.value[day]?.push(..._events)
            )
          )
        )
      )
    );
  };

  onMounted(load);
  watch(flatIds, load);

  return {
    events,
    eventsMap,
    load,
  };
};
