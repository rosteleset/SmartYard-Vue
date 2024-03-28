import { onMounted, ref } from "vue";
import { Stream } from "../types/camera";
import useApi from "./useApi";

const useRanges = (cameraId: number) => {
  const { get } = useApi();
  const streams = ref<Stream[]>([]);

  onMounted(() => {
    const url = "cctv/ranges";
    get<Stream[]>(url, { cameraId }).then(
      (response) => (streams.value = response || [])
    );
  });

  return {
    streams,
  };
};
export default useRanges;
