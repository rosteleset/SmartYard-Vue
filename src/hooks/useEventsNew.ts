import { Ref, computed, onMounted, ref, watch } from "vue";
import { Event, EventDay } from "../types/events";
import useApi from "./useApi";

export interface EventStoreItem {
  date: EventDay;
  events: Event[];
}

const useEvents = (
  flatIds: Ref<string[]>,
  eventType?: Ref<string | undefined>
) => {
  const { get } = useApi();

  const getDays = async () => {
      const response = await get<EventDay[]>(`address/plogDays`, { flatIds });
      return response || [];
  }

  const getEvents = async (day:EventDay) => {
      try {
          const response = await get<Event[]>(`address/plog`, { flatIds, day})
          return response.filter((event) =>!eventType?.value || event.event === eventType?.value);
      } catch (error) {
          return [];
      }

  }

  return {
      getDays,
      getEvents
  };
};

export default useEvents;
