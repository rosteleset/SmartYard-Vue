import { computed, reactive, ref, watch } from "vue";
import { useConfigStore } from "../store/config";
import { useLocale } from "./locale";

export const useConfig = () => {
  const { config: _config, updateConfig } = useConfigStore();
  const { t } = useLocale();
  const config = reactive(_config);

  const themes = ["auto", "dark", "light"];

  const columns = [1, 2, 3, 4];

  const getThemes = () =>
    themes.map((theme) => ({ id: theme, name: t(`themes.${theme}`) }));

  const getColumns = () =>
    columns.map((column) => ({ id: column, name: column }));

  const getValue = (name: string) => {
    return config[name];
  };

  const setValue = (name: string, value: string | number | boolean) => {
    updateConfig({ [name]: value });
  };

  const alwaysMenu = computed(()=>({
    value: config["alwaysMenu"],
    update: (newValue: boolean) => setValue("alwaysMenu", newValue),
  }));

  const model =
    // Watchers
    watch(config, (value) => {
      // console.log(value);
    });
  //   watch(watchmanMode, (value) => {
  //     updateConfig({ watchmanMode: value });
  //   });

  return {
    getThemes,
    getColumns,
    alwaysMenu,
  };
};
