import {defineStore} from "pinia";
import useApi from "@/hooks/useApi.ts";
import {computed, ref} from "vue";
import {EventDay,Event} from "@/types/events.ts";

export const useEventsStore = defineStore("events", () => {
    const {get} = useApi();

    const flatIds = ref<string[]>([]);
    const eventTypes = ref<string[]>([]);

    const getDays = () => {
        const result: EventDay[] = []
        for (const flatId of flatIds.value) {
            get<EventDay[]>(`address/plogDays`, {flatId, events: eventTypes.value.join(",")})
                .then((response) => result.push(...response))
        }

        const days = computed(() => {
            return result;
        })
        return {
            days
        }
    }

    const getEvents = (day: EventDay) => {
        const result: Event[] = []
        for (const flatId of flatIds.value) {
            get<Event[]>(`address/plog`, {flatId, day: day.day})
                .then((response) => result.push(...response))
        }

        const events = computed(() => {
            return result.filter(event => eventTypes.value.includes(event.event));
        })
        return {
            events
        }
    }

    return {
        flatIds,
        eventTypes,
        getDays,
        getEvents
    }
})

