import {Ref} from "vue";
import {Event, EventDay} from "../types/events";
import useApi from "./useApi";

export interface EventStoreItem {
    date: EventDay;
    events: Event[];
}

const useEvents = (
    flatIds: Ref<string[]>,
    eventType?: Ref<string | undefined>
) => {
    const {get} = useApi();

    const getDays = async () => {
        try {
            const result: EventDay[] = []
            for (const flatId of flatIds.value) {
                const response = await get<EventDay[]>(`address/plogDays`, {flatId, events: eventType?.value});
                result.push(...response)
            }
            return result;
        } catch (_error) {
            return [];
        }
    }

    const getEvents = async (day: EventDay) => {
        try {
            console.log("getEvents", day)
            const result: Event[] = []
            for (const flatId of flatIds.value) {
                const response = await get<Event[]>(`address/plog`, {flatId, day})
                if (Array.isArray(response))
                    result.push(...response)
            }

            return result
        } catch (_error) {
            return [];
        }
    }

    return {
        getDays,
        getEvents
    };
};

export default useEvents;
