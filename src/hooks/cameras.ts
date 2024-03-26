// Это не глобальный стор. имеет свой набор камер для каждого экземпляра
// !!! Возможно стоит переместить

import { onMounted, ref } from "vue";
import { Camera } from "../types/camera";
import { useApi } from "./useApi";

export const useCameras = ({
  houseId,
  overview
}: {
  houseId?: string;
  overview?: boolean;
}) => {
  const {get} = useApi()
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
