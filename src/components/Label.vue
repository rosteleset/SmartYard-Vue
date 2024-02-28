<script setup lang="ts">
import { ref } from 'vue';
import arrowIcon from '../assets/arrowRight.svg'

const props = defineProps({
  icon: String,
  alt: String,
  text: String
});

const emit = defineEmits(['toggle']);
const isOpen = ref(false);

const labelClickHandler = () => {
  isOpen.value = !isOpen.value;
  emit('toggle', isOpen.value);
};

</script>

<template>
  <div class="label" v-on:click="labelClickHandler">
    <div class="icon">
      <img :src="props.icon" :alt="props.alt">
    </div>
    <div class="text">{{ props.text }}</div>
    <div class="arrow" :class="{ open: isOpen }" aria-hidden="true">
      <img :src="arrowIcon" alt="arrow icon">
    </div>
  </div>
</template>
  
<style scoped lang="scss">
.label {
  display: flex;
  align-items: center;
  gap: 24px;
  border-top: solid 1px #F0F0F1;
  padding: 24px;
  cursor: pointer;

  .icon {
    width: 30px;
  }

  .arrow {
    margin-left: auto;
    transform: rotateZ(90deg);
    transition: .3s;

    &.open {
      transform: rotateZ(-90deg);
    }
  }
}
</style>
  