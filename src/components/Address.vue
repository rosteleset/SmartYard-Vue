<script setup lang="ts">
import Door from './Door.vue';
import Cameras from './Cameras.vue';
import { Building } from '../types/building';
import Events from './Events.vue';
import { useUserStore } from '../store/user';
import { ref, watch } from 'vue';
import getSettingsByBuilding from '../lib/getSettingsByBuilding'

const props = defineProps<{ building: Building }>();
const { doors } = props.building
const userStore = useUserStore()
const flatId = ref<string>()

watch(userStore, () => {
  flatId.value = getSettingsByBuilding(props.building)?.flatId
})

</script>

<template>
  <div class="address">
    <div class="address__label">{{ props.building.address }}</div>
    <Door v-for="item in doors" :key="item.doorId" :data="item" />
    <Cameras :house="props.building" />
    <Events v-if="flatId" :house="props.building" :flat-id="flatId" />
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
../stores/user