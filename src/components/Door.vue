<script setup lang="ts">

import entranceIcon from '../assets/entrance.svg'
import gateIcon from '../assets/gate.svg'
import barrierIcon from '../assets/barrier.svg'
import { Domophone } from '../types/domophone';
import openDoor from '../api/openDoor';

const props = defineProps<{ data: Domophone }>()

const iconMap: Record<Domophone['icon'], string> = {
    'entrance': entranceIcon,
    'wicket': gateIcon,
    'gate': gateIcon,
    'barrier': barrierIcon
}

const handlerOpen = () => {
    openDoor(props.data.domophoneId)
}
</script>

<template>
    <div class="door">
        <div class="door__icon">
            <img :src="iconMap[props.data.icon]" :alt="props.data.icon">
        </div>
        <div class="door__label">{{ props.data.name }}</div>
        <button @click="handlerOpen">{{ $t('addresses.open') }}</button>
    </div>
</template>

<style scoped lang="scss">
.door {
    display: grid;
    grid-template-areas: "icon label" "button button";
    gap: 24px;
    border: solid 1px #F0F0F1;
    border-radius: 12px;
    padding: 24px;

    &__icon {
        grid-area: icon;
    }

    &__label {
        grid-area: label;
        font-size: 18px;
    }

    button {
        grid-area: button;
        width: 100%;
        font-size: 14px;
        letter-spacing: 0em;
        color: #298BFF;
        background-color: transparent;
        border: 1px solid #298BFF;
        border-radius: 8px;
        padding: 6px;
        margin-left: auto;
        transition: .3s;
        cursor: pointer;

        &:hover {
            background-color: #298BFF;
            color: #ffffff;
        }
    }
}
</style>
