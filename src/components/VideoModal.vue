<script setup lang="ts">
import { StyleValue, onMounted, ref, watch } from "vue";
import { getIframe, getPreviewURL } from "../lib/video";
import { Camera } from "../types/camera";

const props = defineProps<{
  camera: Camera;
  isOpen: boolean;
  startStyles?: StyleValue;
  response?: number;
}>();

const emit = defineEmits(["onClose"]);

const isPlaying = ref(false);
const previewElement = ref<HTMLVideoElement | null>(null);
const styles = ref<StyleValue>();
const preview = ref<string>(getPreviewURL(props.camera));
const response = ref<number | undefined>(props.response);

watch(
  () => props.isOpen,
  () => {
    styles.value = props.startStyles;
  }
);

const onLoad = () => {
  if (previewElement.value !== null) {
    response.value =
      previewElement.value.videoWidth / previewElement.value.videoHeight;
    const width = 90 * response.value;

    styles.value = {
      top: `5vh`,
      left: `calc((100vw - ${width}vh) / 2)`,
      width: `${width}vh`,
      height: `90vh`,
    };
  }
};
</script>

<template>
  <div class="pop-up" v-if="isOpen" v-on:click="emit('onClose')">
    <video
      v-if="isPlaying === false"
      ref="previewElement"
      :style="styles"
      :src="preview"
      v-on:canplay="onLoad"
    ></video>
    <iframe :src="getIframe(camera)" :style="styles"></iframe>
    <!-- <video v-else ref="videoElement" :style="styles"></video> -->
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

  video,
  iframe {
    transition: 1s;
    position: absolute;
    max-width: 90vw;
  }
}
</style>
