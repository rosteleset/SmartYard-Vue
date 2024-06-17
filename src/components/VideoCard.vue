<script setup lang="ts">
import {onUnmounted, ref, StyleValue, watch} from "vue";
import {useConfigStore} from "@/store/config";
import {Camera} from "@/types/camera";
import VideoModal from "@/components/VideoModal.vue";
import {Player, PlayerFactory} from "rbt-player";
import {useElementVisibility} from "@vueuse/core";

const {camera, index} = defineProps<{ camera: Camera; index?: number }>();
const {config} = useConfigStore();
const player = ref<Player>();
const previewContainer = ref<HTMLVideoElement>();
const previewElement = ref<HTMLVideoElement>();
const videoElement = ref<HTMLVideoElement>();
const isOpen = ref(false);
const styles = ref<StyleValue>();
const targetIsVisible = useElementVisibility(previewContainer);
const timer = ref<NodeJS.Timeout>()

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
}

const closeHandler = () => (isOpen.value = false);

const mount = () => {
  if (!videoElement.value)
    return
  try {
    const _camera = {...camera}
    if (!_camera.serverType)
      _camera['serverType'] = 'flussonic'
    player.value = PlayerFactory.createPlayer({
      camera: _camera,
      videoElement: videoElement.value,
      previewElement: previewElement.value,
      autoplay: config.watchmanMode,
    });
  } catch (error: any) {
    console.warn(error.message);
  }
}

const dismount = () => {
  player.value?.onDestroy()
  player.value = undefined;
}

watch(targetIsVisible, () => {
  if (targetIsVisible.value) {
    if (timer.value)
      clearTimeout(timer.value)
    if (player.value && config.watchmanMode)
      player.value?.play()
    else
      mount()
  } else if (player.value && videoElement.value?.played) {
    player.value?.pause()
    timer.value = setTimeout(dismount, 20000);
  }
})

onUnmounted(dismount)
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

    <VideoModal v-if="isOpen" :camera="camera" @on-close="closeHandler" :styles="styles"/>
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
