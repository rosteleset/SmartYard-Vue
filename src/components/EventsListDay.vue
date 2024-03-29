<script setup lang="ts">
import {Event, EventDay} from "@/types/events.ts";
import {computed, inject, onMounted, ref, watch} from "vue";
import EventsListItem from "@/components/EventsListItem.vue";
import {computedAsync, useElementVisibility, watchOnce} from "@vueuse/core";

const { day } = defineProps<{
  day: EventDay;
}>();

const getEvents =  inject("getEvents", async (_day:string)=>computed(()=>[]))
const selectedType = inject<string|undefined>("selectedType", undefined)

const events = ref<Event[]>([])
const target = ref(null)
const targetIsVisible = useElementVisibility(target)

watchOnce(targetIsVisible, (isVisible) => {
  if (isVisible)
  getEvents(day.day).then(response=> events.value = response.value)
})

</script>
<template >
  <h3 ref="target">{{day.day}}</h3>
  <TransitionGroup appear name="events" >
    <div v-for="event in events" :key="event.uuid" >
      <EventsListItem v-if="!selectedType || event.event === selectedType" :event="event" />
    </div>
  </TransitionGroup>
</template>

<style scoped lang="scss">

/* 1. declare transition */
.events-move,
.events-enter-active,
.events-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.events-enter-from,
.events-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.events-leave-active {
  position: absolute;
}
</style>