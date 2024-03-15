<script setup lang="ts">
import dayjs from "dayjs";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { FormatedRange } from "../types/camera";
import playIcon from "../assets/play.svg";

// Определение свойств
const { videoElement, range } = defineProps<{
  videoElement: HTMLVideoElement;
  range: FormatedRange;
}>();

const emits = defineEmits(["pause"]);

// Константы
const minValue = 0;
const stepValue = 1;
const currentTime = ref(minValue);
const isDraggable = ref(false);

// Обработчики событий
watch(range, () => {
  currentTime.value = minValue;
});
watch(
  () => videoElement.currentTime,
  (newTime) => {
    currentTime.value = newTime;
  }
);

// Вычисляемые свойства
const maxValue = computed(() => {
  return range?.duration ?? 0;
});

const timeDisplayLeft = computed(() => {
  const newValue = Number(
    ((currentTime.value - minValue) * 100) / (maxValue.value - minValue)
  );
  const newPosition = 10 - newValue * 0.2;
  return `calc(${newValue}% + (${newPosition}px))`;
});

const progress = computed(() => {
  return ((currentTime.value / maxValue.value) * 100).toFixed(2);
});

const handleSliderInput = () => {
  if (range) {
    const newTime = Math.min(
      maxValue.value,
      Math.max(minValue, currentTime.value)
    );
    videoElement.currentTime = newTime;
  }
};

const onDragStart = () => {
  isDraggable.value = true;
};

const onDragEnd = () => {
  isDraggable.value = false;
};

const updateTime = () => {
  if (!isDraggable.value) currentTime.value = videoElement.currentTime;
};

onMounted(() => {
  videoElement.addEventListener("timeupdate", updateTime);
});

onUnmounted(() => {
  videoElement.removeEventListener("timeupdate", updateTime);
});
</script>
<template>
  <div class="custom-controls">
    <button class="play" @click="emits('pause')">
      <img :src="playIcon" alt="play" />
    </button>
    <div class="wrap">
      <input
        type="range"
        class="custom-slider"
        :min="minValue"
        :max="maxValue"
        :step="stepValue"
        v-model="currentTime"
        @input="handleSliderInput"
        @mousedown="onDragStart"
        @mouseup="onDragEnd"
        :style="{
          background: `linear-gradient(to right, #298BFF ${progress}%, #ccc ${progress}%)`,
        }"
      />
      <Transition name="fade">
        <div
          v-if="isDraggable"
          class="time-display"
          :style="{ left: timeDisplayLeft }"
        >
          {{ dayjs(range.date).add(currentTime, "seconds").format("HH:mm:ss") }}
        </div>
      </Transition>
    </div>
  </div>
</template>
<style scoped lang="scss">
.custom-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  .wrap {
    position: relative;
    width: 100%;
  }
  .custom-slider {
    width: 100%;
    cursor: pointer;
    appearance: none;
    outline: none;
    border-radius: 12px;
    height: 8px;
    &::-webkit-slider-runnable-track {
      height: 12px;
      border-radius: 12px;
    }
    &::-moz-range-track {
      height: 12px;
      border-radius: 12px;
    }
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      height: 12px;
      width: 12px;
      background-color: #fff;
      border-radius: 50%;
      border: 2px solid #298bff;
      box-shadow: 0 0 2px 4px #298bff;
      transition: 0.5s;
    }
    &::-moz-range-thumb {
      height: 12px;
      width: 12px;
      background-color: #fff;
      border-radius: 50%;
      border: 4px solid #298bff;
      transition: 0.5s;
    }
    &:active {
      &::-webkit-slider-thumb {
        box-shadow: 0 0 0 4px #298bff;
      }
      &::-moz-range-thumb {
        border-width: 6px;
      }
    }
  }
  .time-display {
    position: absolute;
    top: -42px; /* Отступ от ползунка вверх */
    left: 0;
    transform: translateX(-50%);
    background-color: #fff;
    padding: 6px;
    border-radius: 12px;
  }

  .play {
    background: none;
    border: solid 1px #fff;
    box-shadow: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    cursor: pointer;
    img {
      display: block;
    }
  }
}
</style>
