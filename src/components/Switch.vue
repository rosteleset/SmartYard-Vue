<script setup lang="ts">
const { label, initialValue } = defineProps<{
  label?: string;
  initialValue: boolean;
}>();

const handleChange = (value: boolean) => {
  emit("update:modelValue", value);
};

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();
</script>

<template>
  <div class="toggle-switch__container">
    <div v-if="label" class="toggle-switch__label">{{ label }}</div>
    <label
      class="toggle-switch"
      :class="{ 'toggle-switch--checked': initialValue }"
    >
      <input
        type="checkbox"
        :checked="initialValue"
        @change="handleChange(!initialValue)"
      />
      <span class="toggle-switch__slider"></span>
    </label>
  </div>
</template>

<style scoped lang="scss">
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;

  input {
    display: none;
  }

  &__container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  &__label {
  }

  &__slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 34px;

    &:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }
  }

  &--checked {
    .toggle-switch {
      &__slider {
        background-color: #2196f3;

        &:before {
          transform: translateX(26px);
        }
      }
    }
  }
}
</style>
