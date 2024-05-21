<script setup lang="ts">
import {ref, watch, defineProps, defineEmits} from 'vue';

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

const phone = ref(props.modelValue);

const replace = (value: string) => {
  let result = value.replace(/\D/g, ''); // Удалить все, кроме цифр
  result = result.slice(0, 11); // Ограничить количество символов 11 цифрами
  return result;
}

const applyMask = (event: Event) => {
  let value = (event.target as HTMLInputElement).value;

  value = replace(value);
  // Если первая цифра 8, заменить на 7


  // Применить маску +7 (###) ###-##-##
  if (value.length > 1) {
    if (value.startsWith('8')) {
      value = '7' + value.slice(1);
    }
    if (value.length === 2 && value[0] !== '7')
      value = '+7 ' + value;
    else
      value = '+7 ' + value.slice(1);
  }
  if (value.length > 3) {
    value = value.slice(0, 3) + ' (' + value.slice(3);
  }
  if (value.length > 8) {
    value = value.slice(0, 8) + ') ' + value.slice(8);
  }
  if (value.length > 13) {
    value = value.slice(0, 13) + '-' + value.slice(13);
  }
  if (value.length > 16) {
    value = value.slice(0, 16) + '-' + value.slice(16);
  }

  phone.value = value;
  emit('update:modelValue', replace(value));
};

watch(() => props.modelValue, (newValue) => {
  if (replace(newValue) !== replace(phone.value)) {
    phone.value = newValue;
  }
});
</script>

<template>
    <input
        v-model="phone"
        @input="applyMask"
        placeholder="+7 (XXX) XXX-XX-XX"
        v-bind="props"
    />
</template>

<style scoped lang="scss">
</style>
