export const mockGetAddressList = {
    url: "/mobile/address/getAddressList",
    method: "POST",
    status: 200,
    response: {
      data: [
        { 
          houseId: '1', 
          address: 'ул. Главная, дом 123', 
          doors: [
            { doorId: '1', type: 'входная' },
            { doorId: '2', type: 'задняя' }
          ],
          hasPlog: 't',
          cctv: 2
        },
        { 
          houseId: '2', 
          address: 'ул. Вязовая, дом 456', 
          doors: [
            { doorId: '3', type: 'входная' },
            { doorId: '4', type: 'задняя' }
          ],
          hasPlog: 'f',
          cctv: 1
        },
      ],
    },
  }

export const mockGetSettingsList = {
url: "/mobile/address/getSettingsList",
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
}
// user/notification 
export const mockGetNotification = {
  url: "/mobile/user/notification ",
  method: "POST",
  status: 200,
  response: {
      data: {
        "money": "t",
        "enable": "t"
      }
  },
  }
// getName
export const mockGetName = {
    url: "/mobile/user/getName ",
    method: "POST",
    status: 200,
    response: {
        data: {
            "name": "Иван",
    "patronymic": "Иванович"
        }
    },
    }