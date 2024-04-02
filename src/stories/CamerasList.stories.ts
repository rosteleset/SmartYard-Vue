import CamerasList from "@/components/CamerasList.vue";
import type {Meta, StoryObj} from "@storybook/vue3";

const meta = {
    title: "CamerasList",
    component: CamerasList,
    tags: ["autodocs"],


} satisfies Meta<typeof CamerasList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {

    args: {
        cameras: [
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
            {
                id: 2,
                name: "Камера беварда",
                lat: "52.77087",
                url: "https://rbt-demo.lanta.me:8443/fail",
                token: "phei9quohmoochoth5es3eo9Koh5ua9i",
                lon: "41.404396",
                serverType: "flussonic",
                hasSound: true,
                hlsMode: "mpegts"
            },
            {
                id: 3,
                name: "Камера беварда",
                lat: "52.77087",
                url: "https://rbt-demo.lanta.me:8443/fail",
                token: "phei9quohmoochoth5es3eo9Koh5ua9i",
                lon: "41.404396",
                serverType: "flussonic",
                hasSound: true,
                hlsMode: "mpegts"
            }
        ],
    },
};
