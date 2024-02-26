<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getAddresses } from '../api/addresses';
import { Building } from '../api/addresses'
import Address from './Address.vue'

const data = ref<Building[]>([])

onMounted(() => {
  getAddresses()
    .then(r => data.value = r)
})

</script>

<template>
  <div class="container">
    <h1>Адреса</h1>
    <Address v-for="item in data" :key="item.houseId" :data="item" />
  </div>
</template>

<style scoped></style>
