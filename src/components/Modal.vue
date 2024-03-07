<script setup lang="ts">
import { ref } from "vue";
import closeIcon from "../assets/close.svg";
const props = defineProps<{
  title: string;
  isOpen: boolean;
}>();

const emit = defineEmits(["onClose"]);
const bodyVisible = ref(false);

const close = () => {
  emit("onClose");
};

const initClose = () => {
  bodyVisible.value = false;
};
</script>

<template>
  <teleport to="body">
    <Transition name="fade" @enter="bodyVisible = true">
      <div v-if="isOpen" class="modal__overlay" @click="initClose">
        <Transition name="modal" @leave="close">
          <div v-if="bodyVisible" class="modal" @click.stop>
            <div class="modal__header">
              <h3>{{ props.title }}</h3>
              <button class="modal__close" @click="initClose">
                <img :src="closeIcon" alt="close" />
              </button>
            </div>
            <div class="modal__body">
              <slot></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </teleport>
</template>

<style scoped lang="scss">
.modal {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;

  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    h3 {
      margin: 0;
    }
  }

  &__body {
    padding: 10px 0;
    height: 100%;
    overflow: auto;
  }

  &__close {
    background: none;
    border: solid 1px #6d7a8a;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      display: block;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transform: scale(1);
  transition: 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  transform: scale(0);
}
</style>
