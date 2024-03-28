import Map from "@/components/Map.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta = {
  title: "Map",
  component: Map,
  tags: ["autodocs"],
  args: {
    cameras: [
      {
        id: 15,
        name: "fake | камера  отключена",
        lat: "52.770935",
        url: "https://rbt-demo.lanta.me:8443/stub_service",
        token: "phei9quohmoochoth5es3eo9Koh5ua9i",
        lon: "41.404545",
        serverType: "flussonic",
        hasSound: false,
        hlsMode: "mpegts",
      },
      {
        id: 1,
        name: "Парковка -  Мичуринская улица, 2А, Тамбов",
        lat: "52.730473",
        url: "https://rbt-demo.lanta.me:8443/rbt-demo-000003",
        token: "phei9quohmoochoth5es3eo9Koh5ua9i",
        lon: "41.4524",
        serverType: "flussonic",
        hasSound: false,
        hlsMode: "mpegts",
      },
    ],
  },
} satisfies Meta<typeof Map>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
