const SERVER_URL =
  import.meta.env.MODE === "development" && !import.meta.env.VITE_SERVER_URL.includes('http')
    ? import.meta.env.VITE_DEV_PROXY_PREFIX + import.meta.env.VITE_SERVER_URL
    : import.meta.env.VITE_SERVER_URL;

export const mockGetAddressList = {
  url: `${SERVER_URL}/address/getAddressList`,
  method: "POST",
  status: 200,
  response: {
    data: [
      {
        houseId: "1",
        address: "ул. Главная, дом 123",
        doors: [
          { doorId: "1", type: "входная" },
          { doorId: "2", type: "задняя" },
        ],
        hasPlog: "t",
        cctv: 2,
      },
      {
        houseId: "2",
        address: "ул. Вязовая, дом 456",
        doors: [
          { doorId: "3", type: "входная" },
          { doorId: "4", type: "задняя" },
        ],
        hasPlog: "f",
        cctv: 1,
      },
    ],
  },
};

export const mockGetSettingsList = {
  url: `${SERVER_URL}/address/getSettingsList`,
  method: "POST",
  status: 200,
  response: {
    data: [
      {
        clientId: 1,
        clientName: "Иванов Иван Иванович",
        contractName: "Договор №12345",
        flatOwner: "т",
        contractOwner: "т",
        hasGates: "т",
        houseId: "1",
        flatId: "1",
        flatNumber: 1,
        hasPlog: "т",
        address: "ул. Главная, дом 1, квартира 1",
        services: ["интернет", "iptv", "телефон"],
        lcab: "12345",
        roommates: [
          { roommateId: 1, name: "Петров Петр Петрович", age: 30 },
          { roommateId: 2, name: "Сидоров Сидор Сидорович", age: 35 },
        ],
      },
      {
        clientId: 2,
        clientName: "Петров Петр Петрович",
        contractName: "Договор №67890",
        flatOwner: "н",
        contractOwner: "т",
        hasGates: "н",
        houseId: "2",
        flatId: "2",
        flatNumber: 2,
        hasPlog: "т",
        address: "ул. Вторичная, дом 2, квартира 2",
        services: ["интернет", "iptv", "телефон", "видеонаблюдение"],
        lcab: "67890",
        roommates: [],
      },
      // Добавьте больше данных по вашему усмотрению
    ],
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
        events: "1",
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
        date: "2024-03-07 12:38:46",
        uuid: "bbb67f91-ade1-4834-ac9c-b7ce29a41a9b",
        previewType: 2,
        objectId: "2",
        objectType: "0",
        objectMechanizma: "0",
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
          phone: "79046392984",
        },
        preview:
          "https://rbt-demo.lanta.me/mobile/address/plogCamshot/10001000-65e9-8b71-3f1f-e2147b695b42",
      }
    ],
  },
};
