<script setup lang="ts">
import { onMounted } from 'vue';
import { Event } from '../types/events';
import { useLocaleStore } from '../store/locale'
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import informationIcon from '../assets/information.svg'

const props = defineProps<{ event: Event }>();
const localeStore = useLocaleStore()
const { t } = useI18n()
const label = computed(() => getEventName(props.event.event))
const time = computed(() => localeStore.localizedDayjs(props.event.date).format("HH:mm"))

const getEventName = (event: string) => {
    console.log(props.event);


    switch (event) {
        case '1':
            return t('events.call_unanswered')
        case '2':
            return t('events.сall_answered')
        case '3':
            return t('events.open_by_key')
        case '4':
            return t('events.open_from_app')
        case '5':
            return t('events.open_by_face')
        case '6':
            return t('events.open_by_code')
        case '7':
            return t('events.open_gates_by_call')
        default:
            return t('events.unknown')
    }
}

const handler = () => {
}


onMounted(() => {

})

</script>

<template>
    <div class="event">
        <span>{{ label }}</span>
        {{ " " }}
        <span>{{ time }}</span>

        <button class="event__button" v-on:click="handler">
            <img :src="informationIcon" alt="information">
        </button>
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
}
</style>