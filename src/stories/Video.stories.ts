import Video from "@/components/Video.vue";
import type {Meta, StoryObj} from "@storybook/vue3";

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
            {
                id: 1,
                name: "Камера беварда",
                lat: "52.77087",
                url: "https://rbt-demo.lanta.me:8443/fail",
                token: "phei9quohmoochoth5es3eo9Koh5ua9i",
                lon: "41.404396",
                serverType: "flussonic",
                hasSound: true,
                hlsMode: "mpegts"
            },
    },
};
