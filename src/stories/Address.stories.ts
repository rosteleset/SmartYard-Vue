import Address from "@/components/Address.vue";
import type {Meta, StoryObj} from "@storybook/vue3";
import {fakeAddresses} from "@/stories/__fakeData.ts";

const meta = {
    title: "Address",
    component: Address,
    tags: ["autodocs"],

} satisfies Meta<typeof Address>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        building:fakeAddresses[0]
    }
};
