// Это не глобальный стор. имеет свой набор камер для каждого экземпляра
// !!! Возможно стоит переместить

import { onMounted, ref } from "vue";
import { Stream } from "../types/camera";
import { useApi } from "./useApi";

export const useRanges = (cameraId: number) => {
  const {get} = useApi()
  const streams = ref<Stream[]>([]);

  onMounted(() => {
    const url = "cctv/ranges";
    get<Stream[]>(url, { cameraId }).then((response)=>streams.value = response || []);
  });

  return {
    streams,
  };
};
