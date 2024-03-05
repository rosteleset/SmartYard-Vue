// Это не глобальный стор. имеет свой набор камер для каждого экземпляра
// !!! Возможно стоит переместить

import { onMounted, ref } from "vue";
import { get } from "../api";
import { Ranges } from "../types/camera";

export const useRanges = (cameraId: number) => {
  const ranges = ref<Ranges[]>([]);

  onMounted(() => {
    const url = "cctv/ranges";
    get<Ranges[]>(url, { cameraId }).then((response)=>ranges.value = response);
    console.log(ranges.value);
  });

  return {
    ranges,
  };
};
