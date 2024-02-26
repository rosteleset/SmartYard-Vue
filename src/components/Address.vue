<script setup lang="ts">
import { Building } from '../api/addresses';
import Door from './Door.vue';
import Cameras from './Cameras.vue';

const props = defineProps<{ data: Building }>();

const { doors } = props.data

</script>

<template>
  <div class="address">
    <div class="address__label">{{ props.data.address }}</div>
    <Door v-for="item in doors" :key="item.doorId" :data="item" />
    <Cameras :house="props.data"/>
  </div>
</template>

<style scoped lang="scss">
.address {
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 24px;

  &__label {
    padding: 24px;
  }
}
</style>
