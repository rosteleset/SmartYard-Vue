import {onMounted, ref} from "vue";
import {Camera} from "../types/camera";
import useApi from "./useApi";

const useCameras = ({houseId, overview}: {
    houseId?: string;
    overview?: boolean;
}) => {
    const {get} = useApi()
    const cameras = ref<Camera[]>([]);

    const load = () => {
        const url = overview ? "cctv/overview" : "cctv/all";
        get<Camera[]>(url, {houseId}).then((r) => cameras.value = r || []);
        // cameras.value = [
        //     {
        //         "id": 24,
        //         "name": "Толстого, 41 /п-к Толстого — Будённого",
        //         "lat": "58.138126",
        //         "lon": "52.687992",
        //         "url": "https://fpst.garant.tv/system-api/GetTranslationURL?CameraID=9",
        //         "token": "AdminLogin=rbtad&AdminPassword=f782b4b226c5c768&UserLogin=full-access&UserIP=0.0.0.0&Format=HLS&LightStream=0",
        //         "serverType": "forpost",
        //         "hasSound": false,
        //         "hlsMode": "mpegts"
        //     }
        // ]
    }

    onMounted(load);

    return {
        cameras,
    };
};

export default useCameras