<script setup lang="ts">
import {Player, PlayerFactory} from "@/lib/player";
import {onMounted, onUnmounted, ref, StyleValue, watch} from "vue";
import ArrowIcon from "@/assets/arrowRight.svg?component";
import useZoom from "@/hooks/useZoom";
import {Camera, FormatedRange} from "@/types/camera";
import CustomControls from "@/components/CustomControls.vue";
import RangeSelect from "@/components/RangeSelect.vue";
import SpeedControl from "@/components/SpeedControl.vue";

const props = defineProps<{
  camera: Camera;
  _player?: Player;
  styles?: StyleValue
}>();
const {camera} = props;
const emit = defineEmits(["onClose"]);

// реактивные переменные
const player = ref<Player>();
const isOpenInfo = ref(false);
const previewElement = ref<HTMLVideoElement>();
const videoElement = ref<HTMLVideoElement | null>(null);
const videoContainer = ref<HTMLDivElement | null>(null);

const currentRange = ref<FormatedRange>();
const styles = ref<StyleValue>();

const {onDrag, videoStyles} = useZoom(videoElement)

const resize = () => {
  styles.value = player.value?.getSize();
};

const onCanPlay = () => {
  player.value?.calculateAspectRatio();
  resize();
};

const playPause = () => {
  if (!onDrag.value) videoElement.value?.paused ? player.value?.play() : player.value?.pause();
}

watch(currentRange, () => {
  player.value?.generateStream(
      currentRange.value?.from,
      currentRange.value?.duration
  );
  player.value?.initializeVideoStream()
  isOpenInfo.value = false
});

onMounted(() => {
  document.body.classList.add("scroll-block");

  if (videoElement.value) {
    const _camera = {...camera}
    if (!_camera.serverType)
      _camera['serverType'] = 'flussonic'
    player.value = PlayerFactory.createPlayer({
      camera: _camera,
      videoElement:
      videoElement.value,
      previewElement:
      previewElement.value,
      autoplay:
          true,
    });
    window.addEventListener("resize", resize);
  }

});
onUnmounted(() => {
  player.value?.onDestroy();
  document.body.classList.remove("scroll-block");
  window.removeEventListener("resize", resize);
});
</script>
<template>
  <div class="video-wrap" v-on:mousedown="emit('onClose')">
    <div
        ref="videoContainer"
        class="video-container"
        :style="styles"
        @mousedown.stop
    >
      <video ref="previewElement" class="video-preview" v-on:canplay="onCanPlay"/>

      <video
          ref="videoElement"
          class="video-element"
          :style="videoStyles"
          v-on:canplay="onCanPlay"
          @click="playPause"
      />
      <CustomControls
          v-if="videoElement && currentRange"
          :player="player"
          :videoElement="videoElement"
          :range="currentRange"
          @pause="player?.pause()"
      />
      <SpeedControl v-if="videoElement" :videoElement="videoElement"/>
      <div class="info" :class="{ open: isOpenInfo }">
        <button class="toggle-info" @click="isOpenInfo = !isOpenInfo">
          <ArrowIcon/>
        </button>
        <div class="info__label">{{ camera.name }}</div>
        <RangeSelect :camera="camera" v-model:modelValue="currentRange"/>
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
    background-color: var(--color-background);
    overflow: hidden;
    border-radius: 24px;
    // display: flex;
    // align-items: center;
    // justify-content: center;
  }

  &-element {
    position: relative;
    // z-index: 2;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &-preview {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }
}

.toggle-info {
  background-color: var(--color-background);
  border: 0;
  box-shadow: none;
  padding: 12px;
  border-radius: 6px 0 0 6px;
  position: absolute;
  right: 100%;
  top: 50%;
  cursor: pointer;

  svg {
    transition: 0.5s ease-out;
    transform: rotateY(180deg);
  }
}

.info {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: min-content;
  padding: 12px;
  background-color: var(--color-background);
  transform: translateX(100%);
  transition: 0.5s;
  z-index: 10;

  &.open {
    transform: translateX(0);

    .toggle-info {
      svg {
        transform: rotateY(0);
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
