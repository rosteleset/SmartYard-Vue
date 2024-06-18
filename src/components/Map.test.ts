import {shallowMount} from '@vue/test-utils';
import {beforeEach, describe, expect, it} from 'vitest';
import Map from '@/components/Map.vue';
import {mockCameras} from '@/mocks/Cameras';
import {LMap, LMarker} from "@vue-leaflet/vue-leaflet";


describe('Map', () => {
    let wrapper: any;

    beforeEach(() => {
        wrapper = shallowMount(Map, {
            props: {
                cameras: mockCameras
            },
            global: {
                renderStubDefaultSlot: true
            }
        });
    });

    it('renders the correct number of markers', async () => {

        const markers = wrapper.findAllComponents(LMarker);
        expect(markers.length).toBe(mockCameras.length);
    });

    it('centers the map correctly based on camera locations', () => {
        const center = wrapper.vm.getCenter();
        const expectedCenter = [
            (parseFloat(mockCameras[0].lat) + parseFloat(mockCameras[1].lat) + parseFloat(mockCameras[2].lat) + parseFloat(mockCameras[3].lat) + parseFloat(mockCameras[4].lat)) / mockCameras.length,
            (parseFloat(mockCameras[0].lon) + parseFloat(mockCameras[1].lon) + parseFloat(mockCameras[2].lon) + parseFloat(mockCameras[3].lon) + parseFloat(mockCameras[4].lon)) / mockCameras.length,
        ];
        expect(center).toEqual(expectedCenter);
    });

    it('emits the correct event when a marker is clicked', async () => {
        const marker = wrapper.findComponent(LMarker);
        await marker.trigger('click');

        expect(wrapper.vm.openCamera).toEqual(mockCameras[0]);
    });

    it('calculates the correct zoom level on map ready', async () => {
        const mapInstance = wrapper.findComponent(LMap).vm;
        await mapInstance.$emit('ready', {
            getBoundsZoom: () => 12 // Mocking getBoundsZoom method
        });

        expect(wrapper.vm.zoom).toBe(12);
    });

});
