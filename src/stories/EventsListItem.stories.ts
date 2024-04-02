import EventsListItem from "@/components/EventsListItem.vue";
import { Event } from "@/types/events";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta = {
  title: "Events List Item",
  component: EventsListItem,
  tags: ["autodocs"],
  args: {
    event: {
      date: new Date().toString(),
      uuid: "1234",
      mechanizmaDescription: "Подъезд 1",
      event: "2",
      detailX: {
        face: {
          left: "556",
          top: "410",
          width: "140",
          height: "167",
        },
        phone: "79000000000",
      },
      preview: "https://placehold.co/200x100",
    } as Event,
  },
} satisfies Meta<typeof EventsListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CanLike: Story = {
  args: {
    event: {
      date: new Date().toString(),
      uuid: "1234",
      mechanizmaDescription: "Подъезд 1",
      event: "2",
      detailX: {
        face: {
          left: "38",
          top: "38",
          width: "48",
          height: "28",
        },
        flags: ["canLike"],
        phone: "79000000000",
      },
      preview: "https://placehold.co/200x100",
    } as Event,
  },
};
export const CanDislike: Story = {
  args: {
    event: {
      date: new Date().toString(),
      uuid: "1234",
      mechanizmaDescription: "Подъезд 1",
      event: "2",
      detailX: {
        face: {
            left: "38",
            top: "38",
            width: "48",
            height: "28",
          },
        flags: ["canDislike"],
        phone: "79000000000",
      },
      preview: "https://placehold.co/200x100",
    } as Event,
  },
};
export const Liked: Story = {
    args: {
        event: {
          date: new Date().toString(),
          uuid: "1234",
          mechanizmaDescription: "Подъезд 1",
          event: "2",
          detailX: {
            face: {
                left: "38",
                top: "38",
                width: "48",
                height: "28",
              },
            flags: ["liked"],
            phone: "79000000000",
          },
          preview: "https://placehold.co/200x100",
        } as Event,
      },
};
