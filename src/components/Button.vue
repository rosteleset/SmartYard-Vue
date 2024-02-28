<script setup lang="ts">
type Variant = 'primary' | 'sucsses' | 'error'

const props = defineProps<{
    variant: Variant,
    bordered?: boolean,
    disabled?: boolean
}>()

</script>

<template>
    <button class="button" :class="{'button-bordered': bordered, [`button-${props.variant}`]: variant}" :disabled="props.disabled">
    <slot></slot>
</button>
</template>

<style scoped lang="scss">
.button {
    background-color: #298BFF;
    border: solid 1px #298BFF;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    padding: 12px 24px;

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
    }

    &:not(.button-bordered) {
        color: #ffffff;
    }
}
</style>

