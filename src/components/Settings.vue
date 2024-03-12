<script setup lang="ts">
import { computed, ref, watch } from "vue";
import sendName from "../api/sendName";
import convertSettingsBoolean from "../lib/convertSettingsBoolean";
import { useConfig } from "../store/config";
import { useUserStore } from "../store/user";
import Button from "./Button.vue";
import Select from "./Select.vue";
import Switch from "./Switch.vue";
import { useLocale } from "../hooks/locale";

const { names, notifications } = useUserStore();
const { config, updateConfig } = useConfig();
const { availableLocales, locale, changeLocale, t } = useLocale();
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

const localeToOption = (locale: string): { id: string; name: string } => {
  return {
    id: locale,
    name: t(`locales.${locale}`),
  };
};

const localeHandler = (option: { id: string; name: string }) => {
  changeLocale(option.id);
};

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
    <h2>{{ $t("settings.other") }}</h2>
    <div class="settings-block">
      <Select
        :options="availableLocales.map((locale) => localeToOption(locale))"
        :modelValue="localeToOption(locale)"
        @update:modelValue="localeHandler"
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
</style>../hooks/locale
