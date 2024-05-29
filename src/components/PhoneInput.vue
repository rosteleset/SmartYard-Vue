<script setup lang="ts">
import {defineEmits, defineProps, ref, watch} from 'vue';

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

const replace = (value: string) => {
  let result = value.replace(/\D/g, ''); // Удалить все, кроме цифр
  result = result.slice(0, 11); // Ограничить количество символов 11 цифрами
  return result;
}

const applyMask = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  phone.value = formatPhone(value);
  emit('update:modelValue', replace(phone.value));
};

const formatPhone = (value: string) => {
  let result = replace(value);

  // Применить маску +7 (###) ###-##-##
  if (result.length > 1) {
    if (result.startsWith('8')) {
      result = '7' + result.slice(1);
    }
    if (result.length === 2 && result[0] !== '7')
      result = '+7 ' + result;
    else
      result = '+7 ' + result.slice(1);
  }
  if (result.length > 3) {
    result = result.slice(0, 2) + ' (' + result.slice(3);
  }
  if (result.length > 7) {
    result = result.slice(0, 7) + ') ' + result.slice(7);
  }
  if (result.length > 12) {
    result = result.slice(0, 12) + '-' + result.slice(12);
  }
  if (result.length > 15) {
    result = result.slice(0, 15) + '-' + result.slice(15);
  }

  return result
}

const phone = ref(formatPhone(props.modelValue));

watch(props, (newValue) => {
  if (replace(newValue.modelValue) !== replace(phone.value)) {
    const formatedValue = formatPhone(newValue.modelValue)
    phone.value = formatedValue;
    emit('update:modelValue', replace(formatedValue));
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
