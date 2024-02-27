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