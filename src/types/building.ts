import { Domophone } from "./domophone";

export interface Building {
    houseId: string;
    address: string;
    doors?: Domophone[];
    hasPlog?: 't' | 'f';
    cctv: number;
    ext?: Extension[];
}

interface Extension {
    caption: string;
    icon: string;  // Assuming SVG format
    extId: string;
    highlight?: 't' | 'f';
}

