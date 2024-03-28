<script setup lang="ts">
import SettingsDetails from "@/components/SettingsDetails.vue";
import SettingsNotifications from "@/components/SettingsNotifications.vue";
import SettingsOther from "@/components/SettingsOther.vue";


</script>

<template>
  <div class="container">
    <SettingsDetails />
    <SettingsNotifications />
    <SettingsOther />
  </div>
</template>

<style scoped lang="scss">
.container {
  max-width: 600px;
}
</style>
