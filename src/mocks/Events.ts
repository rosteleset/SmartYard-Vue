import { Event } from '@/types/events';

export const mockEvents: Event[] = [
    {
        date: '2024-06-01 10:00:00',
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        objectId: 'doorbell1',
        objectType: '0',
        objectMechanizma: '0',
        mechanizmaDescription: 'Front Door',
        event: '1',
        previewType: 0,
        detailX: {}
    },
    {
        date: '2024-06-02 11:00:00',
        uuid: '123e4567-e89b-12d3-a456-426614174001',
        objectId: 'doorbell2',
        objectType: '0',
        objectMechanizma: '1',
        mechanizmaDescription: 'Back Door',
        event: '2',
        previewType: 1,
        detailX: {}
    }
];
