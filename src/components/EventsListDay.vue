<script setup lang="ts">
import EventsListItem from "@/components/EventsListItem.vue";
import useLocale from "@/hooks/useLocale";
import { useEventsStore } from "@/store/events";
import { Event, EventDay } from "@/types/events.ts";
import { useElementVisibility, watchOnce } from "@vueuse/core";
import { computed } from "vue";
import { ref, watch } from "vue";

const { day } = defineProps<{
  day: EventDay;
}>();

const eventsStore = useEventsStore();
const { localizedDayjs } = useLocale();
const localizedText = computed(() =>
  localizedDayjs.value(day.day).format("dddd, D MMMM")
);
const events = ref<Event[]>([]);
const target = ref(null);
const targetIsVisible = useElementVisibility(target);
const isEmpty = ref(false);

watchOnce(targetIsVisible, (isVisible) => {
  if (isVisible)
    eventsStore.getEvents(day).then((_events) => {
      events.value = _events;
      if (_events.length === 0) isEmpty.value = true;
    });
});
watch(eventsStore, () => {
  isEmpty.value = false;
  if (targetIsVisible.value)
    eventsStore.getEvents(day).then((_events) => (events.value = _events));
});
</script>
<template>
  <Transition>
    <div v-if="!isEmpty">
      <h3 ref="target">{{ localizedText }}</h3>
      <TransitionGroup appear name="events">
        <div v-for="event in events" :key="event.uuid">
          <EventsListItem :event="event" />
        </div>
      </TransitionGroup>
    </div>
  </Transition>
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
