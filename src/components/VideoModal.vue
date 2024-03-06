<script setup lang="ts">
import { StyleValue, onMounted, onUnmounted, ref, watch } from "vue";
import {
  getIframe,
  getLiveURL,
  getPreviewURL,
  initializeVideoStream,
} from "../lib/video";
import { Camera, FormatedRange } from "../types/camera";
import { relative } from "path";
import { useRanges } from "../store/ranges";
import RangeSelect from "./RangeSelect.vue";

const props = defineProps<{
  camera: Camera;
  isOpen: boolean;
  startStyles?: StyleValue;
  response?: number;
}>();

const emit = defineEmits(["onClose"]);

const isPlaying = ref(false);
const isOpenInfo = ref(false);
const previewElement = ref<HTMLVideoElement | null>(null);
const videoElement = ref<HTMLVideoElement | null>(null);
const styles = ref<StyleValue>();
const preview = ref<string>(getPreviewURL(props.camera));
const response = ref<number | undefined>(props.response);

const { streams } = useRanges(props.camera.id);
const range = ref<FormatedRange>();

watch(
  () => props.isOpen,
  () => {
    styles.value = props.startStyles;
    if (!props.isOpen) isPlaying.value = false;
  }
);

const resize = () => {
  if (previewElement.value !== null) {
    response.value =
      previewElement.value.videoWidth / previewElement.value.videoHeight;

    // Вычисляем соотношение сторон
    const aspectRatio = response.value;

    // Получаем размеры контейнера (например, размеры окна браузера)
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    // Вычисляем новые размеры видео
    let newVideoWidth, newVideoHeight;

    if (containerWidth / aspectRatio > containerHeight) {
      newVideoWidth = containerHeight * 0.9 * aspectRatio;
      newVideoHeight = containerHeight * 0.9;
    } else {
      newVideoWidth = containerWidth * 0.9;
      newVideoHeight = (containerWidth * 0.9) / aspectRatio;
    }

    styles.value = {
      top: `${(containerHeight - newVideoHeight) / 2}px`,
      left: `${(containerWidth - newVideoWidth) / 2}px`,
      width: `${newVideoWidth}px`, // Преобразуем в пиксели
      height: `${newVideoHeight}px`, // Преобразуем в пиксели
    };
  }
};

const onLoad = () => {
  resize();
  if (videoElement.value)
    initializeVideoStream(getLiveURL(props.camera), videoElement.value);
};

const ready = () => {
  isPlaying.value = true;
};

onMounted(() => {
  window.addEventListener("resize", resize);
});

onUnmounted(() => {
  window.removeEventListener("resize", resize);
});

watch(range, () => {
  isPlaying.value = false;
  if (videoElement.value)
    initializeVideoStream(
      getLiveURL(props.camera, range.value?.from, range.value?.duration),
      videoElement.value
    );
});
</script>

<template>
  <div class="pop-up" v-if="isOpen" v-on:click="emit('onClose')">
    <div class="video-container" :style="styles" @click.stop>
      <video ref="videoElement" v-on:canplay="ready" :controls="range != undefined"></video>
      <video
        ref="previewElement"
        class="previewElement"
        :class="{active:isPlaying}"
        :src="preview"
        v-on:canplay="onLoad"
      />

      <div class="info" :class="{ open: isOpenInfo }">
        <button class="togle-info" @click="isOpenInfo = !isOpenInfo"><</button>
        <div class="info__label">{{ camera.name }}</div>
        <RangeSelect
          v-if="streams.length > 0"
          :streams="streams"
          v-model:modelValue="range"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pop-up {
  position: fixed;
  transition: 1s;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  background-color: transparentize($color: #000000, $amount: 0.7);
  display: flex;
  align-items: center;
  justify-content: center;

  .video-container {
    transition: 1s;
    position: absolute;
    overflow: hidden;
    border-radius: 12px;

    video {
      display: block;
      width: 100%;
      height: 100%;
    }
    .previewElement {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 1;
      &.active {
        opacity: 0;
      }
    }
  }
}

.togle-info {
  position: absolute;
  right: 100%;
  top: 50%;
}

.info {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: min-content;
  padding: 12px;
  background-color: #ffffff;
  transform: translateX(100%);
  transition: 0.5s;
  &.open {
    transform: translateX(0);
  }

  &__label {
    font-size: 20px;
    margin-bottom: 12px;
  }
}
</style>
