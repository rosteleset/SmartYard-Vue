<script setup lang="ts">
import Door from './Door.vue';
import Cameras from './Cameras.vue';
import { Building } from '../types/building';
import Events from './Events.vue';
import { ref } from 'vue';
import getClientByBuilding from '../lib/getClientByBuilding'
import arrowIcon from '../assets/ArrowBottom.svg'
import settingsIcon from '../assets/settings.svg'
import Modal from './Modal.vue';
import AddressSettings from './AddressSettings.vue'
import { computed } from 'vue';

const props = defineProps<{ building: Building }>();
const { doors } = props.building
const settings = getClientByBuilding(props.building)
const flatId = computed<string | undefined>(() => settings.value?.flatId)
const isOpen = ref(true)
const isSettingsOpen = ref(false)

const handlerOpen = () => {
  isOpen.value = true
}

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const toggleSettingsOpen = () => {
  isSettingsOpen.value = !isSettingsOpen.value
}


</script>

<template>
  <div class="address">
    <div class="address__header" :class="{ open: isOpen }" @click="handlerOpen">
      <div class="address__label">{{ props.building.address }}</div>
      <div class="address__buttons" @click.stop>
        <button @click="toggleSettingsOpen">
          <img :src="settingsIcon" alt="settings">
        </button>
        <button class="address__more" :class="{ open: isOpen }" @click="toggleOpen">
          <img :src="arrowIcon" alt="">
        </button>
      </div>
    </div>
    <div v-if="isOpen">
      <div class="address__doors">
        <Door v-for="item in doors" :key="item.doorId" :data="item" />
      </div>
      <Cameras :house="props.building" />
      <Events v-if="flatId" :house="props.building" :flat-id="flatId" />
    </div>
  </div>
  <Modal :title="$t('settings.title')" :is-open="isSettingsOpen" @on-close="toggleSettingsOpen">
    <AddressSettings v-if="flatId" :flat-id="flatId" />
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
</style>../lib/getClientByBuilding