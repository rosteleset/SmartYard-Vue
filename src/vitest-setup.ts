import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {vi} from "vitest";
import {Names} from "@/types/user.ts";

global.L = L;

const mockGetAddressByHouseId = vi.fn();
const mockGetClientsByHouseId = vi.fn();

vi.mock("@/store/user", () => ({
    useUserStore: () => ({
        load: vi.fn(),
        clients: [],
        names: {} as Names,
        notifications: {},
        isLoaded: true,
        token: null,
        setToken: vi.fn(),
        deviceId: "123"
    }),
}));

vi.mock("@/store/addresses", () => ({
    useAddressesStore: () => ({
        getAddressByHouseId: mockGetAddressByHouseId,
        getClientsByHouseId: mockGetClientsByHouseId,
    }),
}));
vi.mock("@/hooks/useCameras", () => {
    return {
        default: () => ({cameras: []})
    };
})