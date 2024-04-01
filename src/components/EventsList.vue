<script setup lang="ts">
import EventsListDay from "@/components/EventsListDay.vue";
import { useEventsStore } from "@/store/events";
import { Client } from "@/types/user";

const { clients } = defineProps<{
  clients: Client[];
}>();

const eventsStore = useEventsStore();
eventsStore.flatIds = clients.map((client) => client.flatId); // инициализация стора
</script>

<template>
  <EventsListDay v-for="day in eventsStore.days" :day="day" :key="day.day" />
</template>

<style scoped lang="scss">
</style>
