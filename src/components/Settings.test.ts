import {describe, expect, it, vi} from "vitest";
import {mount} from "@vue/test-utils";
import Settings from "@/views/Settings.vue";
import SettingsDetails from "@/components/SettingsDetails.vue";
import SettingsOther from "@/components/SettingsOther.vue";
import SettingsNotifications from "@/components/SettingsNotifications.vue";

vi.mock("@/components/SettingsDetails.vue")
vi.mock("@/components/SettingsNotifications.vue")
vi.mock("@/components/SettingsOther.vue")

describe("Settings", () => {

    it('should render all components', () => {
        const wrapper = mount(Settings);

        expect(wrapper.findComponent(SettingsDetails).exists()).toBe(true)
        expect(wrapper.findComponent(SettingsNotifications).exists()).toBe(true)
        expect(wrapper.findComponent(SettingsOther).exists()).toBe(true)

    });
})