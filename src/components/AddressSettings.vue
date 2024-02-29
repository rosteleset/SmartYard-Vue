<script setup lang="ts">
import { ref } from 'vue';
import { useSettings } from '../store/settings';
import Switch from './Switch.vue';

const { flatId } = defineProps<{
    flatId: string
}>()

const { settings, save } = useSettings(flatId)
const updatedSettings = ref<Record<string, string>>({});
const whiteRabbitOptions = ["0", "1", "2", "3", "5", "7", "10"];

const isBooleanSetting = (key: string) => {
    return ['allowDoorCode', 'CMS', 'VoIP', 'paperBill', 'disablePlog', 'hiddenPlog', 'FRSDisabled'].includes(key);
};

const isWhiteRabbitSetting = (key: string) => {
    return key === 'whiteRabbit';
};

const update = (key: string, value: string | boolean) => {
    // Обновляем объект с обновленными настройками
    let _value: string
    switch (value) {
        case true:
            _value = 't'
            break;
        case false:
            _value = 'f'
            break;
        default:
            _value = value
            break;
    }
    updatedSettings.value[key] = _value;
}

const saveSettings = () => {
    save(updatedSettings.value)
};

</script>

<template>
    <h3>Настройки</h3>

    <template v-for="(value, key) in settings" :key="key">
        <template v-if="isBooleanSetting(key)">
            <Switch :initial-value="value === 't'" :label="key" @update:model-value="update(key, $event)" />
        </template>
        <template v-if="isWhiteRabbitSetting(key)">
            <select v-model="updatedSettings[key]">
                <option v-for="option in whiteRabbitOptions" :value="option">{{ option }}</option>
            </select>
        </template>
    </template>
    <button @click="saveSettings">save</button>
</template>

<style scoped lang="scss"></style>

