<script setup lang="ts">
import { inject, ref } from 'vue';
import cameraIcon from '../assets/camera.svg';
import { useCameras } from '../store/cameras';
import Label from './Label.vue';
import Map from './Map.vue';
import Video from './Video.vue';

const houseId = inject<string>('houseId')
const isOpen = ref(false);

if (houseId === undefined)
    throw new Error("not find houseId");

const { cameras } = useCameras({houseId});

const handleToggle = (open: boolean) => {
    isOpen.value = open;
};

</script>

<template>
    <Label :icon="cameraIcon" alt="camera icon" :text="$t('addresses.cameras')" @toggle="handleToggle" />
    <div class="cameras__list" v-if="isOpen">
        <Video v-for="camera in cameras" :key="camera.id" :camera="camera" :index="cameras.indexOf(camera) + 1" />
    </div>
    <Map v-if="isOpen" :cameras="cameras" />
    
</template>
  
<style scoped lang="scss">
.cameras {
    &__list {
        padding: 24px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;

        @media (max-width:1024px) {
            grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width:480px) {
            grid-template-columns: repeat(1, 1fr);
        }
    }
}
</style>