import Door from "@/components/Door.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta = {
  title: "Door",
  component: Door,
  tags: ["autodocs"],
  decorators: [
    (story) => ({
      components: { story },
      template: '<div style="max-width:400px"><story /></div>',
    }),
  ],
  args: {
    data: {
      domophoneId: 123,
      doorId: 456,
      icon: "entrance", 
      name: "калитка",
    },
  },
} satisfies Meta<typeof Door>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Entrance: Story = {
  args: {
    data: {
      domophoneId: 123,
      doorId: 456,
      icon: "entrance", 
      name: "entrance",
    },
  },
};

export const Wicket: Story = {
  args: {
    data: {
      domophoneId: 123,
      doorId: 456,
      icon: "wicket", 
      name: "wicket",
    },
  },
};

export const Gate: Story = {
  args: {
    data: {
      domophoneId: 123,
      doorId: 456,
      icon: "gate", 
      name: "gate",
    },
  },
};

export const Barrier: Story = {
  args: {
    data: {
      domophoneId: 123,
      doorId: 456,
      icon: "barrier", 
      name: "barrier",
    },
  },
};

