<script setup lang="ts">
import Address from './Address.vue'
import { useAdressesStore } from '../store/addresses';

const adressesStore = useAdressesStore()

</script>

<template>
  <div class="container">
    <h1>{{ $t('addresses.label') }}</h1>
    <Address v-for="item in adressesStore.addresses" :key="item.houseId" :building="item" />
  </div>
</template>

<style scoped></style>
../stores/addresses