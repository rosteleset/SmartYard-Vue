<script setup lang="ts">
import { useSettings } from '../store/settings';
import Switch from './Switch.vue';
import dayjs from 'dayjs';
import resetCode from '../api/resetCode'
import { computed } from 'vue';
import Button from './Button.vue';
import reloadIcon from '../assets/reload.svg'
import { ref } from 'vue';
import { watch } from 'vue';

const { flatId } = defineProps<{
    flatId: string
}>()

const { settings, save } = useSettings(flatId)
const doorCode = ref(settings.value?.doorCode)
const isAutoOpen = computed(() => dayjs().isBefore(dayjs(settings.value?.autoOpen)))

const isFRSSetting = (key: string) => {
    return key === 'FRSDisabled';
};

const isWhiteRabbitSetting = (key: string) => {
    return key === 'whiteRabbit';
};

const update = (key: string, value: string | boolean) => {
    let _value = value

    // инвертируем FRS
    if (isFRSSetting(key))
        _value = !value

    let string: string
    // конвертируем boolean в строку
    switch (_value) {
        case true:
            // автооткрытие 5 минут
            if (isWhiteRabbitSetting(key))
                string = "5"
            else
                string = 't'
            break;
        case false:
            // автооткрытие 5 минут
            if (isWhiteRabbitSetting(key))
                string = "0"
            else
                string = 'f'
            break;
        default:
            string = _value
            break;
    }
    save({ [key]: string });
    // console.log({ [key]: string });
}

const regenerateCode = () => {
    resetCode(flatId)
        .then(code => doorCode.value = code)
}

const setAutoOpen = () => {
    save({ autoOpen: dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss') })
}

watch(settings, () => {
    doorCode.value = settings.value?.doorCode
})

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
    </div>
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

