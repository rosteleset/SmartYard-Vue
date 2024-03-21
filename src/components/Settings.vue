<script setup lang="ts">
import SettingsDetails from "./SettingsDetails.vue";
import SettingsNotifications from "./SettingsNotifications.vue";
import SettingsOther from "./SettingsOther.vue";


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
