<script setup lang="ts">

import Select, {OptionProps} from "@/components/Select.vue";
import {computed, ref} from "vue";
import useEventNames from "@/hooks/useEventNames.ts";
import {Client} from "@/types/user.ts";
import {WritableComputedOptions} from "@vue/reactivity";
import {useEventsStore} from "@/store/events.ts";


const {clients} = defineProps<{
  clients: Client[];
}>()

const test = ref<OptionProps[]>([])
const clientsOptions = computed<OptionProps>(() => clients.map((client) => ({
  id: client.flatId,
  name: client.flatNumber.toString(),
})))
const eventsStore = useEventsStore()
const {eventNames} = useEventNames();
const types = computed<OptionProps[]>(() => {
  return Object.entries(eventNames.value)
      .filter(([id]) => id !== "default")
      .map(([id, name]) => ({id, name}));
});

const selectedType = computed<OptionProps | undefined>({
  get: () => {
    if (eventsStore.eventTypes.length === 0 || eventsStore.eventTypes.length > 1) return undefined;
    return {
      id: eventsStore.eventTypes[0],
      name: eventNames.value[eventsStore.eventTypes[0]]
    }
  },
  set: (value: OptionProps | undefined) => {
    if (value === undefined) eventsStore.eventTypes = [];
    else eventsStore.eventTypes = [value.id]
  }
});
const selectedClient = computed<OptionProps | undefined>({
  get: () => {
    if (eventsStore.flatIds.length === 0 || eventsStore.flatIds.length > 1) return undefined;
    const client = clients.find((client) => client.flatId == eventsStore.flatIds[0])
    return {
      id: client?.flatId || "",
      name: client?.flatNumber.toString() || "",
    }
  },
  set: (value: OptionProps| undefined) => {
    if (value === undefined) eventsStore.flatIds = clients.map((client) => client.flatId);
    else eventsStore.flatIds = [value.id]
  }
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

</style>