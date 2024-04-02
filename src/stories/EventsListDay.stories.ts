import EventsListDay from "@/components/EventsListDay.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { mockGetPlog, mockGetPlogDays } from "./__fakeData.ts";

const meta = {
  title: "Events List Day",
  component: EventsListDay,
  tags: ["autodocs"],
  parameters: {
    mockData: [mockGetPlog],
  },
  args: {
    day: {
      day: new Date().toString(),
      events: "5",
    },
  },
} satisfies Meta<typeof EventsListDay>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    mockData: [mockGetPlogDays,mockGetPlog],
  },
};
