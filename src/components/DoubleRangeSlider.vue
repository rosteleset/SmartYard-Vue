 
  <script setup lang="ts">
  import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
  
  // Пример: прокинем максимальную длину видео (в секундах) через пропсы
  const props = defineProps<{
    maxValue: number;
    initStart?: number; // можно указать стартовое значение
    initEnd?: number;   // можно указать конечное значение
  }>();
  
  const emits = defineEmits(["update-range"]);
  
  // Ссылки на DOM-элемент слайдера
  const sliderRef = ref<HTMLElement | null>(null);
  
  // Начальное и конечное время (по умолчанию 0 и maxValue)
  const startTime = ref(props.initStart ?? 0);
  const endTime = ref(props.initEnd ?? props.maxValue);
  
  // Переменная, которая хранит, какую именно ручку (start/end) сейчас тащим
  let dragging: "start" | "end" | null = null;
  const draggingRef = ref<"start" | "end" | null>(null); // для реактивного отображения тултипов
  
  watch([startTime, endTime], () => {
    // Чтобы startTime всегда был <= endTime
    if (startTime.value > endTime.value) {
      endTime.value = startTime.value;
    }
    // При любом изменении диапазона эмитим событие наружу
    emits("update-range", {
      start: startTime.value,
      end: endTime.value
    });
  });
  
  // При нажатии на ручку
  const onMouseDown = (type: "start" | "end", touchEvent?: Touch) => {
    dragging = type;
    draggingRef.value = type;
    // Подписываемся на события перемещения мыши или тача
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onMouseUp);
  
    if (touchEvent) {
      onTouchMove(touchEvent); // при первом таче сразу обработаем позицию
    }
  };
  
  const onMouseUp = () => {
    dragging = null;
    draggingRef.value = null;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onMouseUp);
  };
  
  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    updatePosition(e.clientX);
  };
  
  const onTouchMove = (touch: Touch | MouseEvent) => {
    if (!dragging) return;
    updatePosition(touch.clientX);
  };
  
  // Общая функция обновления позиции
  const updatePosition = (clientX: number) => {
    if (!sliderRef.value) return;
    const rect = sliderRef.value.getBoundingClientRect();
    // Определяем смещение мыши относительно начала слайдера
    const x = clientX - rect.left;
    // Переводим в процент (0...1)
    let ratio = x / rect.width;
    // Ограничим 0...1
    if (ratio < 0) ratio = 0;
    if (ratio > 1) ratio = 1;
    // Переводим в секунды относительно maxValue
    const newValue = ratio * props.maxValue;
  
    // Обновляем startTime или endTime, в зависимости от того, что двигаем
    if (dragging === "start") {
      startTime.value = newValue;
    } else {
      endTime.value = newValue;
    }
  };
  
  // Стили для «подсвеченного» диапазона
  // Левая граница — startTime, правая — endTime
  const rangeStyle = computed(() => {
    const left = (startTime.value / props.maxValue) * 100;
    const right = 100 - (endTime.value / props.maxValue) * 100;
    return {
      left: left + "%",
      right: right + "%"
    };
  });
  
  // Стили для ручек (по позициям)
  const thumbStartStyle = computed(() => {
    const left = (startTime.value / props.maxValue) * 100;
    return {
      left: `calc(${left}% - var(--thumb-size)/2)`
    };
  });
  
  const thumbEndStyle = computed(() => {
    const left = (endTime.value / props.maxValue) * 100;
    return {
      left: `calc(${left}% - var(--thumb-size)/2)`
    };
  });
  
  // Для удобства форматируем секунды в HH:mm:ss
  // Здесь просто пример. При желании можно подключить dayjs/другую библиотеку
  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    return [h, m, s]
      .map((v) => String(v).padStart(2, "0"))
      .join(":");
  };
  
  // Для реактивной части тултипов
  const draggingComputed = computed(() => draggingRef.value);
</script>

<template>
    <div class="double-range-slider" ref="sliderRef">
      <!-- Полоска (общий трек) -->
      <div class="track"></div>
  
      <!-- Подсвеченный выбранный диапазон -->
      <div class="range" :style="rangeStyle"></div>
  
      <!-- «Левая» ручка (старт) -->
      <div
        class="thumb thumb--start"
        :style="thumbStartStyle"
        @mousedown="onMouseDown('start')"
        @touchstart.prevent="onMouseDown('start', $event.touches[0])"
      >
        <div class="tooltip" v-if="dragging === 'start'">
          {{ formatTime(startTime) }}
        </div>
      </div>
  
      <!-- «Правая» ручка (конец) -->
      <div
        class="thumb thumb--end"
        :style="thumbEndStyle"
        @mousedown="onMouseDown('end')"
        @touchstart.prevent="onMouseDown('end', $event.touches[0])"
      >
        <div class="tooltip" v-if="dragging === 'end'">
          {{ formatTime(endTime) }}
        </div>
      </div>
    </div>
  </template>
  
  <style scoped lang="scss">
  .double-range-slider {
    --thumb-size: 16px;    /* ради удобства можно вынести в переменные */
    --track-height: 6px;
    --color-track: #ccc;
    --color-range: #298bff;
    --color-thumb: #fff;
    --color-thumb-border: #298bff;
  
    position: relative;
    width: 100%;
    height: var(--track-height);
    margin: 20px 0;
    user-select: none; /* чтобы не выделялся текст при перетаскивании мышью */
    touch-action: none; /* чтобы при таче не прокручивалось окно */
  
    .track {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: var(--track-height);
      background-color: var(--color-track);
      transform: translateY(-50%);
      border-radius: 3px;
    }
  
    .range {
      position: absolute;
      top: 50%;
      height: var(--track-height);
      background-color: var(--color-range);
      transform: translateY(-50%);
      border-radius: 3px;
    }
  
    .thumb {
      position: absolute;
      top: 50%;
      width: var(--thumb-size);
      height: var(--thumb-size);
      background-color: var(--color-thumb);
      border: 2px solid var(--color-thumb-border);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      cursor: pointer;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
  
      &.thumb--start {
        /* можно добавить стили для левой ручки */
      }
      &.thumb--end {
        /* можно добавить стили для правой ручки */
      }
  
      .tooltip {
        position: absolute;
        top: -32px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
      }
    }
  }
  </style>
  