import type { Preview } from "@storybook/vue3";

import { setup } from "@storybook/vue3";
import store from "../src/store";
import i18n from "../src/i18n";
import useLocale from "../src/hooks/useLocale";
import { useGlobals } from "@storybook/client-api";
import {
  mockGetAddressList,
  mockGetName,
  mockGetNotification,
  mockGetSettingsList,
} from "../src/stories/fakeData";
import "dayjs/locale/en";
import "dayjs/locale/ru";
import { watch } from "vue";
import { useI18n } from "vue-i18n";

store.state.value = {
  ...store.state.value,
  events: {
    ...store.state.value["events"],
    ...{ flatIds: ["1", "2"], eventTypes: [] },
  },
};

setup((app) => {
  app.use(store);
  app.use(i18n);
  app.mixin({
    /* My mixin */
  });
});
const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    mockAddonConfigs: {
      globalMockData: [
        mockGetAddressList,
        mockGetSettingsList,
        mockGetNotification,
        mockGetName,
      ],
      refreshStoryOnUpdate: true,
      disableUsingOriginal: false,
    },
  },
  decorators: [
    (story, context) => {
      const l = context.globals.locale;
      i18n.global.locale.value = l;

      return {
        components: { story },
        template: `
              <story/>
      `,
      };
    },
  ],
};

export const globalTypes = {
  locale: {
    name: "Locale",
    description: "Internationalization locale",
    toolbar: {
      icon: "globe",
      items: [
        { value: "en", title: "English" },
        { value: "ru", title: "Russian" },
      ],
      showName: true,
    },
  },
};

export default preview;
