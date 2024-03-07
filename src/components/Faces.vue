<script setup lang="ts">
import { inject, ref } from "vue";
import deleteIcon from "../assets/delete.svg";
import plusIcon from "../assets/plus.svg";
import { useFaces } from "../hooks/faces";
import { Face } from "../types/faces";
import Button from "./Button.vue";
import Modal from "./Modal.vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  flatId: string;
}>();
const houseId = inject<string>("houseId")
const router = useRouter()
const { faces, remove } = useFaces(props.flatId);
const selectedFace = ref<Face>();
const removedFace = ref<Face>();

const removeHandler = () => {
  if (removedFace.value) {
    remove({ faceId: removedFace.value.faceId, flatId: props.flatId });
    removedFace.value = undefined;
  }
};

const openEventsHandler = () => {
  router.push(`/events/${houseId}`)
}
</script>
<template>
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
  <Modal
    :isOpen="selectedFace !== undefined"
    @onClose="selectedFace = undefined"
  >
    <img :src="selectedFace?.image" :alt="selectedFace?.faceId" />
  </Modal>
  <Modal
    :isOpen="removedFace !== undefined"
    @onClose="removedFace = undefined"
    title="Удалить это лицо"
  >
    <div class="delete-form">
      <img :src="removedFace?.image" :alt="removedFace?.faceId" />
      <Button variant="error" @click="removeHandler">удалить</Button>
      <Button variant="primary" bordered @click="removedFace = undefined"
        >отмена</Button
      >
    </div>
  </Modal>
</template>
<style scoped lang="scss">
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
