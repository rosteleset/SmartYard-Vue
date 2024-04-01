import { Building } from "@/types/building";
import { Client } from "@/types/user";

const SERVER_URL =
  import.meta.env.MODE === "development" &&
  !import.meta.env.VITE_SERVER_URL.includes("http")
    ? import.meta.env.VITE_DEV_PROXY_PREFIX + import.meta.env.VITE_SERVER_URL
    : import.meta.env.VITE_SERVER_URL;

export const fakeAddresses: Building[] = [
  {
    houseId: "1",
    address: "ул. Главная, дом 123",
    doors: [
      {
        domophoneId: 1,
        doorId: 1,
        icon: "entrance",
        name: "входная",
      },
      {
        domophoneId: 2,
        doorId: 2,
        icon: "entrance",
        name: "задняя",
      },
    ],
    hasPlog: "t",
    cctv: 2,
  },
  {
    houseId: "2",
    address: "ул. Вязовая, дом 456",
    doors: [
      {
        domophoneId: 1,
        doorId: 1,
        icon: "entrance",
        name: "входная",
      },
      {
        domophoneId: 2,
        doorId: 2,
        icon: "entrance",
        name: "задняя",
      },
    ],
    hasPlog: "f",
    cctv: 1,
  },
];

export const fakeClients: Client[] = [
  {
    address:
      "ул. Главная, дом 1, квартира 1",
    houseId: "10",
    flatId: "1",
    flatNumber: "2",
    flatOwner: "f",
    hasGates: "f",
    hasPlog: "t",
    services: ["domophone"],
    contractOwner: "f",
    roommates: [],
  },
  {
    address:
      "ул. Главная, дом 1, квартира 2",
    houseId: "10",
    flatId: "2",
    flatNumber: "2",
    flatOwner: "f",
    hasGates: "f",
    hasPlog: "t",
    services: ["domophone"],
    contractOwner: "f",
    roommates: [],
  },
];

export const mockGetAddressList = {
  url: `${SERVER_URL}/address/getAddressList`,
  method: "POST",
  status: 200,
  response: {
    data: fakeAddresses,
  },
};

export const mockGetSettingsList = {
  url: `${SERVER_URL}/address/getSettingsList`,
  method: "POST",
  status: 200,
  response: {
    data: fakeClients,
  },
};
// user/notification
export const mockGetNotification = {
  url: `${SERVER_URL}/user/notification`,
  method: "POST",
  status: 200,
  response: {
    data: {
      money: "t",
      enable: "t",
    },
  },
};
// getName
export const mockGetName = {
  url: `${SERVER_URL}/user/getName`,
  method: "POST",
  status: 200,
  response: {
    data: {
      name: "Иван",
      patronymic: "Иванович",
    },
  },
};

export const mockGetPlogDays = {
  url: `${SERVER_URL}/address/plogDays`,
  method: "POST",
  status: 200,
  response: {
    data: [
      {
        day: "2024-03-27",
        events: "1",
      },
      {
        day: "2024-03-26",
        events: "2",
      },
    ],
  },
};

export const mockGetPlog = {
  url: `${SERVER_URL}/address/plog`,
  method: "POST",
  status: 200,
  response: {
    data: [
      {
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
        preview: "https://placehold.co/200x100",
      },
      {
        date: new Date().toString(),
        uuid: "2345",
        mechanizmaDescription: "Подъезд 2",
        event: "2",
        detailX: {
          face: {
            left: "556",
            top: "410",
            width: "140",
            height: "167",
          },
          flags: ["canDislike"],
          phone: "79000000000",
        },
        preview: "https://placehold.co/100x100",
      },
    ],
  },
};
