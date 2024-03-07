import { onMounted, ref } from "vue";
import { get, request } from "../api";
import { Face } from "../types/faces";

export const useFaces = (flatId?: string) => {
  const faces = ref<Face[]>([]);

  const load = () => {
    if (!flatId) return;
    const url = "frs/listFaces";
    get<Face[]>(url, { flatId }).then(
      (response) => (faces.value = response || []) // при пустом списке приходит 204, поэтому пустой массив вместо undefined
    );
  };

  const add = async (event: string, comment?: string): Promise<string> => {
    const url = "frs/like";
    const response = await request(url, { event, comment });
    return response.faceId;
  };

  const remove = async (params: {
    event?: string;
    flatId?: string;
    faceId?: string;
  }) => {
    const url = "frs/disLike";
    await request(url, params);
    load();
    return;
  };

  onMounted(load);

  return {
    faces,
    add,
    remove,
  };
};
