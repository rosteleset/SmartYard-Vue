<script setup lang="ts">
import dayjs from "dayjs";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import PlayIcon from "../assets/play.svg?component";
import DownloadIcon from "../assets/download.svg?component";
import CloseIcon from "../assets/close.svg?component";
import {Camera, FormatedRange} from "../types/camera";
import DownloadSlider from "@/components/DownloadSlider.vue";
import useApi from "@/hooks/useApi.ts";
import {usePushStore} from "@/store/push.ts";


// Определение свойств
const {videoElement, camera, range} = defineProps<{
  videoElement: HTMLVideoElement;
  camera: Camera;
  range: FormatedRange;
}>();

const emits = defineEmits(["pause"]);

const api = useApi()
const push = usePushStore()


// Константы
const minValue = 0;
const stepValue = 1;
const currentTime = ref(minValue);
const isDraggable = ref(false);
const downloadMode = ref(false)

// Обработчики событий
watch(() => range, () => {
  currentTime.value = minValue;
});

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
    videoElement.currentTime = Math.min(
        maxValue.value,
        Math.max(minValue, currentTime.value)
    );
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
  if (downloadMode.value) {
    if (currentTime.value >= downloadEnd.value || currentTime.value <= downloadStart.value)
      videoElement.currentTime = downloadStart.value;
  }
};

onMounted(() => {
  videoElement.addEventListener("timeupdate", updateTime);
});

onUnmounted(() => {
  videoElement.removeEventListener("timeupdate", updateTime);
});

const downloadStart = ref(0)
const downloadEnd = ref(range?.duration)

const openDownload = () => {
  if (!downloadMode.value) {
    downloadStart.value = currentTime.value;
    downloadEnd.value = currentTime.value + (60 * 10);
    downloadMode.value = true;
  } else {
    downloadMode.value = false;
  }
}

const downloadHandler = () => {
  const from = dayjs(range.date).add(downloadStart.value, "second").format("YYYY-MM-DD HH:mm:ss");
  const to = dayjs(range.date).add(downloadEnd.value, "second").format("YYYY-MM-DD HH:mm:ss");

  api.get('/cctv/recPrepare', {id: camera.id, from, to})
      .then(res => api.get('/cctv/recDownload', {id: res}))
      .then(res => {
        console.log(res)
        const uuid = crypto.randomUUID()
        const notification = {
          title: "Видео готовится",
          body: "Как только процесс закончится, вам придет сообщение в чат. В зависимости от длины видео процесс загрузки может занять от нескольких минут до нескольких часов."
        }
        push.addNotification({
          notification,
          from: 'system',
          collapseKey: '',
          messageId: uuid,
        })
        setTimeout(() => {
          push.removeNotification(uuid)
        }, 5000)
      })
}
</script>
<template>
  <div class="custom-controls">
    <button class="button" @click="emits('pause')">
      <PlayIcon/>
    </button>
    <div v-if="downloadMode" class="wrap">
      <DownloadSlider
          :range="range"
          :lowerValue="downloadStart"
          :upperValue="downloadEnd"
          @update:lowerValue="val => downloadStart = val"
          @update:upperValue="val => downloadEnd = val"
      />
    </div>
    <div v-if="!downloadMode" class="wrap">
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
      <div
          class="time-display"
          :class="{ visible: isDraggable }"
          :style="{ left: timeDisplayLeft }"
      >
        {{ dayjs(range.date).add(currentTime, "seconds").format("HH:mm:ss") }}
      </div>
    </div>
    <button v-if="downloadMode" class="button no-border" @click="downloadHandler">
      <DownloadIcon/>
    </button>
    <button class="button no-border" @click="openDownload">
      <DownloadIcon v-if="!downloadMode"/>
      <CloseIcon v-else/>
    </button>
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
  gap: 12px;

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
    background-color: var(--color-background);
    padding: 6px;
    border-radius: 12px;
    opacity: 0;
    transition: opacity 0.5s ease;
    font-size: 12px;

    &.visible {
      opacity: 1;
    }
  }

  .button {
    background: none;
    border: solid 1px #fff;
    box-shadow: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: pointer;

    svg {
      max-width: 70%;
      max-height: 70%;
      fill: #298bff;
      widows: unset;
      height: unset;
    }

    &.no-border {
      border: none;
    }
  }

  &:hover {
    .time-display {
      opacity: 1;
    }
  }
}
</style>
