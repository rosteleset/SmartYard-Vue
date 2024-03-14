<script setup lang="ts">
import { computed, provide, ref } from "vue";
import arrowIcon from "../assets/ArrowBottom.svg";
import settingsIcon from "../assets/settings.svg";
import { useAddressesStore } from "../store/addresses";
import AddressSettings from "./AddressSettings.vue";
import Cameras from "./Cameras.vue";
import Door from "./Door.vue";
import Events from "./Events.vue";
import Modal from "./Modal.vue";
import Tabs from "./Tabs.vue";
import { useLocale } from "../hooks/locale";

// Определение свойств компонента
const { houseId } = defineProps<{ houseId: string }>();

// Предоставление houseId через инъекцию
provide("houseId", houseId);

// Использование хранилища адресов и пользователей
const { getAddressByHouseId, getClientsByHouseId } = useAddressesStore();
const { t } = useLocale();

// Получение данных о здании и клиентах
const building = getAddressByHouseId(houseId);
const clients = getClientsByHouseId(houseId);

// Состояния открытости окон
const isOpen = ref(true);
const isSettingsOpen = ref(false);

// Функции для управления открытостью окон
const toggleOpen = (status: boolean) => {
  isOpen.value = status;
};

const toggleSettingsOpen = () => {
  isSettingsOpen.value = !isSettingsOpen.value;
};

// Вычисляемое свойство для добавления заголовков клиентов
const clientsWithTitles = computed(() =>
  clients.value.map((client) => ({
    tabId: client.flatId,
    tabTitle: t("addresses.flat", [client.flatId]),
  }))
);
</script>

<template>
  <div v-if="building" class="address" :class="{ 'address--open': isOpen }">
    <div class="address__header" @click="toggleOpen(true)">
      <div class="address__label">{{ building.address }}</div>
      <div class="address__buttons" @click.stop>
        <button @click="toggleSettingsOpen">
          <img :src="settingsIcon" alt="$t('addresses.settings')" />
        </button>
        <button class="address__more" @click="toggleOpen(!isOpen)">
          <img
            :src="arrowIcon"
            alt="$t('global.more')"
            :class="{ 'address__more--open': isOpen }"
          />
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
    <Modal
      :title="$t('settings.title')"
      :is-open="isSettingsOpen"
      @on-close="toggleSettingsOpen"
    >
      <Tabs :tabs="clientsWithTitles">
        <template
          v-for="client in clientsWithTitles"
          v-slot:[client.tabId]
          :key="client.tabId"
        >
          <AddressSettings :flat-id="client.tabId" @test="toggleSettingsOpen" />
        </template>
      </Tabs>
    </Modal>
  </div>
  <div v-else>
    <div class="global-error">{{ $t("addresses.not-found") }}</div>
  </div>
</template>

<style scoped lang="scss">
.address {
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 24px;
}

.address__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  cursor: pointer;
}

.address--open .address__header {
  cursor: unset;
}

.address__label {
  font-size: 20px;
}

.address__buttons {
  display: flex;
  gap: 12px;

  button {
    cursor: pointer;
    border: 0;
    background: none;
  }
}

.address__more img {
  display: block;
  transition: 0.3s;

  &.address__more--open {
    transform: rotateX(180deg);
  }
}

.address__doors {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
