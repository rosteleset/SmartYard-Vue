
interface Roommate {
    phone: string;
    timezone: number;
    expire: string;
    type: 'inner' | 'outer' | 'owner';
}

export interface Settings {
    clientId: number;
    clientName: string;
    contractName: string;
    flatOwner: 't' | 'f';
    contractOwner: 't' | 'f';
    hasGates: 't' | 'f';
    houseId: number;
    flatId: string;
    flatNumber: number;
    hasPlog: 't' | 'f';
    address: string;
    services: ('internet' | 'iptv' | 'ctv' | 'phone' | 'cctv' | 'domophone' | 'gsm')[]; // список подключенных услуг
    lcab: string;
    roommates: Roommate[];
}