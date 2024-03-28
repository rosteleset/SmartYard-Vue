import type { Preview } from "@storybook/vue3";

import { setup } from '@storybook/vue3';
import store from '../src/store'
import i18n from '../src/i18n'

setup((app) => {
  app.use(store)
  app.use(i18n);
  app.mixin({
    /* My mixin */
  });
});

// export default preview;
