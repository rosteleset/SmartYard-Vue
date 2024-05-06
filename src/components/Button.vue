<script setup lang="ts">
type Variant = 'primary' | 'success' | 'error'

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
@mixin btn($color:#298BFF) {
  background-color: $color;
  border: solid 1px $color;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 300;
  letter-spacing: 1px;
  text-align: center;
  padding: 6px 24px;
  cursor: pointer;
  transition: .5s ease-out;

  &:disabled {
    background-color: #F3F4FA;
    border-color: #F3F4FA;
    cursor: not-allowed;
  }

  &:not(.button-bordered) {
    color: #ffffff;
  }

  &:hover {
    box-shadow: 0 0 6px 0 $color;
  }
  &:active {
    box-shadow: 0 0 6px 3px $color;
  }
}

.button {
  &-primary {
    @include btn(#298BFF);
  }

  &-error {
    @include btn(#FF3B30);
  }

  &-success {
    @include btn(#1FBC62);
  }

  &-bordered {
    background: transparent;
  }

}
</style>

