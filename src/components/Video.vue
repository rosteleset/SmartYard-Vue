<script setup lang="ts">
import { StyleValue, onMounted, ref } from "vue";
import { getPreviewURL } from "../lib/video";
import { Camera } from "../types/camera";
import VideoModal from "./VideoModal.vue";

const props = defineProps<{ camera: Camera }>();
const previewContainer = ref<HTMLVideoElement | null>(null);
const previewElement = ref<HTMLVideoElement | null>(null);
const preview = ref<string>(getPreviewURL(props.camera));

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
    };
    isOpen.value = true;
  }
};

const closeHandler = () => {
  isOpen.value = false;
};
</script>

<template>
  <div ref="previewContainer" class="video" :id="`camera-${props.camera.id}`">
    <video
      autoplay
      ref="previewElement"
      class="video__preview"
      :src="preview"
      v-on:click="openHandler"
    ></video>
    <VideoModal
      :camera="camera"
      :is-open="isOpen"
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

  &__preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
