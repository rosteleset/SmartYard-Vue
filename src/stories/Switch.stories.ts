import Switch from "@/components/Switch.vue";
import type {Meta, StoryObj} from "@storybook/vue3";

const meta = {
    title: "Switch",
    component: Switch,
    tags: ["autodocs"],
    argTypes: {},
    args: {
        // modelValue: true
    },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
    args: {
        label: "Label"
    },
};
