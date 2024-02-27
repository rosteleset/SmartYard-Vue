<script setup lang="ts">
import Door from './Door.vue';
import Cameras from './Cameras.vue';
import { Building } from '../types/building';
import Events from './Events.vue';
import { useUser } from '../store/user';
import { ref, watch } from 'vue';

const props = defineProps<{ data: Building }>();
const { doors } = props.data
const { settings } = useUser()
const flatId = ref<number>()

watch(settings, () => {
  flatId.value = settings.value.find(s => s.houseId === props.data.houseId)?.flatId
})

</script>

<template>
  <div class="address">
    <div class="address__label">{{ props.data.address }}</div>
    <Door v-for="item in doors" :key="item.doorId" :data="item" />
    <Cameras :house="props.data" />
    <Events v-if="flatId" :house="props.data" :flat-id="flatId" />
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
