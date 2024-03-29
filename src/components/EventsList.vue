<script setup lang="ts">
import {EventDay} from "@/types/events.ts";
import EventsListDay from "@/components/EventsListDay.vue";


const { days } = defineProps<{
  days: EventDay[];
}>();

</script>

<template>
  <h2>Events</h2>
  <EventsListDay v-for="day in days" :day="day" :key="day.day"/>
</template>

<style scoped lang="scss">
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
  /* .list-complete-leave-active до версии 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>
