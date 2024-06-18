import {computed, onMounted, Ref, ref, watch} from "vue";
import {Event, EventDay} from "../types/events";
import useApi from "./useApi";

export type eventsHook = {
    getEvents: (day: EventDay) => Promise<Event[]>;
    days: Ref<Array<EventDay>>;
    flatId: Ref<string | undefined>;
    eventType: Ref<string | undefined>;
}

const useEvents = (
    flatIds: string[]
): eventsHook => {
    const {get} = useApi();

    // private
    const _days = ref<EventDay[]>([])

    // public
    const flatId = ref<string>()
    const eventType = ref<string>();

    const days = computed(() => _days.value)

    const loadDays = async () => {
        const result: EventDay[] = [];
        const flats = flatId.value ? [flatId.value] : flatIds
        for (const flatId of flats) {
            try {
                const response = await get<EventDay[]>(`address/plogDays`, {
                    flatId,
                    events: eventType.value
                });

                result.push(...response);
            } catch (_error) {
            }
        }
        const uniqueEventsArray = result.filter(
            (event, index, self) =>
                index === self.findIndex((t) => t.day === event.day)
        );
        _days.value = uniqueEventsArray.sort(
            (a, b) => new Date(b.day).getTime() - new Date(a.day).getTime()
        );
    }

    const getEvents = async (day: EventDay) => {
        const result: Event[] = [];

        const _flats = flatId.value ? [flatId.value] : flatIds
        for (const flatId of _flats) {
            try {
                const response = await get<Event[]>(`address/plog`, {
                    flatId:flatId,
                    day: day.day,
                });

                result.push(...response);
            } catch (_error) {
            }
        }

        return result.filter(
            (event) =>
                !eventType.value || eventType.value === event.event
        );
    }

    onMounted(loadDays)
    watch([flatId, eventType], loadDays)

    return {
        flatId,
        eventType,
        days,
        getEvents
    };
};

export default useEvents;
