<script setup lang="ts">
import {provide} from "vue";

import Cameras from "@/components/Cameras.vue";
import Door from "@/components/Door.vue";
import Events from "@/components/Events.vue";
import {Building} from "@/types/building.ts";
import convertSettingsBoolean from "@/lib/convertSettingsBoolean.ts";

// Определение свойств компонента
const {building} = defineProps<{ building: Building }>();

// Предоставление houseId через инъекцию
// provide("houseId", building.houseId);

</script>

<template>

  <div v-if="building.doors && building.doors.length > 0" class="address__doors">
    <Door v-for="door in building.doors" :key="door.doorId" :data="door"/>
  </div>
  <Cameras :houseId="building.houseId"/>
  <Events v-if="convertSettingsBoolean(building.hasPlog)" :houseId="building.houseId"/>

</template>

<style scoped lang="scss">
@use "@/style/variables" as *;

.address__doors {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $size;
  padding: $size * 2;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
}

</style>
