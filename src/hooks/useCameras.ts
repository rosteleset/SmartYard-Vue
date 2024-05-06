import {onMounted, ref} from "vue";
import {Camera} from "../types/camera";
import useApi from "./useApi";

const useCameras = ({houseId, overview}: {
    houseId?: string;
    overview?: boolean;
}) => {
    const {get} = useApi()
    const cameras = ref<Camera[]>([]);
    const current = ref<Camera>();

    const load = () => {
        const url = overview ? "cctv/overview" : "cctv/all";
        get<Camera[]>(url, {houseId}).then((r) => cameras.value = r || []);
    }
    const select = (camera?: Camera) => {
        current.value = camera;
    };

    onMounted(load);

    return {
        cameras,
        select,
    };
};

export default useCameras