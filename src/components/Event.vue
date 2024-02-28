<script setup lang="ts">
import { Event } from '../types/events';
import { useLocaleStore } from '../store/locale'
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import informationIcon from '../assets/information.svg'
import Modal from './Modal.vue';
import Button from './Button.vue';
import { ref } from 'vue';

// Определение пропсов
const props = defineProps<{ event: Event }>()
const localeStore = useLocaleStore()
const { t } = useI18n()

// Вычисляемые свойства
const label = computed(() => getEventName(props.event.event))
const time = computed(() => localeStore.localizedDayjs(props.event.date).format("HH:mm"))
const dateTime = computed(() => localeStore.localizedDayjs(props.event.date).format("dddd, D, MMMM HH:mm"))
const isModalOpen = ref(false);
const canLike = computed(() => props.event.detailX.flags?.includes('canLike'))
const canDislike = computed(() => props.event.detailX.flags?.includes('canDislike'))

// Функции для работы с модальным окном
const openModal = () => {
    isModalOpen.value = true;
};
const closeModal = () => {
    isModalOpen.value = false;
};

// Функция для получения названия события
const getEventName = (event: string) => {
    const eventNames: { [key: string]: string } = {
        '1': t('events.call_unanswered'),
        '2': t('events.сall_answered'),
        '3': t('events.open_by_key'),
        '4': t('events.open_from_app'),
        '5': t('events.open_by_face'),
        '6': t('events.open_by_code'),
        '7': t('events.open_gates_by_call'),
        default: t('events.unknown')
    };
    return eventNames[event] || eventNames.default;
};
</script>

<template>
    <div class="event">
        <span>{{ label }}</span>
        <span>{{ time }}</span>
        <button class="event__button" v-on:click="openModal">
            <img :src="informationIcon" alt="information">
        </button>
        <Modal :title="props.event.mechanizmaDescription" :is-open="isModalOpen" @on-close="closeModal">
            <p>{{ dateTime }}</p>
            <img v-if="props.event.preview" :src="props.event.preview" :alt="label">
            <div class="event__buttons">
                <Button variant="sucsses" v-if="canLike">свой</Button>
                <Button variant="error" v-if="canDislike">чужой</Button>
            </div>
        </Modal>
    </div>
</template>

<style scoped lang="scss">
.event {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-bottom: solid 1px #F0F0F1;

    &__button {
        background: none;
        border: 0;
    }

    &__buttons {
        padding: 12px;
        display: flex;
        justify-content: center;
        gap: 12px;
    }
}
</style>
  