<script setup lang="ts">
import { computed, ref } from "vue";
import useLocale from "@/hooks/useLocale";
import { useConfigStore } from "@/store/config";
import Select from "@/components/Select.vue";
import Switch from "@/components/Switch.vue";

const { availableLocales, locale, changeLocale, t } = useLocale();
const configStore = useConfigStore();
const { config, updateConfig } = configStore;

const watchmanMode = ref(config.watchmanMode);
const columnsOptions = [1, 2, 3, 4];
const themeOptions = ["auto", "light", "dark"];

const localeToOption = (locale: string): { id: string; name: string } => ({
  id: locale,
  name: t(`locales.${locale}`),
});

const themeToOption = (theme: string) => ({
  id: theme,
  name: t(`themes.${theme}`),
});

const updateColumnCount = (option: { id: number; name: string }) => {
  updateConfig({ columnsCount: option.id });
};
const updateTheme = (option: { id: number; name: string }) => {
  updateConfig({ theme: option.id });
};

const columnsCount = computed(() => {
  return config.columnsCount
    ? {
        id: config.columnsCount,
        name: config.columnsCount.toString(),
      }
    : undefined;
});

const updateWatchmanMode = (value: boolean) => {
  updateConfig({ watchmanMode: value });
};

const updateAlwaysMenu = (value: boolean) => {
  updateConfig({ alwaysMenu: value });
};
const localeHandler = (option: { id: string; name: string }) => {
  changeLocale(option.id);
};
</script>

<template>
  <div>
    <h2>{{ $t("settings.other") }}</h2>
    <div class="settings-block">
      <div class="flex">
        <div>Язык</div>
        <Select
          :options="availableLocales.map(localeToOption)"
          :modelValue="localeToOption(locale)"
          @update:modelValue="localeHandler"
        />
      </div>
      <div class="flex">
        <div>Тема</div>
        <Select
          :options="
            themeOptions.map((theme) => ({
              id: theme,
              name: $t(`themes.${theme}`),
            }))
          "
          :modelValue="themeToOption(configStore.config['theme'])"
          @update:modelValue="updateTheme"
        />
      </div>
      <Switch
        v-model:modelValue="watchmanMode"
        @update:modelValue="updateWatchmanMode"
        label="Режим вахтера"
        justify="space-between"
      />
      <Switch
        v-model:modelValue="config['alwaysMenu']"
        @update:modelValue="updateAlwaysMenu"
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
</style>
