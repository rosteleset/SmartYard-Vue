import { response } from "."

export interface Building {
    houseId: number;
    address: string;
    doors?: Domophone[];
    hasPlog?: 't' | 'f';
    cctv: number;
    ext?: Extension[];
}

export type DomophoneIcon = 'entrance' | 'wicket' | 'gate' | 'barrier';

export interface Domophone {
    domophoneId: number;
    doorId: number;
    entrance?: number;
    icon: DomophoneIcon;
    name: string;
    blocked?: string;
    dst?: string;
}

interface Extension {
    caption: string;
    icon: string;  // Assuming SVG format
    extId: string;
    highlight?: 't' | 'f';
}

export const getAddresses = async () => {
    const res = await response({ path: 'address/getAddressList' })

    return res.data.data as Building[]
}
