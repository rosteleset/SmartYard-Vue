<script setup lang="ts">
import FacesListItem from "@/components/FacesListItem.vue";
import { Face } from "@/types/faces";

const { faces } = defineProps<{
  faces: Face[];
}>();
</script>
<template>
  <div class="list">
    <FacesListItem v-for="face in faces" :key="face.faceId" :face="face" />
    <FacesListItem />
  </div>
</template>
<style scoped lang="scss">
.list {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
