import { defineStore } from "pinia";
import useApi from "@/hooks/useApi.ts";
import { Ref, computed, onMounted, ref, watch } from "vue";
import { EventDay, Event } from "@/types/events.ts";
import { asyncComputed } from "@vueuse/core";
import { error } from "console";
import dayjs from "dayjs";
import { useUserStore } from "./user";

export const useEventsStore = defineStore("events", () => {
  const { get } = useApi();
  const { clients } = useUserStore();
  const flatIds = ref<string[]>(clients.map((client) => client.flatId));
  const eventTypes = ref<string[]>([]);
  const days = ref<EventDay[]>([]);

  const getDays = async () => {
    const result: EventDay[] = [];
    for (const flatId of flatIds.value) {
      try {
        const response = await get<EventDay[]>(`address/plogDays`, {
          flatId,
          events:
            eventTypes.value.length > 0
              ? eventTypes.value.join(",")
              : undefined,
        });

        result.push(...response);
      } catch (_error) {}
    }
    const uniqueEventsArray = result.filter(
      (event, index, self) =>
        index === self.findIndex((t) => t.day === event.day)
    );
    return uniqueEventsArray.sort(
      (a, b) => new Date(b.day).getTime() - new Date(a.day).getTime()
    );
  };

  const getEvents = async (day: EventDay) => {
    const result: Event[] = [];
    for (const flatId of flatIds.value) {
      try {
        const response = await get<Event[]>(`address/plog`, {
          flatId,
          day: day.day,
        });

        result.push(...response);
      } catch (_error) {
        console.log(_error);
      }
    }

    return result.filter(
      (event) =>
        eventTypes.value.length === 0 || eventTypes.value.includes(event.event)
    );
  };

  watch([flatIds, eventTypes], () => {
    getDays().then((result) => (days.value = result));
  });

  // onMounted(() => {
  //   flatIds.value = clients.map((client) => client.flatId);
  // });
  return {
    flatIds,
    eventTypes,
    getDays,
    getEvents,
    days,
  };
});
