import {onMounted, ref} from "vue";
import {Camera, Stream} from "../types/camera";
import useApi from "./useApi";
import axios from "axios";

const useRanges = (camera: Camera) => {
    const {get} = useApi();
    const streams = ref<Stream[]>([]);

    const getRbtRanges = () => {
        const url = "cctv/ranges";
        get<Stream[]>(url, {cameraId: camera.id}).then(
            (response) => (streams.value = response || [])
        ).catch(e => {
            console.warn(e)
        })
    }

    const getDmRanges = () => {
        axios.get(`${camera.url}/recording_status.json`)
            .then(res => {
                streams.value = Object.keys(res.data).map(key => ({
                        stream: camera.url,
                        ranges: [{
                            from: res.data[key].from,
                            duration: res.data[key].to - res.data[key].from,
                        }]
                    })
                )
            })
    }
    onMounted(() => {
        if (camera.serverType)
            getRbtRanges()
        else
            getDmRanges()
    });

    return {
        streams,
    };
};
export default useRanges;
