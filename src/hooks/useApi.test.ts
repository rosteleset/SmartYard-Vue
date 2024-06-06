import {beforeEach, describe, expect, it, Mock, vi} from "vitest";
import useApi from "@/hooks/useApi.ts";
import axios from "axios";

const mockToken = '123'
const mockPushStore = {
    addNotification: vi.fn()
}

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
                post: vi.fn().mockImplementation(async (path: string, _body: any) => {
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
                }),
                defaults
            })
        )
    });

    it('должен создавать экземпляр axios с правильными параметрами', () => {
        console.log(api.axiosInstance.value)
        expect(api.axiosInstance.value.defaults.headers['Authorization']).toBe(`Bearer ${mockToken}`)
        expect(api.axiosInstance.value.defaults.headers['Content-Type']).toBe(`application/json`)
    });

    it('должен вызывать onError при возникновении ошибки в запросе', async () => {
        await expect(api.get('invalid-path')).rejects.toThrow()
        expect(mockPushStore.addNotification).toBeCalled()
    });

})
;
