<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';
import { vMaska } from 'maska/vue';

const props = defineProps<{ modelValue: string, mask: string }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();


const onInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const unmaskedValue = input.value.replace(/\D/g, '');
  emit('update:modelValue', unmaskedValue);
};
</script>

<template>
  <input v-model="props.modelValue" v-maska="mask" @input="onInput" :placeholder="mask" class="phone-input" />
</template>

<style scoped lang="scss">
.phone-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  font-size: 16px;
}
</style>