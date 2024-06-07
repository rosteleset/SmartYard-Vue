import {Camera} from '../types/camera';

const mockCameras: Camera[] = [
    {
        houseId: 1,
        id: 101,
        name: 'Front Door Camera',
        lat: '34.0522',
        lon: '-118.2437',
        serverType: 'NVR',
        hlsMode: 'enabled',
        hasSound: true,
        url: 'http://example.com/frontdoor.m3u8',
        token: 'abc123token'
    },
    {
        houseId: 1,
        id: 102,
        name: 'Backyard Camera',
        lat: '34.0523',
        lon: '-118.2438',
        serverType: 'DVR',
        hlsMode: 'disabled',
        hasSound: false,
        url: 'http://example.com/backyard.m3u8',
        token: 'def456token'
    },
    {
        houseId: 2,
        id: 103,
        name: 'Garage Camera',
        lat: '34.0524',
        lon: '-118.2439',
        serverType: 'Cloud',
        hasSound: true,
        url: 'http://example.com/garage.m3u8',
        token: 'ghi789token'
    },
    {
        houseId: 2,
        id: 104,
        name: 'Living Room Camera',
        lat: '34.0525',
        lon: '-118.2440',
        serverType: 'Local',
        hlsMode: 'enabled',
        hasSound: false,
        url: 'http://example.com/livingroom.m3u8',
        token: 'jkl012token'
    },
    {
        houseId: 3,
        id: 105,
        name: 'Kitchen Camera',
        lat: '34.0526',
        lon: '-118.2441',
        serverType: 'NVR',
        hlsMode: 'disabled',
        hasSound: true,
        url: 'http://example.com/kitchen.m3u8',
        token: 'mno345token'
    }
];

export {mockCameras};
