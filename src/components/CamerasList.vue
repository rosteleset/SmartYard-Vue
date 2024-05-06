<script setup lang="ts">
import {Camera} from "@/types/camera.ts";
import {useConfigStore} from "@/store/config.ts";
import {computed} from "vue";
import Video from "@/components/VideoCard.vue";

const {cameras} = defineProps<{ cameras: Camera[] }>()
const {config} = useConfigStore();

const columns = computed<number>(() => config["columnsCount"] || 4);
</script>
<template>
  <div class="cameras__list">
    <Video
        v-for="camera in cameras"
        :key="camera.id"
        :camera="camera"
        :index="cameras.indexOf(camera) + 1"
    />
  </div>
</template>

<style lang="scss" scoped>
.cameras {
  &__list {
    padding: 24px;
    display: grid;
    grid-template-columns: repeat(v-bind(columns), 1fr);
    gap: 12px;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(v-bind(columns/2), 1fr);
    }

    @media (max-width: 480px) {
      grid-template-columns: repeat(v-bind(columns/4), 1fr);
    }
  }
}
</style>