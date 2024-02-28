<script setup lang="ts">
import { onMounted } from 'vue';
import Address from './Address.vue'
import { useAdresses } from '../store/addresses';

const { addresses, load } = useAdresses()

onMounted(() => {
  if (addresses.value.length === 0)
    load()
})

</script>

<template>
  <div class="container">
    <h1>{{ $t('addresses.label') }}</h1>
    <Address v-for="item in addresses" :key="item.houseId" :data="item" />
  </div>
</template>

<style scoped></style>
