<script setup lang="ts">
import { ref } from 'vue';
import { Building } from '../types/building';
import eventIcon from '../assets/events.svg'
import arrowIcon from '../assets/arrowRight.svg'
import { useEvents } from '../store/events';
import Event from './Event.vue';

const { house,flatId } = defineProps<{ house: Building, flatId: number }>();
const isOpen = ref(false)

const { events } = useEvents(flatId)

const labelClickHandler = () => {
    isOpen.value = !isOpen.value
}

</script>

<template>
    <div class="events__label" v-on:click="labelClickHandler">
        <div class="events__icon">
            <img :src="eventIcon" alt="event icon">
        </div>
        <div class="events__text">События</div>
        <div class="events__arrow" :class="{ open: isOpen }" aria-hidden="true">
            <img :src="arrowIcon" alt="arrow icon">
        </div>
    </div>
    <div class="events__list" v-if="isOpen">
        <div class="day" v-for="day of events">
            <Event v-for="event of day.events" :event="event" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.events {
    &__icon {
        width: 30px;
    }

    &__label {
        display: flex;
        align-items: center;
        gap: 24px;
        border-top: solid 1px #F0F0F1;
        padding: 24px;
        cursor: pointer;
    }

    &__arrow {
        margin-left: auto;
        transform: rotateZ(90deg);
        transition: .3s;

        &.open {
            transform: rotateZ(-90deg);
        }
    }

    &__list {
        padding: 24px;
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 12px;
    }
}
</style>
