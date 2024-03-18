<script setup lang="ts" generic="T extends OptionProps">
import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";

export type OptionProps = {
  id: string | number;
  name: string;
};

const props = defineProps<{
  options: T[];
  allowUndefined?: boolean;
  undefinedText?: string;
}>();

const model = defineModel<T>();
const dropdown = ref<HTMLElement | null>(null);
const dropdownOpen = ref(false);
onClickOutside(dropdown, () => (dropdownOpen.value = false));

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const selectOption = (option?: T) => {
  model.value = option;
  dropdownOpen.value = false;
};
</script>

<template>
  <div class="warp">
    <div
      @click="toggleDropdown"
      class="select-box"
      :class="{ open: dropdownOpen }"
    >
      <span>{{
        model ? model.name : `${$t("select.all")} ${undefinedText || ""}`
      }}</span>
    </div>
    <Transition name="dropdown">
      <div v-if="dropdownOpen" class="dropdown" ref="dropdown">
        <div v-if="allowUndefined" @click="selectOption()">
          <input type="radio" :id="'dropdown-option'" :value="null" />
          <label :for="'dropdown-option'"
            >{{ $t("select.all") }} {{ undefinedText }}</label
          >
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
          <label
            :for="'dropdown-option-' + index"
            :class="{ active: model?.id === option.id }"
            >{{ option.name }}</label
          >
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@use "../style/variables" as *;
.warp {
  position: relative;
  min-width: min-content;
  flex: 1;
}
.select-box {
  border: 1px solid #f0f0f1;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: 0.5s;
  margin: 0;
  /* width: max-content; */

  &.open {
    border-color: #298bff;
    border-radius: 12px 12px 0 0;
    border-bottom-color: #f0f0f1;
  }
}

.dropdown {
  transition: 0.5s;
  position: absolute;
  top: 100%;
  z-index: 10;
  background-color: var(--color-background);
  border: 1px solid #298bff;
  border-radius: 0 0 12px 12px;
  border-top-color: $lightGray;
  margin: 0;
  width: 100%;
  overflow: hidden;
  input {
    display: none;
  }
  label {
    display: block;
    padding: 12px;
    transition: 0.5s;
    &.active {
      background-color: var(--color-accent);
      color: var(--color-text);
    }
    &:hover {
      background-color: #298bff;
      color: #ffffff;
    }
  }
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.5s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
}
</style>
