import type {Preview} from "@storybook/vue3";
import {setup} from "@storybook/vue3";
import store from "../src/store";
import i18n from "../src/i18n";
import '@/style/style.scss'
import {
    fakeAddresses,
    fakeClients,
    mockGetAddressList,
    mockGetCameras,
    mockGetName,
    mockGetNotification,
    mockGetPlog,
    mockGetPlogDays,
    mockGetSettingsList,
} from "../src/stories/__fakeData";

import "dayjs/locale/en";
import "dayjs/locale/ru";
import {useConfigStore} from "../src/store/config";
import {addons} from "@storybook/addons";
import {useEventsStore} from "../src/store/events";


setup((app) => {
    app.use(store);
    app.use(i18n);
    app.mixin({
        /* My mixin */
    });
    useEventsStore()
    store.state.value = {
        ...store.state.value,
        user: {
            ...store.state.value["user"],
            ...{clients: fakeClients},
        },
        addresses: {
            addresses: fakeAddresses
        },
        events: {
            flatIds: ["1", "2"],
            eventTypes:[]
        }
    };
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
                mockGetPlogDays,
                mockGetPlog,
                mockGetCameras
            ],
        },
    },
    decorators: [
        (story, context) => {
            // await new Promise((resolve) => setTimeout(resolve, 1000));


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
