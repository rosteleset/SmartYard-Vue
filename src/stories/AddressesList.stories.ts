import AddressesList from "@/components/AddressesList.vue";
import type {Meta, StoryObj} from "@storybook/vue3";

const meta = {
    title: "AddressesList",
    component: AddressesList,
    tags: ["autodocs"],


} satisfies Meta<typeof AddressesList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
};
