import {vi} from "vitest";
import {createTestingPinia} from "@pinia/testing";
import {Event} from "@/types/events.ts";
import {defineComponent} from "vue";

export const FakeTransition = defineComponent({
    emits: ['afterEnter', 'enter'],
    template: '<div><slot /></div>',
    setup(_, {emit}) {
        return {
            emitAfterEnter() {
                emit('afterEnter')
            },
            emitEnter() {
                emit('enter')
            }
        }
    },
})

const pinia = createTestingPinia({createSpy: vi.fn});
export const mockTFunction = (text: string) => `Translated Text ${text}`;
export const mockRouter = {
    push: vi.fn(),
    currentRoute: "",
    getRoutes: vi.fn(),
    back: vi.fn()
}
export const mockOpenDoor = vi.fn()

export const defaultGlobal = {
    plugins: [pinia],
    stubs: {
        transition: FakeTransition,
        teleport: true,
    },
    mocks: {
        $t: mockTFunction,
        $router: mockRouter,
    },
}

export const mockRanges = [
    {from: 1625097600, duration: 3600},  // Example range
    {from: 1625101200, duration: 3600},
    {from: 1625104800, duration: 7200},
    {from: 1625112000, duration: 3600}
]

export const mockCamera = {
    id: 1,
    name: 'Test Camera',
    lat: '0.0',
    lon: '0.0',
    serverType: 'flussonic',
    url: 'http://test-url',
    token: 'test-token',
    streams: [
        {
            stream: 'stream1',
            ranges: [
                mockRanges[0],
                mockRanges[1]
            ]
        },
        {
            stream: 'stream2',
            ranges: [
                mockRanges[2],
                mockRanges[3]
            ]
        }
    ]
}

export const mockNotifications = [
    {
        messageId: '1',
        notification: {title: 'Test Title 1', body: 'Test Body 1'},
        data: {action: 'inbox'},
    },
    {
        messageId: '2',
        notification: {title: 'Test Title 2', body: 'Test Body 2'},
        data: {action: 'chat'},
    },
]

export const mockEvents: Event[] = [
    {
        uuid: '1',
        event: '1',
        date: '2023-01-01 00:00:00',
        objectId: 'obj1',
        objectType: '0',
        objectMechanizma: '0',
        mechanizmaDescription: 'Door description',
        detailX: {
            flags: ['canLike', 'liked'],
            face: {left: '10%', top: '10%', width: '50px', height: '50px'},
        },
        preview: 'http://example.com/preview.jpg',
        previewType: 1,
    },
    {
        uuid: '2',
        event: '2',
        date: '2023-01-02 00:00:00',
        objectId: 'obj1',
        objectType: '0',
        objectMechanizma: '0',
        mechanizmaDescription: 'Door description',
        detailX: {
            flags: ['canLike', 'liked'],
            face: {left: '10%', top: '10%', width: '50px', height: '50px'},
        },
        preview: 'http://example.com/preview.jpg',
        previewType: 1,
    }
];

export const mockClients = [
    {
        houseId: 'house1',
        flatId: 'flat1',
        address: 'Address 1',
        services: ['internet'],
    },
    {
        houseId: 'house1',
        flatId: 'flat2',
        address: 'Address 2',
        services: ['phone'],
    },
]

export const mockGetEvents = vi.fn().mockImplementation(() => Promise.resolve(mockEvents))