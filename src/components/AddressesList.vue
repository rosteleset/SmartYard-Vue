<script setup lang="ts">
import {useAddressesStore} from "@/store/addresses";
import AddressesListItem from "@/components/AddressesListItem.vue";

const { addresses } = useAddressesStore();
</script>

<template>
  <AddressesListItem
    v-for="item in addresses"
    :key="item.houseId"
    :building="item"
  />
</template>

<style scoped></style>
