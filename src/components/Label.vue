<script setup lang="ts">
import { VueElement, ref } from 'vue';
import ArrowIcon from '../assets/arrowRight.svg?component'

const props = defineProps({
  icon: VueElement,
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
      <icon/>
    </div>
    <div class="text">{{ props.text }}</div>
    <div class="arrow" :class="{ open: isOpen }" aria-hidden="true">
      <ArrowIcon />
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
    svg {
      fill: var(--color-text);
    }
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
  