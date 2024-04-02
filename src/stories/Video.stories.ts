import Video from "@/components/Video.vue";
import type {Meta, StoryObj} from "@storybook/vue3";
import {fakeCameras} from "@/stories/__fakeData.ts";

const meta = {
    title: "Video",
    component: Video,
    tags: ["autodocs"],


} satisfies Meta<typeof Video>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {

    args: {
        camera:
            fakeCameras[0],
    },
};
