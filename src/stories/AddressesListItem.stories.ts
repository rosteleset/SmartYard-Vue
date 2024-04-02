import AddressesListItem from "@/components/AddressesListItem.vue";
import type {Meta, StoryObj} from "@storybook/vue3";
import {fakeAddresses} from "@/stories/__fakeData.ts";

const meta = {
    title: "Addresses List Item",
    component: AddressesListItem,
    tags: ["autodocs"],

} satisfies Meta<typeof AddressesListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        building:fakeAddresses[0]
    }
};
