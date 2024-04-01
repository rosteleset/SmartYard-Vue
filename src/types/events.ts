export interface EventDay {
    day: string;
    timezone?: number;
    events: string
}

type EventDetailFlag = "canLike" | "canDislike" | "liked"

export interface EventFaceCoordinates {
    left: string;
    top: string;
    width: string;
    height: string;
}

interface EventDetail {
    opened?: 't' | 'f';
    key?: string;
    phone?: string;
    faceId?: string;
    code?: string;
    phoneFrom?: string;
    phoneTo?: string;
    flags?: EventDetailFlag[];
    face?: EventFaceCoordinates;
}

export interface Event {
    date: string; // формат "Y-m-d H:i:s"
    timezone?: number; // часовой пояс, по умолчанию - Moscow Time
    uuid: string; // UUID события
    image?: string; // UUID картинки
    objectId: string; // идентификатор объекта (домофона)
    objectType: string; // тип объекта, 0 - домофон
    objectMechanizma: "0" | "1" | "2" | string; // идентификатор нагрузки (двери)
    mechanizmaDescription: string; // описание нагрузки (двери)
    event: string // 1 | 2 | 3 | 4 | 5 | 6 | 7; // тип события
    preview?: string; // URL картинки
    previewType: 0 | 1 | 2; // тип картинки
    detail?: string; // непонятная фигня
    detailX: EventDetail; // детализация события
}

