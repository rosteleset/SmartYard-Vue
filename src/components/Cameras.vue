<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCameras } from '../store/cameras'
import cameraIcon from '../assets/camera.svg'
import arrowIcon from '../assets/arrowRight.svg'
import Video from './Video.vue';
import { Building } from '../types/building';
import { initializeVideoStream } from '../lib/video';

const props = defineProps<{ house: Building }>();
const isOpen = ref(false)
const ref0 = ref<HTMLVideoElement | null>(null);

const { cameras } = useCameras(props.house.houseId)

const labelClickHandler = () => {
    isOpen.value = !isOpen.value
}

watch(ref0, (value) => {1709017200
    if (value)
        initializeVideoStream(`https://rbt-demo.lanta.me:8443/rbt-demo-000009/index-1709017200-1709036292.m3u8?token=phei9quohmoochoth5es3eo9Koh5ua9i`, value)
})

</script>

<template>
    <div class="cameras__label" v-on:click="labelClickHandler">
        <div class="cameras__icon">
            <img :src="cameraIcon" alt="camera icon">
        </div>
        <div class="cameras__text">Видеокамеры</div>
        <div class="cameras__arrow" :class="{ open: isOpen }" aria-hidden="true">
            <img :src="arrowIcon" alt="arrow icon">
        </div>
    </div>
    <div class="cameras__list" v-if="isOpen">
        <Video v-for="camera in cameras" :key="camera.id" :camera="camera" />
        <video ref="ref0" controls style="width: 300px;"></video>
    </div>
</template>

<style scoped lang="scss">
.cameras {
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
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
    }
}
</style>
