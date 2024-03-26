<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useConfigStore } from "../store/config";
import { Camera } from "../types/camera";
import { Player, PlayerFactory } from "rbt-player/dist/player";
import SimpleVideo from "./SimpleVideo.vue";
import { onUnmounted } from "vue";

const { camera, index } = defineProps<{ camera: Camera; index?: number }>();
const { config } = useConfigStore();
const player = ref<Player>();
const previewContainer = ref<HTMLVideoElement>();
const previewElement = ref<HTMLVideoElement>();
const videoElement = ref<HTMLVideoElement>();
const isOpen = ref(false);

const openHandler = () => (isOpen.value = true);
const closeHandler = () => (isOpen.value = false);

onMounted(() => {
  if (videoElement.value) {
    try {
      player.value = PlayerFactory.createPlayer({
        camera,
        videoElement: videoElement.value,
        previewElement: previewElement.value,
        autoplay: config.watchmanMode,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  }
});
onUnmounted(()=>{
  player.value?.onDestroy()
})
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
      v-on:click="openHandler"
    />
    <video
      muted
      ref="videoElement"
      class="video__player"
      v-on:click="openHandler"
    />
    <div v-if="index" class="number">{{ index }}</div>

    <SimpleVideo v-if="isOpen" :camera="camera" @on-close="closeHandler" />
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
