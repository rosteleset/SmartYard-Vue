import FacesList from "@/components/FacesList.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta = {
  title: "FacesList",
  component: FacesList,
  tags: ["autodocs"],
  
  args: {
    faces:[
        {
            faceId:"1",
            image:"https://placehold.co/400x400"
        },
        {
            faceId:"2",
            image:"https://placehold.co/200x400"
        },
        {
            faceId:"3",
            image:"https://placehold.co/400x600"
        },
        {
            faceId:"4",
            image:"https://placehold.co/200x200"
        },
        {
            faceId:"5",
            image:"https://placehold.co/900x900"
        },
        {
            faceId:"6",
            image:"https://placehold.co/100x100"
        },
        {
            faceId:"7",
            image:"https://placehold.co/100x300"
        }
    ],
  },
} satisfies Meta<typeof FacesList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
};
