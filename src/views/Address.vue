<script setup lang="ts">
import {useAddressesStore} from "@/store/addresses";
import Address from "@/components/Address.vue";
import SettingsIcon from "@/assets/settings.svg?component";
import {useRouter} from "vue-router";

// Определение свойств компонента
const {houseId} = defineProps<{ houseId: string }>();

const {getAddressByHouseId} = useAddressesStore();
const router = useRouter();

const building = getAddressByHouseId(houseId);
const settingsOpen = () => {
  router.push(`/settings/${building?.houseId}`);
};
</script>

<template>
  <div v-if="building" class="address">
    <div class="address__header">
      <div class="address__label">{{ building.address }}</div>

      <button @click="settingsOpen">
        <SettingsIcon class="icon"/>
      </button>
    </div>
    <Address :building="building"/>
  </div>
  <div v-else>
    <div class="global-error">{{ $t("addresses.not-found") }}</div>
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

  button {
    cursor: pointer;
    border: 0;
    background: none;
  }
}

.address__label {
  font-size: $size * 2;
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
