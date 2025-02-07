<script setup lang="ts">
import { FunctionalComponent, computed } from "vue";
import openDoor from "@/lib/openDoor";
import barrierIcon from "@/assets/barrier.svg?component";
import entranceIcon from "@/assets/entrance.svg?component";
import gateIcon from "@/assets/gate.svg?component";
import { Domophone } from "@/types/domophone";

const props = defineProps<{ data: Domophone }>();

const iconMap: Record<Domophone["icon"], FunctionalComponent> = {
  entrance: entranceIcon,
  wicket: gateIcon,
  gate: gateIcon,
  barrier: barrierIcon,
};

const Icon = computed(() => iconMap[props.data.icon]);

const handlerOpen = () => {
  console.log(props.data);
  
  openDoor(props.data.domophoneId, props.data.doorId);
};
</script>

<template>
  <div class="door">
    <div class="door__icon">
      <Icon class="icon" />
    </div>
    <div class="door__label">{{ props.data.name }}</div>
    <button @click="handlerOpen">{{ $t("addresses.open") }}</button>
  </div>
</template>

<style scoped lang="scss">
.door {
  display: grid;
  grid-template-areas: "icon label" "button button";
  gap: 24px;
  border: solid 1px #f0f0f1;
  border-radius: 12px;
  padding: 24px;

  &__icon {
    grid-area: icon;
  }

  &__label {
    grid-area: label;
    font-size: 18px;
  }

  button {
    grid-area: button;
    width: 100%;
    font-size: 14px;
    color: #298bff;
    background-color: transparent;
    border: 1px solid #298bff;
    border-radius: 8px;
    padding: 6px;
    margin-left: auto;
    transition: 0.3s;
    cursor: pointer;

    &:hover {
      background-color: #298bff;
      color: #ffffff;
    }
  }
}

.icon {
  fill: var(--color-text);
}
</style>
