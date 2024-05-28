<script setup lang="ts">
import Select, {OptionProps} from "@/components/Select.vue";
import useEventNames from "@/hooks/useEventNames.ts";
import {Client} from "@/types/user.ts";
import {computed, inject} from "vue";
import useEvents, {eventsHook} from "@/hooks/useEvents.ts";

const {clients} = defineProps<{
  clients: Client[];
}>();

const events: eventsHook = inject("events") || useEvents([])

const clientsOptions = computed<OptionProps[]>(() =>
    clients.map((client) => ({
      id: client.flatId,
      name: client.flatNumber || client.flatId,
    }))
);
const {eventNames} = useEventNames();
const types = computed<OptionProps[]>(() => {
  return Object.entries(eventNames.value)
      .filter(([id]) => id !== "default")
      .map(([id, name]) => ({id, name}));
});

const selectedType = computed<OptionProps | undefined>({
  get: () => {
    if (events.eventType.value === undefined)
      return events.eventType.value;
    return {
      id: events.eventType.value,
      name: eventNames.value[events.eventType.value],
    };
  },
  set: (value: OptionProps | undefined) => {
    if (value === undefined) events.eventType.value = value;
    else events.eventType.value = value.id.toString();
  },
});

const selectedClient = computed<OptionProps | undefined>({
  get: () => {
    // return undefined
    if (events.flatId.value === undefined)
      return events.flatId.value;
    const client = clients.find(
        (client) => client.flatId == events.flatId.value
    );
    console.log("wtf")
    return {
      id: client?.flatId || "",
      name: client?.flatNumber || "",
    };
  },
  set: (value: OptionProps | undefined) => {
    console.log(events)

    events.flatId.value = value?.id.toString() || undefined
  },
});
</script>

<template>
  <div class="filters">
    <Select
        :options="types"
        v-model="selectedType"
        allow-undefined
        :undefined-text="$t('select.events')"
    />
    <Select
        v-if="clients && clients.length > 1"
        :options="clientsOptions"
        v-model="selectedClient"
        allow-undefined
        :undefined-text="$t('select.flat')"
    />
  </div>
</template>

<style scoped lang="scss">
.filters {
  display: flex;
  gap: 24px;
}
</style>
