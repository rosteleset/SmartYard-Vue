import {Building} from "@/types/building.ts";

export const mockBuildings: Building[] = [
    {
        houseId: "house-1",
        address: "123 Main St",
        doors: [
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
            }
        ],
        hasPlog: 't',
        cctv: 2,
        ext: [
            {
                caption: "Extension 1",
                icon: "icon-1.svg",
                extId: "ext-1",
                highlight: 't'
            },
            {
                caption: "Extension 2",
                icon: "icon-2.svg",
                extId: "ext-2",
                highlight: 'f'
            }
        ]
    },
    {
        houseId: "house-2",
        address: "456 Elm St",
        doors: [
            {
                domophoneId: 3,
                doorId: 103,
                entrance: 1,
                icon: 'gate',
                name: "Side Door",
                blocked: "no",
                dst: "destination-3"
            }
        ],
        hasPlog: 'f',
        cctv: 3,
        ext: [
            {
                caption: "Extension 3",
                icon: "icon-3.svg",
                extId: "ext-3",
                highlight: 'f'
            }
        ]
    }
];
