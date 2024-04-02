import CamerasList from "@/components/CamerasList.vue";
import type {Meta, StoryObj} from "@storybook/vue3";
import {fakeCameras} from "@/stories/__fakeData.ts";

const meta = {
    title: "Cameras List",
    component: CamerasList,
    tags: ["autodocs"],


} satisfies Meta<typeof CamerasList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {

    args: {
        cameras: fakeCameras,
    },
};
