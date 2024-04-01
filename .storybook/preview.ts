import type { Preview } from "@storybook/vue3";

import { setup } from "@storybook/vue3";
import store from "../src/store";
import i18n from "../src/i18n";
import {
  mockGetAddressList,
  mockGetName,
  mockGetNotification,
  mockGetSettingsList,
} from "../src/stories/fakeData";

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
};

export default preview;
