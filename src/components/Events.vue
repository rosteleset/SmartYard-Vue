<script setup lang="ts">
import { ref } from 'vue';
import { useEvents } from '../store/events';
import Label from './Label.vue';
import Event from './Event.vue';
import { Building } from '../types/building';
import eventIcon from '../assets/events.svg';

const { flatId } = defineProps<{ house: Building, flatId: number }>();
const isOpen = ref(false);
const { events } = useEvents(flatId);

const handleToggle = (open:boolean) => {
    isOpen.value = open;
};
</script>

<template>
    <Label :icon="eventIcon" alt="event icon" :text="$t('addresses.events')" @toggle="handleToggle" />
    <div class="events__list" v-if="isOpen">
        <div class="day" v-for="day in events" :key="day.date.timezone">
            <Event v-for="event in day.events" :key="event.uuid" :event="event" />
        </div>
    </div>
</template>
  
<style scoped lang="scss">
.events {
    &__list {
        padding: 24px;
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 12px;
    }
}
</style>
  