import {beforeEach, describe, expect, it, vi} from "vitest";
import {mount, VueWrapper} from "@vue/test-utils";
import Address from "@/components/Address.vue";
import {mockBuildings} from "@/mocks/Building.ts";
import Cameras from "@/components/Cameras.vue";
import Door from "@/components/Door.vue";
import Events from "@/components/Events.vue";
import {defaultGlobal} from "@/mocks/__mockedGlobal.ts";
import {ComponentPublicInstance} from "vue";
import {Building} from "@/types/building.ts";

vi.mock('@/components/Cameras.vue')
vi.mock('@/components/Door.vue')
vi.mock('@/components/Events.vue')

type TestWrapper<T> = VueWrapper<ComponentPublicInstance & T>

describe("Address", () => {
    let building: Building;
    let wrapper: TestWrapper<Partial<typeof Address>>

    beforeEach(() => {
        building = {...mockBuildings[0]}
        wrapper = mount(Address, {
            props: {building},
            global: defaultGlobal
        });

    });

    it("renders Door components for each door", () => {
        const doorComponents = wrapper.findAllComponents(Door);
        expect(doorComponents).toHaveLength(building.doors?.length || 0);

        building.doors?.forEach((door, index) => {
            expect(doorComponents[index].props("data")).toEqual(door);
        });
    });

    it("renders Cameras component with correct houseId", () => {
        const camerasComponent = wrapper.findComponent(Cameras);
        expect(camerasComponent.exists()).toBe(true);
        expect(camerasComponent.props("houseId")).toBe(building.houseId);
    });

    it("renders Events component if building hasPlog is true", () => {
        const eventsComponent = wrapper.findComponent(Events);
        expect(eventsComponent.exists()).toBe(true);
        expect(eventsComponent.props("houseId")).toBe(building.houseId);
    });

    it("does not render Events component if building hasPlog is false", async () => {
        wrapper.vm.building.hasPlog = 'f'
        await wrapper.vm.$nextTick();
        const eventsComponent = wrapper.findComponent(Events);
        expect(eventsComponent.exists()).toBe(false);
    });

})