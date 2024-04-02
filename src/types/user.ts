export type SettingsBoolean = "t" | "f";

interface Roommate {
  phone: string;
  timezone: number;
  expire: string;
  type: "inner" | "outer" | "owner";
}

export interface Client {
  clientId?: number;
  clientName?: string;
  contractName?: string;
  flatOwner?: SettingsBoolean;
  contractOwner?: SettingsBoolean;
  hasGates?: SettingsBoolean;
  houseId: string;
  flatId: string;
  flatNumber?: string;
  hasPlog?: SettingsBoolean;
  address: string;
  services: (
    | "internet"
    | "iptv"
    | "ctv"
    | "phone"
    | "cctv"
    | "domophone"
    | "gsm"
  )[]; // список подключенных услуг
  lcab?: string;
  roommates?: Roommate[];
}

export interface Settings {
  allowDoorCode?: SettingsBoolean; // разрешить код открытия двери
  enableDoorCode?: SettingsBoolean; // разрешить код открытия двери
  doorCode?: string;
  CMS?: SettingsBoolean; // разрешить КМС
  VoIP?: SettingsBoolean; // разрешить VoIP
  autoOpen?: string; // автооткрытие двери
  whiteRabbit?: "0" | "1" | "2" | "3" | "5" | "7" | "10"; // автооткрытие двери
  paperBill?: SettingsBoolean; // печатать бумажные платежки
  disablePlog?: SettingsBoolean; // прекратить "следить" за квартирой
  hiddenPlog?: SettingsBoolean; // показывать журнал только владельцу
  FRSDisabled?: SettingsBoolean; // отключить распознавание лиц для квартиры
}

export interface Names {
  name: string;
  patronymic?: string;
}

export interface Notifications {
  money?: SettingsBoolean;
  enable?: SettingsBoolean;
}
