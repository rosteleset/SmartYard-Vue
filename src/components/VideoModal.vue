<script setup lang="ts">
import { Player } from "shaka-player/dist/shaka-player.compiled";
import { StyleValue, onMounted, onUnmounted, ref, watch } from "vue";
import arrowIcon from "../assets/arrowRight.svg";
import { useRanges } from "../hooks/ranges";
import { getLiveURL, getPreviewURL, initializeVideoStream } from "../lib/video";
import { Camera, FormatedRange } from "../types/camera";
import CustomControls from "./CustomControls.vue";
import RangeSelect from "./RangeSelect.vue";

// Определение свойств и эмиттеров
const { camera, startStyles, response } = defineProps<{
  camera: Camera;
  startStyles?: StyleValue;
  response?: number;
}>();
const { id, name } = camera;
const emit = defineEmits(["onClose"]);

// Реактивные переменные
const isLoaded = ref(false);
const isOpenInfo = ref(false);
const previewElement = ref<HTMLVideoElement | null>(null);
const videoElement = ref<HTMLVideoElement | null>(null);
const styles = ref<StyleValue>();
const preview = ref<string>(getPreviewURL(camera));
const currentResponse = ref<number | undefined>(response);
const shakaInstance = ref<Player>();

const { streams } = useRanges(id);
const currentRange = ref<FormatedRange>();

// Функция изменения размера видео
const resizeVideo = () => {
  if (previewElement.value !== null) {
    currentResponse.value =
      previewElement.value.videoWidth / previewElement.value.videoHeight;
    const aspectRatio = currentResponse.value;
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

const pause = () => {
  videoElement.value?.paused
    ? videoElement.value?.play()
    : videoElement.value?.pause();
};

// Функция загрузки видео и инициализации потока
const onVideoLoad = () => {
  resizeVideo();
  const liveURL = getLiveURL(camera);
  if (liveURL && videoElement.value)
    initializeVideoStream(liveURL, videoElement.value).then(
      (response) => (shakaInstance.value = response)
    );
};

// Функция события готовности видео
const onVideoReady = () => {
  isLoaded.value = true;
  isOpenInfo.value = false;
};

// Обработчики событий
onMounted(() => {
  styles.value = startStyles;
  window.addEventListener("resize", resizeVideo);
});

onUnmounted(() => {
  isLoaded.value = false;
  window.removeEventListener("resize", resizeVideo);
  shakaInstance.value?.unload();
});

// Слежение за текущей записью
watch(currentRange, () => {
  isLoaded.value = false;
  if (videoElement.value) {
    shakaInstance.value?.unload();
    const liveURL = getLiveURL(
      camera,
      currentRange.value?.from,
      currentRange.value?.duration
    );
    if (liveURL)
      initializeVideoStream(
        liveURL,
        videoElement.value,
        shakaInstance.value
      ).then((response) => {
        shakaInstance.value = response;
        videoElement.value?.play();
      });
  }
});
</script>

<template>
  <div class="pop-up" v-on:click="emit('onClose')">
    <div class="video-container" :style="styles" @click.stop>
      <video ref="videoElement" v-on:canplay="onVideoReady"></video>
      <video
        ref="previewElement"
        class="previewElement"
        :class="{ active: isLoaded }"
        :src="camera.serverType !== 'forpost' ? preview : undefined"
        :poster="camera.serverType === 'forpost' ? preview : undefined"
        v-on:canplay="onVideoLoad"
      />
      <CustomControls
        v-if="videoElement && currentRange"
        :videoElement="videoElement"
        :range="currentRange"
        @pause="pause"
      />
      <div class="info" :class="{ open: isOpenInfo }">
        <button class="toggle-info" @click="isOpenInfo = !isOpenInfo">
          <img :src="arrowIcon" alt="arrow" />
        </button>
        <div class="info__label">{{ name }}</div>
        <RangeSelect
          v-if="streams.length > 0"
          :streams="streams"
          v-model:modelValue="currentRange"
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
.toggle-info {
  background-color: #ffffff;
  border: 0;
  box-shadow: none;
  padding: 12px;
  border-radius: 6px 0 0 6px;
  position: absolute;
  right: 100%;
  top: 50%;
  cursor: pointer;
  img {
    display: block;
    transition: 0.5s ease-out;
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
    .toggle-info {
      img {
        transform: rotateZ(0);
      }
    }
  }
  &:not(.open) {
    &:hover {
      transform: translate(calc(100% - 12px));
    }
  }
  &__label {
    font-size: 20px;
    margin-bottom: 12px;
  }
}
</style>
