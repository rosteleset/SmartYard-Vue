<script setup lang="ts">
import DeleteIcon from "@/assets/delete.svg?component";
import PlusIcon from "@/assets/plus.svg?component";
import { Face } from "@/types/faces";
import { inject } from "vue";

const defaultHandlers = {
  selectFace: (_face: Face) => {},
  removeFace: (_face: Face) => {},
  addFace: () => {},
};

const { face } = defineProps<{
  face?: Face;
}>();

const { selectFace, removeFace, addFace } = inject("handlers", defaultHandlers);
</script>
<template>
  <div v-if="!face" class="face" @click="addFace">
    <div class="face__image face__plus">
      <PlusIcon />
    </div>
  </div>

  <div v-else class="face">
    <img
      class="face__image"
      :src="face.image"
      :alt="face.faceId"
      @click="selectFace(face)"
    />
    <button @click="removeFace(face)">
      <DeleteIcon />
    </button>
  </div>
</template>
<style scoped lang="scss">
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
    object-fit: cover;
  }
  &__plus {
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
</style>
