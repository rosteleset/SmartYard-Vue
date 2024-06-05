import {afterEach, beforeEach, describe, expect, it, Mock, vi} from "vitest";
import {usePushStore} from "@/store/push.ts";
import {createPinia, setActivePinia} from "pinia";
import {MessagePayload} from "@firebase/messaging";
import useApi from "@/hooks/useApi";
import {getToken} from "@/firebase";

// Мокируем необходимые модули
vi.mock('@/hooks/useApi')
vi.mock('@/firebase')
vi.mock('firebase/messaging')
vi.mock('vue-router')

describe("push store", () => {
    let store: ReturnType<(typeof usePushStore)>

    // Создаем моки для функций API
    const mockGet = vi.fn();
    const mockRequest = vi.fn()

    // Устанавливаем активную Pinia и инициализируем стор перед каждым тестом
    beforeEach(() => {
        setActivePinia(createPinia());
        (useApi as Mock).mockReturnValue({get: mockGet, request: mockRequest});
        store = usePushStore();
    })

    // Очищаем все моки после каждого теста
    afterEach(() => {
        vi.clearAllMocks()
    })

    // Проверяем начальное состояние стора
    it("State initialization", () => {
        expect(store.notifications).toEqual([]);
        expect(store.call).toBeUndefined();
    })

    // Тестируем добавление уведомлений
    it("Adding notifications", () => {
        const payload: MessagePayload = {messageId: '1', data: {action: 'test'}, from: 'test', collapseKey: 'test'};
        store.addNotification(payload);
        expect(store.notifications).toContainEqual(payload);
    })

    // Тестируем удаление уведомлений
    it('Removing notifications', () => {
        const payload1 = {messageId: '1', data: {action: 'test1'}, from: 'test', collapseKey: 'test'};
        const payload2 = {messageId: '2', data: {action: 'test2'}, from: 'test', collapseKey: 'test'};
        store.addNotification(payload1);
        store.addNotification(payload2);
        store.removeNotification(payload1);
        expect(store.notifications).not.toContainEqual(payload1);
        expect(store.notifications).toContainEqual(payload2);
    })

    // Тестируем обработку вызовов
    it('Handling calls', () => {
        const payload = {messageId: '1', data: {server: 'test-server'}, from: 'test', collapseKey: 'test'};
        store.setCall(payload);
        expect(store.call).toEqual(payload);
    })

    // Тестируем загрузку и регистрацию service worker
    it('Load and register service worker', async () => {
        const mockRegistration = {
            addEventListener: vi.fn(),
            scope: './'
        };

        Object.defineProperty(navigator, 'serviceWorker', {
            value: {
                register: vi.fn().mockResolvedValue(mockRegistration),
                addEventListener: mockRegistration.addEventListener
            },
            writable: true,
        });

        (getToken as Mock).mockResolvedValue('test-token');

        await store.load();

        expect(navigator.serviceWorker.register).toHaveBeenCalled();
        expect(getToken).toHaveBeenCalledWith(mockRegistration);
        expect(mockRegistration.addEventListener).toHaveBeenCalledWith("message", expect.any(Function));
    });

})
