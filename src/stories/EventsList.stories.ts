import EventsList from "@/components/EventsList.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { fakeClients, mockGetPlog, mockGetPlogDays } from "./__fakeData.ts";

const meta = {
  title: "Events List",
  component: EventsList,
  tags: ["autodocs"],
  parameters: {
  },
  args: {
    clients: [fakeClients[0]],
  },
} satisfies Meta<typeof EventsList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    mockData: [mockGetPlogDays,mockGetPlog],
  },
};
