<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Building } from '../api/addresses';
import { Camera, getCameras } from '../api/cameras';
import cameraIcon from '../assets/camera.svg'
import arrowIcon from '../assets/arrowRight.svg'

const props = defineProps<{ house: Building }>();
const isOpen = ref(false)
const data = ref<Camera[]>([])

onMounted(() => {
    getCameras(props.house.houseId)
        .then(r => data.value = r)
})

const labelClickHandler = () => {
    isOpen.value = !isOpen.value
}

</script>

<template>
    <div class="cameras__label" v-on:click="labelClickHandler">
        <div class="cameras__icon">
            <img :src="cameraIcon" alt="camera icon">
        </div>
        <div class="cameras__text">Видеокамеры</div>
        <div class="cameras__arrow" aria-hidden="true">
            <img :src="arrowIcon" alt="arrow icon">
        </div>
    </div>
    <div class="cameras__list" v-if="isOpen">
        
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
    }

    &__list {
        padding: 24px;
    }
}
</style>
