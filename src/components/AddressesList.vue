<script setup lang="ts">
import { useAddressesStore } from "@/store/addresses";
import Address from "@/components/Address.vue";

const { addresses } = useAddressesStore();
</script>

<template>
  <Address
    v-for="item in addresses"
    :key="item.houseId"
    :houseId="item.houseId"
  />
</template>

<style scoped></style>
