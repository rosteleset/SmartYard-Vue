import {Domophone} from "@/types/domophone.ts";

export const mockDomophones: Domophone[] = [
    {
        domophoneId: 1,
        doorId: 101,
        entrance: 1,
        icon: 'entrance',
        name: "Front Door",
        blocked: "no",
        dst: "destination-1"
    },
    {
        domophoneId: 2,
        doorId: 102,
        entrance: 2,
        icon: 'wicket',
        name: "Back Door",
        blocked: "yes",
        dst: "destination-2"
    },
    {
        domophoneId: 3,
        doorId: 103,
        entrance: 1,
        icon: 'gate',
        name: "Side Door",
        blocked: "no",
        dst: "destination-3"
    },
    {
        domophoneId: 4,
        doorId: 104,
        entrance: 3,
        icon: 'barrier',
        name: "Main Gate",
        blocked: "yes",
        dst: "destination-4"
    }
];
