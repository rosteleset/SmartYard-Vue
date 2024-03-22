<script setup lang="ts">
import { provide, ref } from "vue";
import ArrowIcon from "../assets/ArrowBottom.svg?component";
import SettingsIcon from "../assets/settings.svg?component";
import { useAddressesStore } from "../store/addresses";
import Cameras from "./Cameras.vue";
import Door from "./Door.vue";
import Events from "./Events.vue";
import { useRouter } from "vue-router";

// Определение свойств компонента
const { houseId } = defineProps<{ houseId: string }>();

// Предоставление houseId через инъекцию
provide("houseId", houseId);

// Использование хранилища адресов и пользователей
const { getAddressByHouseId } = useAddressesStore();
const router = useRouter();

// Получение данных о зданиях
const building = getAddressByHouseId(houseId);

// Состояния открытости окон
const isOpen = ref(true);

// Функции для управления открытостью окон
const toggleOpen = (status: boolean) => {
  isOpen.value = status;
};

const settingsOpen = () => {
  router.push(`/settings/${houseId}`);
};
</script>

<template>
  <div v-if="building" class="address" :class="{ 'address--open': isOpen }">
    <div class="address__header" @click="toggleOpen(true)">
      <div class="address__label">{{ building.address }}</div>
      <div class="address__buttons" @click.stop>
        <button @click="settingsOpen">
          <SettingsIcon class="icon" />
        </button>
        <button class="address__more" @click="toggleOpen(!isOpen)">
          <ArrowIcon class="icon" :class="{ 'address__more--open': isOpen }" />
        </button>
      </div>
    </div>
    <div v-if="isOpen">
      <div class="address__doors">
        <Door v-for="door in building.doors" :key="door.doorId" :data="door" />
      </div>
      <Cameras :houseId="houseId" compact />
      <Events :houseId="houseId" compact />
    </div>
  </div>
  <div v-else>
    <div class="global-error">{{ $t("addresses.not-found") }}</div>
  </div>
</template>

<style scoped lang="scss">
@use "../style/variables" as *;
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

.address__doors {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $size;
  padding: $size * 2;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
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
