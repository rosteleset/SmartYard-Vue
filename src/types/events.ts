export interface EventDay {
    day: string;
    timezone: number;
    events: number
}

interface EventDetailFlags {
    canLike?: void;
    canDislike?: void;
    liked?: void;
}

interface EventFaceCoordinates {
    left: number;
    top: number;
    width: number;
    height: number;
}

interface EventDetail {
    opened?: 't' | 'f';
    key?: string;
    phone?: string;
    faceId?: string;
    code?: string;
    phoneFrom?: string;
    phoneTo?: string;
    flags?: EventDetailFlags;
    face?: EventFaceCoordinates;
}

export interface Event {
    date: string; // формат "Y-m-d H:i:s"
    timezone: number; // часовой пояс, по умолчанию - Moscow Time
    uuid: string; // UUID события
    image: string; // UUID картинки
    objectId: number; // идентификатор объекта (домофона)
    objectType: 0; // тип объекта, 0 - домофон
    objectMechanizma: 0 | 1 | 2; // идентификатор нагрузки (двери)
    mechanizmaDescription: string; // описание нагрузки (двери)
    event: 1 | 2 | 3 | 4 | 5 | 6 | 7; // тип события
    preview: string; // URL картинки
    previewType: 0 | 1 | 2; // тип картинки
    detail: string; // непонятная фигня
    detailX: EventDetail; // детализация события
}
