import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import PhoneInput from '@/components/PhoneInput.vue';
import {nextTick} from 'vue';

describe('PhoneInput', () => {
    it('formats input value correctly', async () => {
        const wrapper = mount(PhoneInput, {
            props: {
                modelValue: '',
                mask:"+7 ### ###-##-##"
            }
        });

        const input = wrapper.find('input');
        await input.setValue('81234567890');
        await nextTick();

        expect(input.element.value).toBe('+7 (123) 456-78-90');
    });

    it('emits update:modelValue with correct value', async () => {
        const wrapper = mount(PhoneInput, {
            props: {
                modelValue: '',
                mask:"+7 ### ###-##-##"
            }
        });

        const input = wrapper.find('input');
        await input.setValue('81234567890');
        await nextTick();

        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toHaveLength(1);
        expect(emitted?.[0]).toEqual(['71234567890']);
    });

    it('initializes with correct formatted value', async () => {
        const wrapper = mount(PhoneInput, {
            props: {
                modelValue: '71234567890',
                mask:"+7 ### ###-##-##"
            }
        });

        const input = wrapper.find('input');
        await nextTick();

        expect(input.element.value).toBe('+7 (123) 456-78-90');
    });
});
