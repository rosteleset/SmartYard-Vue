<script setup lang="ts">
import { ref } from "vue";
import Switch from "./Switch.vue";
import { useUserStore } from "../store/user";
import convertSettingsBoolean from "../lib/convertSettingsBoolean";

const { notifications } = useUserStore();

const notificationsEnable = ref(
  notifications.enable && convertSettingsBoolean(notifications.enable)
);
const notificationsMoney = ref(
  notifications.money && convertSettingsBoolean(notifications.money)
);
</script>

<template>
  <div>
    <h2>{{ $t("settings.notifications") }}</h2>
    <div class="settings-block">
      <Switch
        v-model="notificationsEnable"
        :label="$t('settings.show-notifications')"
        justify="space-between"
      />
      <Switch
        v-model="notificationsMoney"
        :label="$t('settings.show-money-notifications')"
        justify="space-between"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.settings-block {
  display: flex;
  flex-direction: column;
  gap: 24px;
  input {
    padding: 12px;
    border: solid 1px #f0f0f1;
    &:focus {
      outline: solid 1px #298bff;
    }
  }
}
</style>