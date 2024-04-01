import EventsListItem from "@/components/EventsListItem.vue";
import { Event } from "@/types/events";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta = {
  title: "EventsListItem",
  component: EventsListItem,
  tags: ["autodocs"],
  args: {
    event: {
      date: new Date().toString(),
      uuid: "1234",
      mechanizmaDescription: "Подъезд 1",
      event: "4",
      detailX: {
        face: {
          left: "556",
          top: "410",
          width: "140",
          height: "167",
        },
        flags: ["canLike"],
        phone: "79000000000",
      },
      preview:
        "https://placehold.co/200x100",
    } as Event,
  },
} satisfies Meta<typeof EventsListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
