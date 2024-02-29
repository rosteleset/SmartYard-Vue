<script setup lang="ts">
import closeIcon from '../assets/close.svg'
const props = defineProps<{
    title: string,
    isOpen: boolean
}>();

const emit = defineEmits(['onClose']);

const close = () => {
    emit('onClose')
};
</script>

<template>
    <teleport to="body">
        <div v-if="isOpen" class="modal__overlay" @click="close">
            <div class="modal" @click.stop>
                <div class="modal__header">
                    <h3>{{ props.title }}</h3>
                    <button class="modal__close" @click="close">
                        <img :src="closeIcon" alt="close">
                    </button>
                </div>
                <div class="modal__body">
                    <slot></slot>
                </div>
            </div>
        </div>
    </teleport>
</template>
  

  
<style scoped lang="scss">
.modal {
    background-color: white;
    padding: 20px;
    border-radius: 5px;

    &__overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        h3 {
            margin: 0;
        }


    }

    &__body {
        padding: 10px 0;
        min-width: 40vw;
        max-width: 100vw;
    }

    &__close {
        background: none;
        border: solid 1px #6D7A8A;
        border-radius: 50%;
        width: 26px;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
            display: block;
        }
    }
}
</style>
  