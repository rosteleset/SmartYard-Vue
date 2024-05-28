<script setup lang="ts">
import EventsListDay from "@/components/EventsListDay.vue";
import {Client} from "@/types/user";
import useEvents, {eventsHook} from "@/hooks/useEvents.ts";
import {inject} from "vue";

const {clients} = defineProps<{
  clients: Client[];
}>();
const events: eventsHook = inject("events") || useEvents(clients.map((client) => client.flatId))
const {days} = events
</script>

<template>
  <EventsListDay v-for="day in days" :day="day" :key="day.day"/>
</template>

<style scoped lang="scss">
</style>
