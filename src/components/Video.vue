<script setup lang="ts">
import { StyleValue, onUnmounted, ref } from "vue";
import { Player } from "shaka-player/dist/shaka-player.compiled";
import {
  getLiveURL,
  getPreviewURL,
  initializeVideoStream,
  initializeVideoStreamShaka,
} from "../lib/video";
import { Camera } from "../types/camera";
import VideoModal from "./VideoModal.vue";
import Hls from "hls.js";
import { useConfigStore } from "../store/config";

const { camera } = defineProps<{ camera: Camera; index?: number }>();
const { config } = useConfigStore();

const previewContainer = ref<HTMLVideoElement | null>(null);
const previewElement = ref<HTMLVideoElement | null>(null);
const videoElement = ref<HTMLVideoElement | null>(null);
const preview = ref<string>(getPreviewURL(camera));
const hlsInstance = ref<Hls>();
const shakaInstance = ref<Player>();
const isPlaying = ref(false);

const isOpen = ref(false);
const styles = ref<StyleValue>();
const response = ref<number>(0);

const openHandler = () => {
  if (previewContainer.value && previewElement.value) {
    const rect = previewContainer.value.getBoundingClientRect();
    styles.value = {
      top: `${rect?.top}px`,
      left: `${rect?.left}px`,
      width: `${rect?.width}px`,
      height: `${rect?.height}px`,
      opacity: 0,
    };
    isOpen.value = true;
  }
};

const closeHandler = () => {
  isOpen.value = false;
};

// Функция загрузки видео и инициализации потока
const onVideoLoad = () => {
  if (config["watchmanMode"] && videoElement.value)
    initializeVideoStreamShaka(getLiveURL(camera), videoElement.value).then(
      (response) => (shakaInstance.value = response)
    );
};

// Функция события готовности видео
const onVideoReady = () => {
  isPlaying.value = true;
};

onUnmounted(() => {
  hlsInstance.value?.destroy();
  shakaInstance.value?.unload();
});
</script>

<template>
  <div
    v-if="camera.url"
    ref="previewContainer"
    class="video"
    :id="`camera-${camera.id}`"
  >
    <video
      autoplay
      ref="previewElement"
      class="video__preview"
      :src="preview"
      v-on:click="openHandler"
      v-on:canplay="onVideoLoad"
    />
    <video
      muted
      ref="videoElement"
      class="video__player"
      :class="{ active: isPlaying }"
      v-on:click="openHandler"
      v-on:canplay="onVideoReady"
    />
    <div v-if="index" class="number">{{ index }}</div>

    <VideoModal
      v-if="isOpen"
      :camera="camera"
      :start-styles="styles"
      :response="response"
      @on-close="closeHandler"
    />
  </div>
</template>

<style scoped lang="scss">
.video {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.5s;
  background-color: #6d7a8a;
  position: relative;

  &__preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: relative;
  }

  &__player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    &.active {
      z-index: 2;
    }
  }
}

.number {
  position: absolute;
  top: 6px;
  left: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #298bff;
  color: #ffffff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  z-index: 3;
}
</style>
