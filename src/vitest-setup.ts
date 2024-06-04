import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {vi} from "vitest";
import {
    mockCamera,
    mockClients,
    mockGetAddressByHouseId,
    mockGetEvents,
    mockRanges,
    mockRouter,
    mockTFunction
} from "@/tests/__mocks.ts";
import dayjs from "dayjs";
import {ref} from "vue";
import {Camera} from "@/types/camera.ts";

global.L = L;

// Mocking components and modules
vi.mock('rbt-player', () => ({
    PlayerFactory: {
        createPlayer: vi.fn().mockReturnValue({
            play: vi.fn(),
            pause: vi.fn(),
            getSize: vi.fn(),
            calculateAspectRatio: vi.fn(),
            generateStream: vi.fn(),
            initializeVideoStream: vi.fn(),
            onDestroy: vi.fn()
        })
    }
}));

vi.mock('vue-router', () => ({
    useRouter: () => mockRouter,
    RouterLink: (props: any) => {
        return `<a href="${props.to}">Input</a>`
    }
}))

vi.mock('@vue-leaflet/vue-leaflet', () => ({
    LMap: {template: '<div class="leaflet-map"><slot /></div>'},
    LTileLayer: {template: '<div></div>'},
    LMarker: {
        template: '<div class="leaflet-marker" ref="marker"><slot /></div>',
        mounted() {
            (this as any).$refs.marker._icon = (this as any).$refs.marker; // Добавляем свойство _icon
        }
    },

    LIcon: {template: '<div><slot /></div>'},
}))
vi.mock('vue-leaflet-markercluster', () => ({
    LMarkerClusterGroup: {template: '<div><slot /></div>'},
}))

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
        getAddressByHouseId: mockGetAddressByHouseId,
        getClientsByHouseId: ()=>ref(mockClients),
        getAddressByFlatId: vi.fn().mockReturnValue([]),
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



// hooks
vi.mock('@/hooks/useApi', () => ({
    default: () => ({
        axiosInstance: undefined,
        request: vi.fn().mockReturnValue(() => {
        }),
        get: vi.fn().mockReturnValue(() => {
        }),
    })
}))

vi.mock('@/hooks/useLocale', () => ({
    default: () => ({
        locale: 'en',
        changeLocale: vi.fn(),
        availableLocales: ['en', 'ru'],
        t: mockTFunction,
        localizedDayjs: ref(dayjs)
    })
}))

vi.mock('@/hooks/useSettings', () => ({
    default: (_flatId: string) => ({
        settings: ref({
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
        }),
        load: vi.fn(),
        save: vi.fn(),
    })
}))

vi.mock('@/hooks/useRanges', () => ({
    default: (_camera: Camera) => ({
        streams: ref([
            {
                stream: 'stream1',
                ranges: [
                    mockRanges[0],
                    mockRanges[1],
                ]
            },
            {
                stream: 'stream2',
                ranges: [
                    mockRanges[2],
                    mockRanges[3]
                ]
            }
        ])
    })
}))

vi.mock('@/hooks/useEvents', () => ({
    default: (_flatIds: string[]) => ({
        flatId: ref(""),
        eventType: ref(""),
        days: [
            { day: '2023-01-01', events: '1' },
            { day: '2023-01-02', events: '2' },
        ],
        getEvents: mockGetEvents
    })
}))

vi.mock('@/hooks/useEventNames', () => ({
    default: () => ({
        eventNames: {
            value: {
                '1': 'Event 1',
                '2': 'Event 2',
                default: 'Unknown Event',
            },
        },
    }),
}));

vi.mock('@/hooks/useCameras', () => ({
    default: () => ({
        cameras:[mockCamera]
    }),
}));