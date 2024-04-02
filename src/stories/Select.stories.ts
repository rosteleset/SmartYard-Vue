import Select from "@/components/Select.vue";
import type {Meta, StoryObj} from "@storybook/vue3";

const meta = {
    title: "Select",
    component: Select as Record<keyof typeof Select, unknown>,
    tags: ["autodocs"],
    decorators: [
        (story) => ({
            components: { story },
            template: '<div style="min-height: 300px;"><story /></div>',
        }),
    ],
    args: {
        options: [
            {id: "1", name: "Option 1"},
            {id: "2", name: "Option 2"},
            {id: "3", name: "Option 3"},
            {id: "4", name: "Option 4"},
            {id: "5", name: "Option 5"},
            {id: "6", name: "Option 6"},
        ]
    },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};


