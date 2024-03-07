// Это не глобальный стор. имеет свой набор камер для каждого экземпляра
// !!! Возможно стоит переместить

import { onMounted, ref } from "vue";
import { get } from "../api";
import { Camera } from "../types/camera";

export const useCameras = ({
  houseId,
  overview = false,
}: {
  houseId?: string;
  overview?: boolean;
}) => {
  const cameras = ref<Camera[]>([]);
  const current = ref<Camera>();

  onMounted(() => {
    const url = overview ? "cctv/overview" : "cctv/all";
    get<Camera[]>(url, { houseId }).then((r) => cameras.value = r || []);
    
  });

  const select = (camera?: Camera) => {
    current.value = camera;
  };

  return {
    cameras,
    select,
  };
};
