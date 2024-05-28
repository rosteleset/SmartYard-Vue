import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {vi} from "vitest";
import {MessagePayload} from "firebase/messaging";

global.L = L;

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
    useAddressesStore: () => ({
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


