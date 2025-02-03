<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { FormatedRange } from "@/types/camera.ts";
import dayjs from "dayjs";

interface Props {
  range: FormatedRange;
  lowerValue: number;
  upperValue: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:lowerValue', value: number): void;
  (e: 'update:upperValue', value: number): void;
}>();

// Минимальное и максимальное значения, шаг
const min = 0;
const max = props.range.duration;
const step = 1;

// Локальные реактивные переменные для значений ползунков
const localLower = ref(props.lowerValue);
const localUpper = ref(props.upperValue);

// Синхронизация с родительскими данными
watch(
    () => props.lowerValue,
    (newVal) => { localLower.value = newVal; }
);
watch(
    () => props.upperValue,
    (newVal) => { localUpper.value = newVal; }
);

// Обработчики ввода
const onLowerInput = () => {
  if (localLower.value > localUpper.value) {
    localLower.value = localUpper.value;
  }
  emit('update:lowerValue', localLower.value);
};

const onUpperInput = () => {
  if (localUpper.value < localLower.value) {
    localUpper.value = localLower.value;
  }
  emit('update:upperValue', localUpper.value);
};

// Вычисляем проценты для позиций ползунков
const lowerPercent = computed(() =>
    ((localLower.value - min) / (max - min)) * 100
);
const upperPercent = computed(() =>
    ((localUpper.value - min) / (max - min)) * 100
);

// Фоновый градиент
const rangeStyle = computed(() => {
  return {
    background: `linear-gradient(to right, #ccc 0%, #ccc ${lowerPercent.value}%, #298BFF ${lowerPercent.value}%, #298BFF ${upperPercent.value}%, #ccc ${upperPercent.value}%, #ccc 100%)`
  };
});

// --- Работа с динамическим смещением меток ---
// Задаём порог минимального расстояния между метками (в процентах)
const minPercentDiff = 8;

// Вычисляем, насколько не хватает до порога (в процентных пунктах)
const shortage = computed(() => {
  const diff = upperPercent.value - lowerPercent.value;
  return diff < minPercentDiff ? (minPercentDiff - diff) : 0;
});

// Ссылка на контейнер слайдера для измерения его ширины
const sliderContainer = ref<HTMLDivElement | null>(null);
const containerWidth = ref(350);

// onMounted(() => {
//   if (sliderContainer.value) {
//     containerWidth.value = sliderContainer.value.offsetWidth;
//   }
// });

// Фактор для дополнительного смещения. Если ширина известна,
// то переводим проценты в пиксели: 1% = containerWidth/100 пикселей.
const extraFactor = 1; // можно поэкспериментировать с этим коэффициентом

const extraLower = computed(() => {
  // Вычисляем дополнительное смещение для нижней метки (в пикселях)
  // Отрицательное смещение – сдвиг влево
  const pxPerPercent = containerWidth.value / 100 || 6; // если не измерено, принимаем 6px за 1%
  return - shortage.value * pxPerPercent * extraFactor;
});

const extraUpper = computed(() => {
  // Дополнительное смещение для верхней метки (в пикселях)
  const pxPerPercent = containerWidth.value / 100 || 6;
  return shortage.value * pxPerPercent * extraFactor;
});

// В базовой формуле уже есть небольшой offset (10 - percent*0.2)
// Прибавляем к нему вычисленное дополнительное смещение.
const lowerDisplayLeft = computed(() => {
  const baseOffset = 10 - lowerPercent.value * 0.2;
  return `calc(${lowerPercent.value}% + (${baseOffset + extraLower.value}px))`;
});

const upperDisplayLeft = computed(() => {
  const baseOffset = 10 - upperPercent.value * 0.2;
  return `calc(${upperPercent.value}% + (${baseOffset + extraUpper.value}px))`;
});

// Форматирование времени с помощью dayjs
const getTime = (value: number) => {
  return dayjs(props.range.date).add(value, "seconds").format("HH:mm:ss");
}
</script>

<template>
  <!-- Добавляем ref для контейнера -->
  <div class="double-range-slider" ref="sliderContainer">
    <!-- Фоновый трек -->
    <div class="slider-track" :style="rangeStyle"></div>

    <!-- Метки с временем -->
    <div class="time-display lower" :style="{ left: lowerDisplayLeft }">
      {{ getTime(localLower) }}
    </div>
    <div class="time-display upper" :style="{ left: upperDisplayLeft }">
      {{ getTime(localUpper) }}
    </div>

    <!-- Ползунки -->
    <input
        type="range"
        class="range-input lower"
        :min="min"
        :max="max"
        :step="step"
        v-model.number="localLower"
        @input="onLowerInput"
    />
    <input
        type="range"
        class="range-input upper"
        :min="min"
        :max="max"
        :step="step"
        v-model.number="localUpper"
        @input="onUpperInput"
    />
  </div>
</template>

<style scoped lang="scss">
.double-range-slider {
  position: relative;
  width: 100%;
  height: 12px;
}

/* Фоновой трек */
.slider-track {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 8px;
  border-radius: 12px;
}

/* Стили для ползунков */
.range-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 8px;
  background: transparent;
  -webkit-appearance: none;
  appearance: none;
  pointer-events: none;
}
.range-input.lower {
  pointer-events: auto;
}
.range-input.upper {
  pointer-events: auto;
}
.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 12px;
  width: 12px;
  background-color: #fff;
  border-radius: 50%;
  border: 2px solid #298bff;
  box-shadow: 0 0 2px 4px #298bff;
  transition: 0.5s;
  cursor: pointer;
  position: relative;
  z-index: 2;
}
.range-input::-moz-range-thumb {
  height: 12px;
  width: 12px;
  background-color: #fff;
  border-radius: 50%;
  border: 2px solid #298bff;
  transition: 0.5s;
  cursor: pointer;
  position: relative;
  z-index: 2;
}
.range-input::-webkit-slider-runnable-track {
  background: transparent;
}
.range-input::-moz-range-track {
  background: transparent;
}
.range-input:active::-webkit-slider-thumb {
  box-shadow: 0 0 0 4px #298bff;
}
.range-input:active::-moz-range-thumb {
  border-width: 6px;
}

/* Стили для меток с отображением времени */
.time-display {
  position: absolute;
  top: -42px; /* Расстояние над слайдером */
  transform: translateX(-50%);
  background-color: var(--color-background, #000);
  padding: 6px;
  border-radius: 12px;
  font-size: 12px;
  white-space: nowrap;
}
</style>
