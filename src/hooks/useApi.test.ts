import {beforeEach, describe, expect, it, Mock, vi} from "vitest";
import useApi from "@/hooks/useApi.ts";
import axios from "axios";

const mockToken = '123'
const mockPushStore = {
    addNotification: vi.fn()
}
const mockPost = vi.fn().mockImplementation(async (path: string, _body: any) => {
    switch (path) {
        case 'valid-path':
            return {data: 'ok'}
        case 'invalid-path':
        default:
            throw {
                response: {
                    data: {
                        name: 'Error',
                        message: 'not ok'
                    }
                }
            }
    }
})

vi.mock('@/store/user', () => ({
    useUserStore: () => ({
        token: mockToken
    })
}))

vi.mock('@/store/push', () => ({
    usePushStore: () => mockPushStore
}))
vi.mock('axios')

describe('useApi', () => {
    const api = useApi()

    beforeEach(() => {
        (axios.create as Mock).mockImplementation((defaults: any) => ({
            post: mockPost,
            defaults
        }))
    });

// должен создавать экземпляр axios с правильными параметрами
    it('should create an axios instance with the correct parameters', () => {
        expect(api.axiosInstance.value.defaults.headers['Authorization']).toBe(`Bearer ${mockToken}`)
        expect(api.axiosInstance.value.defaults.headers['Content-Type']).toBe(`application/json`)
    });

    // должен вызывать onError при возникновении ошибки в запросе
    it('should call onError when there is a request error', async () => {
        await expect(api.get('invalid-path')).rejects.toThrow()
        expect(mockPushStore.addNotification).toBeCalled()
    });

    // корректное преобразование параметров в JSON
    it('should correctly convert parameters to JSON', async () => {
        const params = {key: 'value'};
        await api.request('valid-path', params);
        expect(mockPost).toBeCalledWith('valid-path', JSON.stringify(params));
    });

    // корректное возвращение данных из запроса
    it('should correctly return data from the request', async () => {
        const mockResponse = {data: {success: true}};
        mockPost.mockResolvedValueOnce(mockResponse);

        const data = await api.request('valid-path', {key: 'value'});

        expect(data).toEqual(mockResponse.data);
    });
});
