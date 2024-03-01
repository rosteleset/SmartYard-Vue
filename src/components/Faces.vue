<script setup lang="ts">
import { Building } from '../types/building';
import Events from './Events.vue';

const {} = defineProps<{
    house: Building,
    flatId: string
}>()

</script>
<template>
    <Events :house="house" :flat-id="flatId" />
</template>
<style scoped lang="scss"></style>