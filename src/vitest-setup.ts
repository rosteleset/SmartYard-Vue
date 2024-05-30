import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {vi} from "vitest";
import {MessagePayload} from "firebase/messaging";
import {mockNotifications, mockRouter, mockTFunction} from "@/tests/__mocks.ts";
import dayjs from "dayjs";

global.L = L;

// stores
vi.mock("@/store/user", () => ({
    useUserStore: () => ({
        load: vi.fn(),
        clients: [],
        isLoaded: true,
        isAuth: true,
        token: '123',
        setToken: vi.fn(),
        logout: vi.fn()
    }),
}));

vi.mock("@/store/addresses", () => ({
    useAddressesStore: () => ({
        isLoaded: true,
        addresses: [],
        load: vi.fn(),
        getAddressByHouseId: vi.fn(),
        getClientsByHouseId: vi.fn(),
        getAddressByFlatId: vi.fn()
    }),
}));

vi.mock("@/store/config", () => ({
    useConfigStore: () => ({
        config: {},
        notifications: {
            enable: 'f',
            money: 'f',
        },
        names: {},
        updateConfig: vi.fn(),
        getTheme: vi.fn(),
        updateTheme: vi.fn(),
        sendName: vi.fn(async () => {
            return new Promise(resolve => setTimeout(resolve, 2000));
        })
    }),
}));

vi.mock("@/store/push", () => ({
    usePushStore: () => ({
        notifications: mockNotifications,
        addNotification: vi.fn(),
        removeNotification: vi.fn(),
        call: {} as MessagePayload,
        setCall: vi.fn(),
        load: vi.fn()
    }),
}));

// hooks
vi.mock('vue-router', () => ({
    useRouter: () => mockRouter,
    RouterLink: (props: any) => {
        return `<a href="${props.to}">Input</a>`
    }
}))

vi.mock('@/hooks/useLocale', () => ({
    default: () => ({
        locale: 'en',
        changeLocale: vi.fn(),
        availableLocales: ['en', 'ru'],
        t: mockTFunction,
        localizedDayjs: dayjs
    })
}))

vi.mock('@/hooks/useSettings', () => ({
    default: (_flatId: string) => ({
        settings: {
            allowDoorCode: 't', // разрешить код открытия двери
            enableDoorCode: 't', // разрешить код открытия двери
            doorCode: '0000',
            CMS: 't', // разрешить КМС
            VoIP: 't', // разрешить VoIP
            autoOpen: '', // автооткрытие двери
            whiteRabbit: "0", // автооткрытие двери
            paperBill: 't', // печатать бумажные платежки
            disablePlog: 't', // прекратить "следить" за квартирой
            hiddenPlog: 't', // показывать журнал только владельцу
            FRSDisabled: 'f', // отключить распознавание лиц для квартиры
        },
        load: vi.fn(),
        save: vi.fn(),
    })
}))
