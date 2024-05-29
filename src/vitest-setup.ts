import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {vi} from "vitest";
import {MessagePayload} from "firebase/messaging";
import {mockTFunction} from "@/tests/__mocks.ts";
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
        notifications: {},
        names: {},
        updateConfig: vi.fn(),
        getTheme: vi.fn(),
        updateTheme: vi.fn(),
        sendName: vi.fn()
    }),
}));

vi.mock("@/store/push", () => ({
    usePushStore: () => ({
        notifications: [],
        addNotification: vi.fn(),
        removeNotification: vi.fn(),
        call: {} as MessagePayload,
        setCall: vi.fn(),
        load: vi.fn()
    }),
}));

// hooks
vi.mock('@/hooks/useLocale', () => ({
    default: () => ({
        locale: 'en',
        changeLocale: vi.fn(),
        availableLocales: ['en', 'ru'],
        t: mockTFunction,
        localizedDayjs: dayjs
    })
}))

