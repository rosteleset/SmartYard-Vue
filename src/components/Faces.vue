<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import deleteIcon from "../assets/delete.svg";
import plusIcon from "../assets/plus.svg";
import { useFaces } from "../hooks/faces";
import { useAddressesStore } from "../store/addresses";
import { Face } from "../types/faces";
import Button from "./Button.vue";
import Modal from "./Modal.vue";

const { flatId } = defineProps<{
  flatId: string;
}>();
const router = useRouter();
const { faces, remove } = useFaces(flatId);
const { getAddressByFlatId } = useAddressesStore();
const selectedFace = ref<Face>();
const removedFace = ref<Face>();
const house = getAddressByFlatId(flatId);

const removeHandler = () => {
  if (removedFace.value) {
    remove({ faceId: removedFace.value.faceId, flatId: flatId });
    removedFace.value = undefined;
  }
};

const openEventsHandler = () => {
  router.push(`/events/${house?.houseId}`);
};
</script>
<template>
  <div class="label">{{ $t('settings.frs') }}</div>
  <div class="list">
    <div class="face" v-for="face in faces" :key="face.faceId">
      <img
        class="face__image"
        :src="face.image"
        :alt="face.faceId"
        @click="selectedFace = face"
      />
      <button @click="removedFace = face">
        <img :src="deleteIcon" alt="delete" />
      </button>
    </div>
    <div class="face__plus" @click="openEventsHandler">
      <img :src="plusIcon" alt="add" />
    </div>
  </div>
  <p>
    Фотографии ваших гостей хранятся в разделе История событий. {{ "\n" }}Для
    выбора и регистрации лица перейдите в указанный раздел, кликнув на Плюс. В
    Истории событий кликните на значок информации напротив нужного события и на
    открывшемся экране выберите необходимое фото.
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
    title="$t('faces.delete-face')"
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
<style scoped lang="scss">
.label {
  font-size: 24px;
  margin: 24px 0;
}
.list {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}
.face {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  &__image {
    display: block;
    border-radius: 50%;
    width: 80px;
    height: 80px;
  }
  &__plus {
    display: block;
    border: solid 1px #f3f4fa;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  button {
    background: none;
    border: 0;
    box-shadow: none;
    cursor: pointer;
  }
}
.delete-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
</style>
