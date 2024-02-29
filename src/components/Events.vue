<script setup lang="ts">
// Импорт необходимых зависимостей
import { ref, computed, defineProps } from 'vue';
import { useEvents } from '../store/events';
import { useLocaleStore } from '../store/locale';
import useEventNames from '../lib/useEventNames';
import Label from './Label.vue';
import Event from './Event.vue';
import Select from './Select.vue';
import { Building } from '../types/building';
import eventIcon from '../assets/events.svg';

// Интерфейс для опций
interface OptionType {
    id: string;
    name: string;
}

// Получение параметра flatId из props
const { flatId } = defineProps<{ house: Building, flatId: string }>();

// Реактивная переменная для открытия/закрытия списка
const isOpen = ref(false);

// Получение событий для определенного flatId
const { events } = useEvents(flatId);

// Локализация
const localeStore = useLocaleStore();

// Получение названий событий
const { eventNames } = useEventNames();

// Вычисляемое свойство для опций
const options = computed(() => {
    return Object.entries(eventNames.value)
        .filter(([id]) => id !== 'default')
        .map(([id, name]) => ({ id, name }));
});

// Реактивная переменная для выбранной опции
const selectedOption = ref<OptionType | null>(null);

// Фильтрация событий по выбранной опции
const filteredEvents = computed(() => {
    return events.value
        .map(item => ({
            ...item,
            events: item.events.filter(event => selectedOption.value ? event.event === selectedOption.value.id : true)
        }))
        .filter(item => item.events.length > 0);
});

// Функция обновления выбранной опции
const updateOption = (newOption: OptionType | null) => {
    selectedOption.value = newOption;
};

// Функция обработки открытия/закрытия списка
const handleToggle = (open: boolean) => {
    isOpen.value = open;
};
</script>

<template>
    <Label :icon="eventIcon" alt="event icon" :text="$t('addresses.events')" @toggle="handleToggle" />

    <div class="events__list" v-if="isOpen">
        <Select :options="options" :model-value="selectedOption" @update:model-value="updateOption" />
        <div class="events__day" v-for="day in filteredEvents" :key="day.date.timezone">
            <div class="events__title">{{ localeStore.localizedDayjs(day.date.day).format('dddd, D MMMM') }}</div>
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

    &__day {
        margin-bottom: 24px;
    }

    &__title {
        font-size: 70%;
    }
}
</style>
  ../stores/events