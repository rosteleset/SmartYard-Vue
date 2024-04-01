<script setup lang="ts">
import { computed, ref } from "vue";
import InformationIcon from "@/assets/information.svg?component";
import useEventNames from "@/hooks/useEventNames";
import { Event } from "@/types/events";
import Button from "@/components/Button.vue";
import ImageWithFace from "@/components/ImageWithFace.vue";
import Modal from "@/components/Modal.vue";
import useFaces from "@/hooks/useFaces";
import useLocale from "@/hooks/useLocale";

// Определение пропсов
const props = defineProps<{ event: Event }>();

const { localizedDayjs } = useLocale();
const { eventNames } = useEventNames();
const { add, remove } = useFaces();

// Вычисляемые свойства
const label = computed(() => getEventName(props.event.event));
const time = computed(() =>
  localizedDayjs.value(props.event.date).format("HH:mm")
);
const dateTime = computed(() =>
  localizedDayjs.value(props.event.date).format("dddd, D, MMMM HH:mm")
);
const isModalOpen = ref(false);
const canLike = computed(() => props.event.detailX.flags?.includes("canLike"));
const canDislike = computed(() =>
  props.event.detailX.flags?.includes("canDislike")
);
const color = computed(() => (props.event.detailX.flags?.includes("liked") ? "#1FBC62" : "#FF3B30"));
const isUpdated = ref(false);

// Функции для работы с модальным окном
const openModal = () => {
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
};

const likeHandler = () => {
  add(props.event.uuid).then(() => (isUpdated.value = true));
};

const disLikeHandler = () => {
  remove({ event: props.event.uuid }).then(() => (isUpdated.value = true));
};

// Функция для получения названия события
const getEventName = (event: string) => {
  return eventNames.value[event] || eventNames.value.default;
};
</script>

<template>
  <div class="event" v-on:click="openModal">
    <span>{{ label }}</span>
    <span class="event__time">{{ time }}</span>
    <InformationIcon class="event__button" />
  </div>
  <Modal :title="label" :is-open="isModalOpen" @on-close="closeModal">
    <p>{{ props.event.mechanizmaDescription }}</p>
    <p>{{ dateTime }}</p>
    <ImageWithFace
      v-if="props.event.preview"
      :image-url="props.event.preview"
      :face="props.event.detailX.face"
      :color="color"
    />
    <p v-else class="error">{{ $t("events.image-error") }}</p>
    <div v-if="!isUpdated" class="event__buttons">
      <Button variant="sucsses" v-if="canLike" @click="likeHandler">{{
        $t("events.like")
      }}</Button>
      <Button variant="error" v-if="canDislike" @click="disLikeHandler">{{
        $t("events.dislike")
      }}</Button>
    </div>
  </Modal>
</template>

<style scoped lang="scss">
.event {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-bottom: solid 1px #f0f0f1;
  cursor: pointer;

  &__time {
    margin-left: auto;
  }

  &__button {
    background: none;
    border: 0;
  }

  &__buttons {
    padding: 12px;
    display: flex;
    justify-content: center;
    gap: 12px;
  }
}
.error {
  text-align: center;
  padding: 24px;
}
</style>
