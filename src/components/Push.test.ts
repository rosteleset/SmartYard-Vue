import {describe, it, expect, vi, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import Push from '@/components/Push.vue';
import {usePushStore} from '@/store/push';
import {useRouter} from 'vue-router';
import CloseIcon from '@/assets/close.svg?component';

vi.mock('@/store/push');
vi.mock('vue-router', () => ({
    useRouter: vi.fn()
}));

describe('Push', () => {
    const pushStore = {
        notifications: [
            {
                messageId: '1',
                notification: {title: 'Test Title 1', body: 'Test Body 1'},
                data: {action: 'chat'}
            },
            {
                messageId: '2',
                notification: {title: 'Test Title 2', body: 'Test Body 2'},
                data: {action: 'inbox'}
            }
        ],
        removeNotification: vi.fn()
    };

    beforeEach(() => {
        (usePushStore as any).mockReturnValue(pushStore);
        (useRouter as any).mockReturnValue({push: vi.fn()});
    });

    it('renders notifications correctly', () => {
        const wrapper = mount(Push);
        const items = wrapper.findAll('.item');
        expect(items).toHaveLength(2);

        expect(items[0].find('.title').text()).toBe('Test Title 1');
        expect(items[0].find('.message').text()).toBe('Test Body 1');

        expect(items[1].find('.title').text()).toBe('Test Title 2');
        expect(items[1].find('.message').text()).toBe('Test Body 2');
    });

    it('handles click on notification correctly', async () => {
        const wrapper = mount(Push);
        const items = wrapper.findAll('.item');
        const router = useRouter();

        await items[0].trigger('click');
        expect(router.push).toHaveBeenCalledWith('/chat');
    });

    it('removes notification on close icon click', async () => {
        const wrapper = mount(Push);
        const closeIcons = wrapper.findAllComponents(CloseIcon);

        await closeIcons[0].trigger('click');
        expect(pushStore.removeNotification).toHaveBeenCalledWith(pushStore.notifications[0].messageId);
    });
});
