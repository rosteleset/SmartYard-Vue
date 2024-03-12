<script setup lang="ts" generic="T extends OptionProps">
import { ref } from "vue";

export type OptionProps = {
  id: string | number;
  name: string;
};

const props = defineProps<{
  options: T[];
  allowUndefined?: boolean;
}>();

const model = defineModel<T>();

const dropdownOpen = ref(false);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const selectOption = (option?: T) => {
  model.value = option;
  dropdownOpen.value = false;
};

const handleOutsideClick = (event: MouseEvent) => {
  if (!event.target) {
    dropdownOpen.value = false;
  }
};
</script>

<template>
  <div>
    <div
      @click="toggleDropdown"
      class="select-box"
      :class="{ open: dropdownOpen }"
    >
      <span>{{ model ? model.name : $t("select.all") }}</span>
    </div>
    <div v-if="dropdownOpen" @click="handleOutsideClick" class="dropdown">
      <div v-if="allowUndefined" @click="selectOption()">
        <input type="radio" :id="'dropdown-option'" :value="null" />
        <label :for="'dropdown-option'">{{ $t("select.all") }}</label>
      </div>
      <div
        v-for="(option, index) in props.options"
        :key="index"
        @click="selectOption(option)"
      >
        <input
          type="radio"
          :id="'dropdown-option-' + index"
          :value="option"
          v-model="model"
        />
        <label :for="'dropdown-option-' + index">{{ option.name }}</label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.select-box {
  border: 1px solid #f0f0f1;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  width: max-content;

  &.open {
    border-color: transparent;
  }
}

.dropdown {
  position: absolute;
  background-color: #ffffff;
  border: 1px solid #f0f0f1;
  border-radius: 12px;
  padding: 10px;
  width: max-content;
}
</style>
