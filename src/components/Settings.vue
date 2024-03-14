<script setup lang="ts">
import { computed, ref, watch } from "vue";
import sendName from "../api/sendName";
import { useLocale } from "../hooks/locale";
import convertSettingsBoolean from "../lib/convertSettingsBoolean";
import { useConfigStore } from "../store/config";
import { useUserStore } from "../store/user";
import Button from "./Button.vue";
import Select from "./Select.vue";
import Switch from "./Switch.vue";

const columnsOptions = [1, 2, 3, 4];
// Стейты
const { names, notifications } = useUserStore();
const { config, updateConfig } = useConfigStore();
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

const columnsCount = computed(() =>
  config["columnsCount"]
    ? { id: config["columnsCount"], name: config["columnsCount"].toString() }
    : undefined
);

//  Получение опции для Select из локали
const localeToOption = (locale: string): { id: string; name: string } => {
  return {
    id: locale,
    name: t(`locales.${locale}`),
  };
};
// изменени локали
const localeHandler = (option: { id: string; name: string }) => {
  changeLocale(option.id);
};
// изменение обращения
const updateNames = async () => {
  isProcessed.value = true;
  await sendName({ name: name.value, patronymic: patronymic.value });
  isProcessed.value = false;
};

// изменение количества колонок
const updateColumnCount = (option: { id: number; name: string }) => {
  updateConfig({ columnsCount: option.id });
};

// Watchers
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
      <div class="flex">
        <div>Язык</div>
        <Select
          :options="availableLocales.map((locale) => localeToOption(locale))"
          :modelValue="localeToOption(locale)"
          @update:modelValue="localeHandler"
        />
      </div>
      <Switch
        v-model:modelValue="config['watchmanMode']"
        @update:modelValue="(value) => updateConfig({ watchmanMode: value })"
        label="Режим вахтера"
        justify="space-between"
      />
      <Switch
        v-model:modelValue="config['alwaysMenu']"
        @update:modelValue="(value) => updateConfig({ alwaysMenu: value })"
        label="Постоянное меню"
        justify="space-between"
      />
      <div class="flex">
        <div>Количество колонок</div>
        <Select
          :options="
            columnsOptions.map((count) => ({
              id: count,
              name: count.toString(),
            }))
          "
          v-model:modelValue="columnsCount"
          @update:modelValue="updateColumnCount"
          label="Постоянное меню"
          justify="space-between"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  > div {
    &:first-child {
      flex: 1;
    }

    &:last-child {
      flex: unset;
      flex-basis: 150px;
      text-align: right;
    }
  }
}
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
