<script setup lang="ts">
import Select, {OptionProps} from "@/components/Select.vue";
import useEventNames from "@/hooks/useEventNames.ts";
import {useEventsStore} from "@/store/events.ts";
import {Client} from "@/types/user.ts";
import {computed} from "vue";

const {clients} = defineProps<{
  clients: Client[];
}>();

const clientsOptions = computed<OptionProps[]>(() =>
    clients.map((client) => ({
      id: client.flatId,
      name: client.flatNumber || client.flatId,
    }))
);
const eventsStore = useEventsStore();
const {eventNames} = useEventNames();
const types = computed<OptionProps[]>(() => {
  return Object.entries(eventNames.value)
      .filter(([id]) => id !== "default")
      .map(([id, name]) => ({id, name}));
});

const selectedType = computed<OptionProps | undefined>({
  get: () => {
    if (
        eventsStore.eventTypes.length === 0 ||
        eventsStore.eventTypes.length > 1
    )
      return undefined;
    return {
      id: eventsStore.eventTypes[0],
      name: eventNames.value[eventsStore.eventTypes[0]],
    };
  },
  set: (value: OptionProps | undefined) => {
    if (value === undefined) eventsStore.eventTypes = [];
    else eventsStore.eventTypes = [value.id.toString()];
  },
});
const selectedClient = computed<OptionProps | undefined>({
  get: () => {
    if (eventsStore.flatIds.length === 0 || eventsStore.flatIds.length > 1)
      return undefined;
    const client = clients.find(
        (client) => client.flatId == eventsStore.flatIds[0]
    );
    return {
      id: client?.flatId || "",
      name: client?.flatNumber || "",
    };
  },
  set: (value: OptionProps | undefined) => {
    if (value === undefined)
      eventsStore.flatIds = clients.map((client) => client.flatId);
    else eventsStore.flatIds = [value.id.toString()];
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
