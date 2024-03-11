<script setup lang="ts">
import Hls from "hls.js";
import { StyleValue, onMounted, onUnmounted, ref, watch } from "vue";
import { getLiveURL, getPreviewURL, initializeVideoStream } from "../lib/video";
import { useRanges } from "../hooks/ranges";
import { Camera, FormatedRange } from "../types/camera";
import RangeSelect from "./RangeSelect.vue";
import arrowIcon from "../assets/arrowRight.svg";


// Определение пропсов и эмиттера
const props = defineProps<{
  camera: Camera;
  isOpen: boolean;
  startStyles?: StyleValue;
  response?: number;
}>();
const emit = defineEmits(["onClose"]);

// Реактивные переменные
const isPlaying = ref(false);
const isOpenInfo = ref(false);
const previewElement = ref<HTMLVideoElement | null>(null);
const videoElement = ref<HTMLVideoElement | null>(null);
const styles = ref<StyleValue>();
const preview = ref<string>(getPreviewURL(props.camera));
const response = ref<number | undefined>(props.response);
const hls = ref<Hls>();
const { streams } = useRanges(props.camera.id);
const range = ref<FormatedRange>();

// Слежение за открытием/закрытием окна
watch(
  () => props.isOpen,
  () => {
    styles.value = props.startStyles;
    if (!props.isOpen) isPlaying.value = false;
  }
);

// Функция изменения размеров видео
const resize = () => {
  if (previewElement.value !== null) {
    response.value =
      previewElement.value.videoWidth / previewElement.value.videoHeight;
    const aspectRatio = response.value;
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
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
      width: `${newVideoWidth}px`,
      height: `${newVideoHeight}px`,
    };
  }
};

// Функция загрузки видео и инициализации потока
const onLoad = () => {
  resize();
  if (videoElement.value)
    initializeVideoStream(getLiveURL(props.camera), videoElement.value);
};

// Функция готовности видео
const ready = () => {
  isPlaying.value = true;
};

// Обработчики событий
onMounted(() => {
  window.addEventListener("resize", resize);
});
onUnmounted(() => {
  window.removeEventListener("resize", resize);
  hls.value?.destroy();
});
watch(range, () => {
  isPlaying.value = false;
  if (videoElement.value) {
    hls.value?.destroy();
    initializeVideoStream(
      getLiveURL(props.camera, range.value?.from, range.value?.duration),
      videoElement.value
    );
  }
});
</script>
<template>
  <div class="pop-up" v-if="isOpen" v-on:click="emit('onClose')">
    <div class="video-container" :style="styles" @click.stop>
      <video
        ref="videoElement"
        v-on:canplay="ready"
        :controls="range != undefined"
      ></video>
      <video
        ref="previewElement"
        class="previewElement"
        :class="{ active: isPlaying }"
        :src="preview"
        v-on:canplay="onLoad"
      />
      <div class="info" :class="{ open: isOpenInfo }">
        <button class="togle-info" @click="isOpenInfo = !isOpenInfo">
        <img :src="arrowIcon" alt="arrow">
        </button>
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
        z-index: -1;
        opacity: 0;
      }
    }
  }
}
.togle-info {
  background-color: #ffffff;
  border: 0;
  box-shadow: 0;
  padding: 12px;
  position: absolute;
  right: 100%;
  top: 50%;
  img {
    display: block;
    transform: rotateZ(180deg);
  }
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
../hooks/ranges