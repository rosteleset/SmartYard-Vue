import { onMounted, ref } from "vue";
import { get } from "../api";
import { Camera } from "../types/camera";

export const useCameras = (houseId: number) => {
    const cameras = ref<Camera[]>([])

    onMounted(() => {
        get<Camera[]>('cctv/all', { houseId })
            .then(r => cameras.value = r)
    })

    return {
        cameras,
    }
}