<script setup lang="ts">
import Door from './Door.vue';
import Cameras from './Cameras.vue';
import Events from './Events.vue';
import { ref } from 'vue';
import arrowIcon from '../assets/ArrowBottom.svg'
import settingsIcon from '../assets/settings.svg'
import Modal from './Modal.vue';
import AddressSettings from './AddressSettings.vue'
import { useAdressesStore } from '../store/addresses';
import { provide } from 'vue';
import { useUserStore } from '../store/user';

const { houseId } = defineProps<{ houseId: string }>();
provide('houseId', houseId)
const { getAdressByHouseId, getClientsByHouseId } = useAdressesStore()
const userStore = useUserStore()
const building = getAdressByHouseId(houseId)
const clients = getClientsByHouseId(houseId)
const isOpen = ref(true)
const isSettingsOpen = ref(false)


const handlerOpen = (status: boolean) => {
  isOpen.value = status
}

const toggleSettingsOpen = () => {
  isSettingsOpen.value = !isSettingsOpen.value
}


</script>

<template>
  <div class="address">
    <div class="address__header" :class="{ open: isOpen }" @click="handlerOpen(true)">
      <div class="address__label">{{ building.address }}</div>
      <div class="address__buttons" @click.stop>
        <button @click="toggleSettingsOpen">
          <img :src="settingsIcon" alt="settings">
        </button>
        <button class="address__more" :class="{ open: isOpen }" @click="handlerOpen(!isOpen)">
          <img :src="arrowIcon" alt="">
        </button>
      </div>
    </div>
    <div v-if="isOpen">
      <div class="address__doors">
        <Door v-for="item in building.doors" :key="item.doorId" :data="item" />
      </div>
      <Cameras />
      <Events v-if="userStore.isLoaded" />
    </div>
  </div>
  <Modal :title="$t('settings.title')" :is-open="isSettingsOpen" @on-close="toggleSettingsOpen">
    <div style="display: flex;">
      <AddressSettings v-if="userStore.isLoaded" v-for="client of clients" :flat-id="client.flatId" />
    </div>
  </Modal>
</template>

<style scoped lang="scss">
.address {
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 24px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px;
    cursor: pointer;

    &.open {
      cursor: unset;
    }
  }

  &__label {
    font-size: 20px;

  }

  &__buttons {
    display: flex;
    gap: 12px;

    button {
      cursor: pointer;
      border: 0;
      background: none;
    }
  }

  &__more {
    img {
      display: block;
      transition: .3s;
    }

    &.open {
      img {
        transform: rotateX(180deg);
      }
    }
  }

  &__doors {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding: 24px;

    @media (max-width:1024px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width:480px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
</style>