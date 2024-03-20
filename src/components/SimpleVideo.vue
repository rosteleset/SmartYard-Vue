<script setup lang="ts">
import { StyleValue, onMounted, onUnmounted, ref, watch } from "vue";
import arrowIcon from "../assets/arrowRight.svg";
import { useRanges } from "../hooks/ranges";
import { Player, PlayerFactory } from "../lib/player";
import { Camera, FormatedRange } from "../types/camera";
import CustomControls from "./CustomControls.vue";
import RangeSelect from "./RangeSelect.vue";

const { camera, preview: _preview } = defineProps<{
  camera: Camera;
  startStyles?: StyleValue;
  response?: number;
  preview?: string;
}>();
const emit = defineEmits(["onClose"]);
const { streams } = useRanges(camera.id);

// реактивные переменные
const player = ref<Player>();
const isOpenInfo = ref(false);
// const previewElement = ref<HTMLVideoElement | null>(null);
const videoElement = ref<HTMLVideoElement | null>(null);
const currentRange = ref<FormatedRange>();
const styles = ref<StyleValue>();
// переменные

const resize = () => {
  styles.value = player.value?.getSize();
};

const onCanPlay = () => {
  player.value?.calculateAspectRatio();
  resize();
};

watch(currentRange, () => {
  player.value?.generateStream(
    currentRange.value?.from,
    currentRange.value?.duration
  );
});

onMounted(() => {
  if (videoElement.value) {
    player.value = PlayerFactory.createPlayer(camera, videoElement.value);
    resize();
    window.addEventListener("resize", resize);
  }
});
onUnmounted(() => {
  window.removeEventListener("resize", resize);
});
</script>
<template>
  <div class="video-wrap" v-on:click="emit('onClose')">
    <div class="video-container" :style="styles" @click.stop>
      <video
        ref="videoElement"
        class="video-element"
        v-on:canplay="onCanPlay"
      />
      <!-- <video ref="previewElement" class="video-preview" /> -->
      <CustomControls
        v-if="videoElement && currentRange"
        :videoElement="videoElement"
        :range="currentRange"
        @pause="player?.pause()"
      />
      <div class="info" :class="{ open: isOpenInfo }">
        <button class="toggle-info" @click="isOpenInfo = !isOpenInfo">
          <img :src="arrowIcon" alt="arrow" />
        </button>
        <div class="info__label">{{ camera.name }}</div>
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
.video {
  &-wrap {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 200;
    background-color: transparentize($color: #000000, $amount: 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &-container {
    transition: 0.3s;
    position: absolute;
    background-color: #fff;
    overflow: hidden;
    border-radius: 24px;
    // display: flex;
    // align-items: center;
    // justify-content: center;
  }
  &-element {
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  &-preview {
    position: absolute;
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
