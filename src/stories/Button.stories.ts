import Button from "@/components/Button.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta = {
  title: "Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["primary", "sucsses", "error"],
    },
  },
  args: {
    variant: "primary",
    default: "Button",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary" },
};
export const Sucsses: Story = {
  args: { variant: "sucsses" },
};
export const Error: Story = {
  args: { variant: "error" },
};
