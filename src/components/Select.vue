<script setup lang="ts" generic="T extends OptionProps">
import { ref, computed } from 'vue';

export type OptionProps = {
    id: string | number;
    name: string;
};

const props = defineProps<{
    options: T[];
    modelValue: T | null;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: T | null];
}>();

const proxy = computed({
    get() {
        return props.modelValue;
    },
    set(value: T | null) {
        emit("update:modelValue", value);
    },
});

const dropdownOpen = ref(false);

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value;
};

const selectOption = (option: T) => {
    proxy.value = option;
    // dropdownOpen.value = false;
};

const handleOutsideClick = (event: MouseEvent) => {
    if (!event.target) {
        dropdownOpen.value = false;
    }
};
</script>

<template>
    <div>
        <div @click="toggleDropdown" class="select-box">
            <span>{{ proxy ? proxy.name : 'Все' }}</span>
        </div>
        <div v-if="dropdownOpen" @click="handleOutsideClick" class="dropdown">
            <div v-for="(option, index) in props.options" :key="index" @click="selectOption(option)">
                <input type="radio" :id="'dropdown-option-' + index" :value="option" v-model="proxy">
                <label :for="'dropdown-option-' + index">{{ option.name }}</label>
            </div>
        </div>
    </div>
</template>

<style scoped>
.select-box {
    border: 1px solid #ccc;
    padding: 10px;
    cursor: pointer;
}

.dropdown {
    border: 1px solid #ccc;
    padding: 10px;
}
</style>
