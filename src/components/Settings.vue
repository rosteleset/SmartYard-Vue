<script setup lang="ts">
import { ref, watch } from "vue";
import sendName from "../api/sendName";
import convertSettingsBoolean from "../lib/convertSettingsBoolean";
import { useUserStore } from "../store/user";
import Button from "./Button.vue";
import Switch from "./Switch.vue";
import { useConfig } from "../store/config";

const { names, notifications } = useUserStore();
const { config, updateConfig } = useConfig();
const isProcessed = ref(false);
const name = ref<string>(names.name);
const patronymic = ref<string>(names.patronymic || "");
const notificationsEnable = ref(
  notifications.enable && convertSettingsBoolean(notifications.enable)
);
const notificationsMoney = ref(
  notifications.money && convertSettingsBoolean(notifications.money)
);

const facesPage = ref(config.facesPage);
const watchmanMode = ref(config.watchmanMode);

const updateNames = async () => {
  isProcessed.value = true;
  await sendName({ name: name.value, patronymic: patronymic.value });
  isProcessed.value = false;
};

watch(facesPage, (value) => {
  updateConfig({ facesPage: value });
});
watch(watchmanMode, (value) => {
  updateConfig({ watchmanMode: value });
});
</script>

<template>
  <div class="container">
    <h2>{{ $t("settings.details") }}</h2>
    <div class="settings-block">
      <input type="text" :placeholder="$t('settings.name')" v-model="name" />
      <input
        type="text"
        :placeholder="$t('settings.patronymic')"
        v-model="patronymic"
      />
      <input type="text" :placeholder="$t('settings.phone')" disabled />
      <Button variant="primary" @click="updateNames" :disabled="isProcessed">{{
        $t("settings.save")
      }}</Button>
    </div>
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
    <h2>Настройки разработки</h2>
    <div class="settings-block">
      <Switch
        v-model="facesPage"
        label="Блок лиц отдельной страницей"
        justify="space-between"
      />
      <Switch
        v-model="watchmanMode"
        label="Режим вахтера"
        justify="space-between"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  max-width: 600px;
}
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
