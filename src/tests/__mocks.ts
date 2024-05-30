import {vi} from "vitest";
import {createTestingPinia} from "@pinia/testing";

const pinia = createTestingPinia({createSpy: vi.fn});
export const mockTFunction = () => "Translated Text";

export const defaultGlobal = {
    plugins: [pinia],
    stubs: {
        transition: false
    },
    mocks: {
        $t: mockTFunction,
        $router: {push: vi.fn()},
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
    serverType: 'test',
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