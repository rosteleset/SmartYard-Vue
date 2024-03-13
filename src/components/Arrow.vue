<script setup lang="ts">
const emit = defineEmits(["click"]);
</script>

<template>
  <svg class="arrow-svg" viewbox="0 0 60 40" @click="emit('click')">
    <g
      stroke="#fff"
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path id="middle-line" d="M10,20 L50,20 Z"></path>
      <path id="arrow-line" d=" M20,30 L10,20 L20,10" fill="transparent"></path>
    </g>
  </svg>
</template>

<style scoped lang="scss">
.arrow-svg {
  width: 60px;
  height: 40px;
  cursor: pointer;
}
#arrow-line,
#middle-line {
  transform-box: fill-box;
  transform-origin: center;
}
</style>
