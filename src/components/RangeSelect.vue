<script setup lang="ts">
import { computed, ref } from "vue";
import { useLocaleStore } from "../store/locale";
import { Stream, Range, FormatedRange } from "../types/camera";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import dayjs from "dayjs";



const { streams } = defineProps<{
  streams: Stream[];
}>();
const model = defineModel<FormatedRange>()

const { locale, localizedDayjs } = useLocaleStore();

const ranges = streams.flatMap((stream) =>
  stream.ranges.flatMap((range) => splitRangeIntoParts(range, stream.stream))
);

function splitRangeIntoParts(range: Range, stream:string): FormatedRange[] {
  const parts: FormatedRange[] = [];
  const maxDuration = 3 * 60 * 60; // 3 часа в секундах

  let remainingDuration = range.duration;
  let currentFrom = range.from;

  while (remainingDuration > 0) {
    const partDuration = Math.min(remainingDuration, maxDuration);
    parts.push({
      from: currentFrom,
      duration: partDuration,
      date: timestampToDate(currentFrom),
      streamUrl:stream
    });

    currentFrom += partDuration;
    remainingDuration -= partDuration;
  }

  return parts;
}

function timestampToDate(timestamp: number) {
  const date = new Date(timestamp * 1000); // Умножаем на 1000, так как Unix timestamp в секундах
  return date;
}

// Получение массива дат из массива данных
const datesArray = computed(() =>
  streams.flatMap((item) =>
    item.ranges.map((range) => timestampToDate(range.from))
  )
);
const date = ref();
</script>
<template>
  <VueDatePicker
    v-model="date"
    inline
    :locale="locale"
    :allowedDates="datesArray"
    :enableTimePicker="false"
    autoApply
  />
  <ul class="list">
    <li v-for="range in ranges.filter(range=> date && dayjs(range.date).isSame(date, 'day'))" class="range" :class="{active: model?.from === range.from}" @click="model = range">
      {{ localizedDayjs(range.from * 1000).format("HH:mm") }} -
      {{
        localizedDayjs(range.from * 1000)
          .add(range.duration, "second")
          .format("HH:mm")
      }}
    </li>
  </ul>
</template>
<style scoped lang="scss">
.list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.range {
  border: solid 1px #F0F0F1;
  padding: 6px;
  cursor: pointer;
  &.active {
    background-color: #298BFF;
    color: #FFFFFF;
  }
}
</style>
