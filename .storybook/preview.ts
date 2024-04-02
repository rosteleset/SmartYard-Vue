import type {Preview} from "@storybook/vue3";
import {setup} from "@storybook/vue3";
import store from "../src/store";
import i18n from "../src/i18n";
import '@/style/style.scss'
import {mockGetAddressList, mockGetName, mockGetNotification, mockGetSettingsList,} from "../src/stories/fakeData";
import "dayjs/locale/en";
import "dayjs/locale/ru";
import {useConfigStore} from "../src/store/config";
import {addons} from "@storybook/addons";

store.state.value = {
    ...store.state.value,
    events: {
        ...store.state.value["events"],
        ...{flatIds: ["1", "2"], eventTypes: []},
    },
};

setup((app) => {
    app.use(store);
    app.use(i18n);
    app.mixin({
        /* My mixin */
    });
});

let channel = addons.getChannel();

const preview: Preview = {
    parameters: {
        backgrounds: {
            default: 'light',
            values: [
                {
                    name: 'light',
                    value: '#f3f4fa',
                },
                {
                    name: 'dark',
                    value: '#28323e',
                },
            ],
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
        },
    },
    decorators: [
        (story, context) => {

            if (context.globals.locale)
                i18n.global.locale.value = context.globals.locale;
            const configStore = useConfigStore()
            // if (context.globals.backgrounds) {
                const theme = context.parameters.backgrounds.values.find(background => background.value === context.globals.backgrounds?.value)?.name || "light";
                configStore.updateConfig({theme})
            // }
            return {
                components: {story},
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
        defaultValue: 'ru',
        toolbar: {
            icon: "globe",
            items: [
                {value: "en", title: "English"},
                {value: "ru", title: "Russian"},
            ],
            showName: true,
        },
    },
};

export default preview;
