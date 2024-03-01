<script setup lang="ts">
type Variant = 'primary' | 'sucsses' | 'error'

const props = defineProps<{
    variant: Variant,
    bordered?: boolean,
    disabled?: boolean
}>()

const emit = defineEmits<{
    (e: 'click'): void
}>()

</script>

<template>
    <button class="button" :class="{ 'button-bordered': bordered, [`button-${props.variant}`]: variant }"
        :disabled="props.disabled"
        @click="emit('click')"
        >
        <slot></slot>
    </button>
</template>

<style scoped lang="scss">
.button {
    background-color: #298BFF;
    border: solid 1px #298BFF;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 300;
    letter-spacing: 1px;
    text-align: center;
    padding: 6px 24px;
    cursor: pointer;

    &-primary {
        background-color: #298BFF;
        border-color: #298BFF;
        color: #298BFF;
    }

    &-error {
        background-color: #FF3B30;
        border-color: #FF3B30;
        color: #FF3B30;
    }

    &-sucsses {
        background-color: #1FBC62;
        border-color: #1FBC62;
        color: #1FBC62;
    }

    &-bordered {
        background: transparent;
    }

    &:disabled {
        background-color: #F3F4FA;
        border-color: #F3F4FA;
        cursor: not-allowed;
    }

    &:not(.button-bordered) {
        color: #ffffff;
    }
}
</style>

