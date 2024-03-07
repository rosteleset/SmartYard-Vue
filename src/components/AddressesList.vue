<script setup lang="ts">
import { useAdressesStore } from '../store/addresses';
import Address from './Address.vue';

const adressesStore = useAdressesStore()

</script>

<template>
    <h1>{{ $t('addresses.label') }}</h1>
    <Address v-for="item in adressesStore.addresses" :key="item.houseId" :houseId="item.houseId" />

</template>

<style scoped></style>
