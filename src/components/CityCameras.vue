<script setup lang="ts">
import { useCameras } from "../hooks/cameras";
import Map from "./Map.vue";
import Video from "./Video.vue";

const { cameras } = useCameras({ overview: true });
</script>
<template>
  <div class="container">
    <h1>cameras</h1>
    <Map v-if="cameras.length > 0" :cameras="cameras"/>
    <div class="grid">
      <Video v-for="camera in cameras" :key="camera.id" :camera="camera" :index="cameras.indexOf(camera) + 1" />
    </div>
  </div>
</template>
<style scoped lang="scss">
.grid {
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
