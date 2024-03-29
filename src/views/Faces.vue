<script setup lang="ts">
import Button from "@/components/Button.vue";
import FacesList from "@/components/FacesList.vue";
import useFaces from "@/hooks/useFaces";
import { useAddressesStore } from "@/store/addresses.ts";
import { Face } from "@/types/faces";
import { provide, ref } from "vue";
import { useRouter } from "vue-router";
import Modal from "@/components/Modal.vue";

const { flatId } = defineProps<{
  flatId: string;
}>();

const { faces, remove } = useFaces(flatId);
const { getAddressByFlatId } = useAddressesStore();
const router = useRouter();

const house = getAddressByFlatId(flatId);
const selectedFace = ref<Face>();
const removedFace = ref<Face>();

const selectFace = (face: Face) => {
  selectedFace.value = face;
};
const removeFace = (face: Face) => {
  removedFace.value = face;
};
const addFace = () => {
  router.push(`/events/${house?.houseId}`);
};

const removeHandler = () => {
  if (removedFace.value) {
    remove({ faceId: removedFace.value.faceId, flatId: flatId });
    removedFace.value = undefined;
  }
};

provide("handlers", {
  selectFace,
  removeFace,
  addFace,
});
</script>
<template>
  <template v-if="!house"><div class="global-error">404</div></template>
  <template v-else>
    <div class="label">{{ $t("settings.frs") }}</div>
    <FacesList :faces="faces" />

    <p>
      Фотографии ваших гостей хранятся в разделе История событий. {{ "\n" }}Для
      выбора и регистрации лица перейдите в указанный раздел, кликнув на Плюс. В
      Истории событий кликните на значок информации напротив нужного события и
      на открывшемся экране выберите необходимое фото.
    </p>

    <Modal
      :isOpen="selectedFace !== undefined"
      @onClose="selectedFace = undefined"
    >
      <img :src="selectedFace?.image" :alt="selectedFace?.faceId" />
    </Modal>
    <Modal
      :isOpen="removedFace !== undefined"
      @onClose="removedFace = undefined"
      :title="$t('faces.delete-face')"
    >
      <div class="delete-form">
        <img :src="removedFace?.image" :alt="removedFace?.faceId" />
        <Button variant="error" @click="removeHandler">{{
          $t("faces.delete")
        }}</Button>
        <Button variant="primary" bordered @click="removedFace = undefined">{{
          $t("faces.cancel")
        }}</Button>
      </div>
    </Modal>
  </template>
</template>
<style scoped lang="scss">
.label {
  font-size: 24px;
  margin: 24px 0;
}
.delete-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
</style>
