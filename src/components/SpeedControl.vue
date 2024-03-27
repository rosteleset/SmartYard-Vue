<script setup lang="ts">
interface Option {
  id: number;
  name: string;
}

const { videoElement } = defineProps<{
  videoElement: HTMLVideoElement;
}>();
import { ref } from "vue";
import Select from "./Select.vue";
import { watch } from "vue";

const options = [
  { id: 1, name: "1" },
  { id: 1.5, name: "1.5" },
  { id: 2, name: "2" },
  { id: 10, name: "10" },
];
const speed = ref<Option>(options[0]);

const updateSpeed = (option: Option) => {
  speed.value = option;
};
watch(speed, () => {
  videoElement.playbackRate = speed.value.id;
});
</script>
<template>
  <Select
    class="settings"
    :allowUndefined="false"
    :options="options"
    v-model:modelValue="speed"
    @update:modelValue="updateSpeed"
  />
</template>
<style scoped lang="scss">
.settings {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  text-align: center;
  background-color: var(--color-background);
  border-radius: 12px 12px 0 0;
  opacity: 0.5;
  transition: 1s;
  z-index: 3;
  &:hover {
    opacity: 1;
  }
}
</style>
