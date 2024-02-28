<script setup lang="ts">

import entranceIcon from '../assets/entrance.svg'
import gateIcon from '../assets/gate.svg'
import barrierIcon from '../assets/barrier.svg'
import { Domophone } from '../types/domophone';
const props = defineProps<{ data: Domophone }>()

const iconMap: Record<Domophone['icon'], string> = {
    'entrance': entranceIcon,
    'wicket': gateIcon,
    'gate': gateIcon,
    'barrier': barrierIcon
}
</script>

<template>
    <div class="door">
        <div class="door__icon">
            <img :src="iconMap[props.data.icon]" :alt="props.data.icon">
        </div>
        <div class="door__label">{{ props.data.name }}</div>
        <button>{{ $t('addresses.open') }}</button>
    </div>
</template>

<style scoped>
.door {
    display: flex;
    align-items: center;
    gap: 24px;
    border-top: solid 1px #F0F0F1;
    padding: 24px;
}

.door button {
    font-size: 14px;
    letter-spacing: 0em;
    color: #298BFF;
    background-color: transparent;
    border: 1px solid #298BFF;
    border-radius: 8px;
    padding: 6px;
    margin-left: auto;
}
</style>
