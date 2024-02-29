<script setup lang="ts">
import { ref } from 'vue';
import { useCameras } from '../store/cameras';
import Label from './Label.vue';
import Video from './Video.vue';
import { Building } from '../types/building';
import cameraIcon from '../assets/camera.svg';

const props = defineProps<{ house: Building }>();
const isOpen = ref(false);

const { cameras } = useCameras(props.house.houseId);

const handleToggle = (open: boolean) => {
    isOpen.value = open;
};

</script>

<template>
    <Label :icon="cameraIcon" alt="camera icon" :text="$t('addresses.cameras')" @toggle="handleToggle" />
    <div class="cameras__list" v-if="isOpen">
        <Video v-for="camera in cameras" :key="camera.id" :camera="camera" />
    </div>
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