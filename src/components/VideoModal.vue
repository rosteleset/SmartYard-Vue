<script setup lang="ts">
import { StyleValue, ref, watch } from "vue";
import { getLiveURL, getPreviewURL, initializeVideoStream } from "../lib/video";
import { useRanges } from "../store/ranges";
import { Camera, FormatedRange } from "../types/camera";

import RangeSelect from "./RangeSelect.vue";

const props = defineProps<{
  camera: Camera;
  isOpen: boolean;
  startStyles?: StyleValue;
  response?: number;
}>();

const emit = defineEmits(["onClose"]);

const isPlaying = ref(false);
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
    // styles.value = props.startStyles;

    if (!props.isOpen) isPlaying.value = false;
  }
);

const onLoadPreview = () => {
  if (previewElement.value) {
    response.value =
      previewElement.value.videoWidth / previewElement.value.videoHeight;
    const width = 90 * response.value;
  }
  if (videoElement.value)
    initializeVideoStream(getLiveURL(props.camera), videoElement.value);
};

const onLoadVideo = () => {
  isPlaying.value = true;
  // styles.value = {
  //     top: 0,
  //     left: 0,
  //     width: "100vw",
  //     height: "100vh",
  //     opacity:1
  //   };

  //   setTimeout(() => {
  //     styles.value = {
  //       top: 0,
  //       left: 0,
  //       width: "100vw",
  //       height: "100vh",
  //       opacity:1,
  //       backgroundColor: "rgba(0, 0, 0, 0.3)",
  //     };
  //   }, 1000);
};

watch(range, () => {
  if (videoElement.value && range.value)
    initializeVideoStream(
      getLiveURL(props.camera, range.value.from, range.value.duration),
      videoElement.value
    );
});
</script>

<template>
  <Transition name="fade">
    <div
      class="pop-up"
      v-if="isOpen"
      :style="styles"
      v-on:click="emit('onClose')"
    >
      <div class="video-container" @click.stop>
        <div class="video">
          <video
            ref="videoElement"
            v-on:canplay="onLoadVideo"
            :controls="range !== undefined"
          ></video>
        </div>
          <div class="info">
            <div class="info__name">{{ camera.name }}</div>
            <RangeSelect
              :streams="streams"
              v-model="range"
            />
          </div>
        <Transition name="fade">
          <video
            v-if="!isPlaying"
            ref="previewElement"
            class="preview"
            :src="preview"
            v-on:canplay="onLoadPreview"
          ></video>
        </Transition>
      </div>
      <!--  -->

      <!-- </Transition> -->
      <!-- <iframe :src="getIframe(camera)" :style="styles"></iframe> -->
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.pop-up {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  transition: 1s;
  z-index: 100;
  background-color: transparentize($color: #000000, $amount: 1);
  display: flex;
  align-items: center;
  justify-content: center;

  // video,
  // iframe {
  //   position: absolute;
  //   max-width: 90vw;
  // }
}

.video-container {
  position: absolute;
  max-width: 90vw;
  overflow: auto;
  transition: 1s;
  display: flex;
  align-items: stretch;
  width: max-content;
  background-color: #ffffff;
  border-radius: 12px;
  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
  }
  .video {
  }

  video {
    display: block;
    max-width: 100%;
    max-height: 90vh;
    flex: 0;
    border-radius: 12px 0 0 12px;
  }

  .preview {
    position: absolute;
    top: 0;
    left: 0;
    object-fit: cover;
    height: 100%;
    // width: 100%;
  }

  .info {
    background-color: #ffffff;
    // flex: 1;
    padding: 12px;
    border-radius: 0 12px 12px 0;
    width: min-content;
    &__name {
      font-size: 20px;
      margin-bottom: 24px;
    }
  }
}

.info-enter-active,
.info-leave-active {
  transition: opacity 1s ease;
}

.info-enter-from,
.info-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
