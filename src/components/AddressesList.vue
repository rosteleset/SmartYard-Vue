<script setup lang="ts">
import { useAdressesStore } from "../store/addresses";
import Address from "./Address.vue";

const adressesStore = useAdressesStore();
</script>

<template>
  <Address
    v-for="item in adressesStore.addresses"
    :key="item.houseId"
    :houseId="item.houseId"
  />
</template>

<style scoped></style>
