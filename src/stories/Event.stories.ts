import Event from "@/components/Event.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta = {
  title: "Event",
  component: Event,
  tags: ["autodocs"],
  args: {
    event: {
      date: "2024-03-27 18:36:59",
      uuid: "d7deb630-de43-4492-b56c-7169810810df",
      previewType: 0,
      objectId: "2",
      objectType: "0",
      objectMechanizma: "0",
      mechanizmaDescription: "Подъезд Beward",
      event: "4",
      detailX: {
        phone: "79046392984",
      },
    },
  },
} satisfies Meta<typeof Event>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  
};
