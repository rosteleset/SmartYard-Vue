<script setup lang="ts">
import { StyleValue, onMounted, ref, watch } from 'vue';
import { Camera } from '../api/cameras';
import { getLiveURL, getPreviewURL, initializeVideoStream } from '../lib/video';

// Определение пропсов
const props = defineProps<{ camera: Camera }>();

// Реактивные переменные
const isFullScreen = ref(false);
const isPlaying = ref(false);
const videoContainer = ref<HTMLVideoElement | null>(null);
const videoElement = ref<HTMLVideoElement | null>(null);
const previewElement = ref<HTMLVideoElement | null>(null);
const elementRect = ref<DOMRect | null>(null);
const styles = ref<StyleValue>();
const preview = ref<string>();

// Получение URL для предпросмотра при монтировании компонента
onMounted(() => {
    preview.value = getPreviewURL(props.camera);
});

// Слежение за изменениями в элементе видео
watch(videoElement, (newValue) => {
    if (newValue) {
        const streamUrl = getLiveURL(props.camera);
        initializeVideoStream(streamUrl, newValue).then(() => {
            isPlaying.value = true;
        });
    }
});

// Обработчик открытия полноэкранного режима
const openHandler = () => {
    if (videoContainer.value) {
        const rect = videoContainer.value.getBoundingClientRect();
        elementRect.value = rect;
        styles.value = {
            top: `${rect?.top}px`,
            left: `${rect?.left}px`,
            width: `${rect?.width}px`,
            height: `${rect?.height}px`
        };
        setTimeout(() => {
            styles.value = {
                top: `5vh`,
                left: `5vw`,
                width: `90vw`,
                height: `90vh`
            };
        }, 1);
    }
    isFullScreen.value = true;
};

// Обработчик закрытия полноэкранного режима
const closeHandler = () => {
    isFullScreen.value = false;
};
</script>

<template>
    <div ref="videoContainer" class="video">
        <video autoplay ref="previewElement" class="video__preview" :src="preview" v-on:click="openHandler"></video>
        <div v-if="isFullScreen" class="pop-up" v-on:click="closeHandler">
            <video v-if="isPlaying === false" :style="styles" :src="preview"></video>
            <video ref="videoElement" :style="styles"></video>
        </div>
    </div>
</template>

<style scoped lang="scss">
.video {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.5s;

    .pop-up {
        position: fixed;
        transition: 1s;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 100;
        background-color: transparentize($color: #000000, $amount: .7);

        video {
            transition: 1s;
            position: absolute;
        }
    }

    &__preview {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>