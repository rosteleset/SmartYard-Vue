import FacesListItem from "@/components/FacesListItem.vue";
import type {Meta, StoryObj} from "@storybook/vue3";

const meta = {
  title: "Faces List Item",
  component: FacesListItem,
  tags: ["autodocs"],

  args: {},
} satisfies Meta<typeof FacesListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    face: {
      faceId: "1",
      image: "https://placehold.co/400x400",
    },
  },
};

export const Empty: Story = {
    args: {
    },
  };