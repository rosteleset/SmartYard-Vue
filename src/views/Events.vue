<script setup lang="ts">
import EventsList from "@/components/EventsList.vue";
import useEventsNew from "@/hooks/useEventsNew.ts";
import {useAddressesStore} from "@/store/addresses.ts";
import {computed, provide, ref} from "vue";
import {computedAsync} from "@vueuse/core";
import EventsFilter from "@/components/EventsFilter.vue";
import {useEventsStore} from "@/store/events.ts";

const {houseId} = defineProps<{
  houseId: string;
}>();
const {getClientsByHouseId} = useAddressesStore()
const clients = getClientsByHouseId(houseId)
const selectedFlatId = ref<string>()
const selectedType = ref<string>()

const eventsStore = useEventsStore()

const {days} = eventsStore.getDays()
</script>

<template>
  <h1>Events</h1>
  <EventsFilter :clients="clients" />
  <EventsList :days="days"/>
</template>

<style scoped lang="scss">
.title {
  font-size: 24px;
  margin: 24px 0;
}

.events {
  &__list {
    padding: 24px;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 12px;
  }

  &__day {
    margin-bottom: 24px;
  }

  &__title {
    font-size: 70%;
  }
}

.filters {
  display: flex;
  gap: 24px;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
