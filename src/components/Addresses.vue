<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getAddresses } from '../api/addresses';
import { Building } from '../api/addresses'

const data = ref<Building[]>([])

onMounted(() => {
  getAddresses()
    .then(r => data.value = r)
})

</script>

<template>
  <h1>Адреса</h1>
  <ul>
    <li v-for="item in data">{{ item.address }}</li>
  </ul>
</template>

<style scoped></style>
