import {describe, expect, it, Mock, vi} from 'vitest';
import useEventNames from './useEventNames';
import useLocale from "@/hooks/useLocale.ts";

// Мокируем useLocale хук
vi.mock('@/hooks/useLocale');

describe('useEventNames', () => {
    it('returns correct event names', () => {
        // Мокируем функцию t из useLocale
        const mockT = vi.fn();
        // Устанавливаем ожидаемые значения для функции t
        mockT.mockReturnValueOnce('Call Unanswered');
        mockT.mockReturnValueOnce('Call Answered');
        mockT.mockReturnValueOnce('Open by Key');
        mockT.mockReturnValueOnce('Open from App');
        mockT.mockReturnValueOnce('Open by Face');
        mockT.mockReturnValueOnce('Open by Code');
        mockT.mockReturnValueOnce('Open Gates by Call');
        mockT.mockReturnValueOnce('Unknown');

        // Передаем мок функции t в хук useLocale
        (useLocale as Mock).mockReturnValue({t: mockT});

        // Вызываем наш хук
        const {eventNames} = useEventNames();

        // Проверяем, что eventNames возвращает ожидаемые значения
        expect(eventNames.value).toEqual({
            '1': 'Call Unanswered',
            '2': 'Call Answered',
            '3': 'Open by Key',
            '4': 'Open from App',
            '5': 'Open by Face',
            '6': 'Open by Code',
            '7': 'Open Gates by Call',
            'default': 'Unknown'
        });
    });
});
