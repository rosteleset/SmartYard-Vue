<script setup lang="ts">
// импорт необходимых модулей
import { useSettings } from '../store/settings';
import Switch from './Switch.vue';
import dayjs from 'dayjs';
import resetCode from '../api/resetCode';
import { computed } from 'vue';
import Button from './Button.vue';
import reloadIcon from '../assets/reload.svg';
import { ref } from 'vue';
import { watch } from 'vue';
import Modal from './Modal.vue';
import Events from './Events.vue';

// определение свойств
const { flatId } = defineProps<{
    flatId: string
}>()

// использование настроек
const { settings, save } = useSettings(flatId)

// установка значения doorCode
const doorCode = ref(settings.value?.doorCode)

// вычисление значения isAutoOpen
const isAutoOpen = computed(() => dayjs().isBefore(dayjs(settings.value?.autoOpen)))

const isFacesOpen = ref(false)

const togleIsFacesOpen = () => {
    isFacesOpen.value = !isFacesOpen.value
}

// функции для проверки настроек
const isFRSSetting = (key: string) => {
    return key === 'FRSDisabled';
};

const isWhiteRabbitSetting = (key: string) => {
    return key === 'whiteRabbit';
};

// функция обновления настроек
const update = (key: string, value: string | boolean) => {
    const _value = isFRSSetting(key) ? !value : value;
    const string = isWhiteRabbitSetting(key) ? (_value ? "5" : "0") : (_value ? 't' : 'f');
    save({ [key]: string });
}

// функция для генерации нового кода
const regenerateCode = () => {
    resetCode(flatId)
        .then(code => doorCode.value = code)
}

// функция для установки автоматического открытия
const setAutoOpen = () => {
    if (!isAutoOpen.value)
        save({ autoOpen: dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss') })
}

// отслеживание изменений в настройках
watch(settings, (newSettings) => {
    if (newSettings && newSettings.doorCode !== doorCode.value) {
        doorCode.value = newSettings.doorCode;
    }
});

</script>

<template>
    <div class="grid">
        <h4>{{ $t('settings.intercom') }}</h4>
        <template v-if="settings?.CMS !== undefined">
            <div>{{ $t('settings.CMS') }}</div>
            <Switch :initial-value="settings.CMS === 't'" @update:model-value="update('CMS', $event)" />
        </template>
        <template v-if="settings?.VoIP !== undefined">
            <div>{{ $t('settings.VoIP') }}</div>
            <Switch :initial-value="settings.VoIP === 't'" @update:model-value="update('VoIP', $event)" />
        </template>
        <template v-if="settings?.FRSDisabled !== undefined">
            {{ $t('settings.FRSDisabled') }}
            <Switch :initial-value="settings.FRSDisabled === 'f'" @update:model-value="update('FRSDisabled', $event)" />
        </template>
        <template v-if="settings?.whiteRabbit !== undefined">
            <div>{{ $t('settings.whiteRabbit') }}</div>
            <Switch :initial-value="settings.whiteRabbit !== '0'" @update:model-value="update('whiteRabbit', $event)" />
        </template>

        <template v-if="settings?.hiddenPlog !== undefined">
            <div>{{ $t('settings.hiddenPlog') }}</div>
            <Switch :initial-value="settings.hiddenPlog === 't'" @update:model-value="update('hiddenPlog', $event)" />
        </template>

        <template v-if="settings?.disablePlog !== undefined">
            <div>{{ $t('settings.disablePlog') }}</div>
            <Switch :initial-value="settings.disablePlog === 't'" @update:model-value="update('disablePlog', $event)" />
        </template>

        <template v-if="settings?.paperBill !== undefined">
            <div>{{ $t('settings.paperBill') }}</div>
            <Switch :initial-value="settings.paperBill === 't'" @update:model-value="update('paperBill', $event)" />
        </template>


        <h4>{{ $t('settings.access') }}</h4>
        <template v-if="settings?.allowDoorCode === 't'">
            <div>
                {{ $t('settings.reset-code') }} <strong>{{ doorCode }}</strong>
            </div>
            <button class="reset" @click="regenerateCode"><img :src="reloadIcon" alt=""></button>
        </template>
        <template v-if="settings?.autoOpen !== undefined">
            <div>
                {{ $t('settings.guest-access') }}
            </div>
            <Button :variant="isAutoOpen ? 'sucsses' : 'primary'" @click="setAutoOpen">
                {{ isAutoOpen ? 'открыто' : 'открыть' }}
            </Button>
        </template>

        <Button variant="primary" @click="togleIsFacesOpen">Упрвление лицами</Button>
    </div>
    <Modal :title="'Зарегистрированные лица'" :is-open="isFacesOpen" @on-close="togleIsFacesOpen">
        <Events/>
    </Modal>
</template>

<style scoped lang="scss">
.grid {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 12px;
    width: max-content;

    h4 {
        grid-column-start: 1;
        grid-column-end: 3;
    }
}

.reset {
    background: none;
    border: 0;
    cursor: pointer;

    img {
        display: inline-block;
        transform: rotate(0deg);
        transition: transform 1s;
    }

    &:active {
        img {
            transition: transform 0s;
            transform: rotate(-360deg);
        }
    }
}
</style>
