<script setup lang="ts">
import Address from "@/components/Address.vue";
import ArrowIcon from "@/assets/ArrowBottom.svg?component";
import SettingsIcon from "@/assets/settings.svg?component";
import {ref} from "vue";
import {Building} from "@/types/building.ts";
import {useRouter} from "vue-router";

const {building} = defineProps<{ building: Building }>()
const router = useRouter();

const isOpen = ref(true);

// Функции для управления открытостью окон
const toggleOpen = (status: boolean) => {
  isOpen.value = status;
};

const settingsOpen = () => {
  router.push(`/settings/${building.houseId}`);
};
</script>

<template>
  <div class="address">
    <div class="address__header" @click="toggleOpen(true)">
      <div class="address__label">{{ building.address }}</div>
      <div class="address__buttons" @click.stop>
        <button @click="settingsOpen">
          <SettingsIcon class="icon"/>
        </button>
        <button class="address__more" @click="toggleOpen(!isOpen)">
          <ArrowIcon class="icon" :class="{ 'address__more--open': isOpen }"/>
        </button>
      </div>
    </div>
    <div v-if="isOpen">
      <Address :building/>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/style/variables" as *;

.address {
  background-color: var(--color-second-background);
  @include rounded();
  margin-bottom: $size * 2;
}

.address__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $size * 2;
  cursor: pointer;
}

.address--open .address__header {
  cursor: unset;
}

.address__label {
  font-size: $size * 2;
}

.address__buttons {
  display: flex;
  gap: $size;

  button {
    cursor: pointer;
    border: 0;
    background: none;
  }
}
.icon {
  display: block;
  min-width: 20px;
  fill: var(--color-text);
  transition: 0.3s;

  &.address__more--open {
    transform: rotateX(180deg);
  }
}
</style>
