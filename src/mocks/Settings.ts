import {Settings} from "@/types/user";

const mockSettings: Settings[] = [
    {
        allowDoorCode: "t",
        enableDoorCode: "f",
        doorCode: "1234",
        CMS: "t",
        VoIP: "f",
        autoOpen: "08:00-20:00",
        whiteRabbit: "2",
        paperBill: "t",
        disablePlog: "f",
        hiddenPlog: "t",
        FRSDisabled: "f",
    },
    {
        allowDoorCode: "f",
        enableDoorCode: "t",
        doorCode: "5678",
        CMS: "f",
        VoIP: "t",
        autoOpen: "09:00-18:00",
        whiteRabbit: "3",
        paperBill: "f",
        disablePlog: "t",
        hiddenPlog: "f",
        FRSDisabled: "t",
    },
    {
        allowDoorCode: "t",
        enableDoorCode: "t",
        doorCode: "4321",
        CMS: "t",
        VoIP: "t",
        autoOpen: "07:00-22:00",
        whiteRabbit: "7",
        paperBill: "t",
        disablePlog: "t",
        hiddenPlog: "t",
        FRSDisabled: "f",
    },
    {
        allowDoorCode: "f",
        enableDoorCode: "f",
        doorCode: "8765",
        CMS: "f",
        VoIP: "f",
        autoOpen: "06:00-23:00",
        whiteRabbit: "10",
        paperBill: "f",
        disablePlog: "f",
        hiddenPlog: "f",
        FRSDisabled: "t",
    }
];

export {mockSettings};
