<script setup lang="ts">
import AddressSettings from "@/components/AddressSettings.vue";
import Settings from "@/components/Settings.vue";

const {houseId} = defineProps<{ houseId?: string }>();

</script>

<template>
  <AddressSettings v-if="houseId" :houseId="houseId"/>
  <Settings v-else/>
</template>