<script setup lang="ts">
import {nextTick, onMounted, ref} from "vue";
import closeIcon from "@/assets/close.svg?component";
import {watch} from "vue";

const props = defineProps<{
  title?: string;
  isOpen: boolean;
}>();

const emit = defineEmits(["onClose"]);
const bodyVisible = ref(false);

const close = () => {
  emit("onClose");
};

const initClose = async () => {
  bodyVisible.value = false;
  await nextTick()
  close()
  // setTimeout(close, 500)
};
watch(
    () => props.isOpen,
    async () => {
      if (props.isOpen) {
        document.body.classList.add("scroll-block");
        await nextTick()
        bodyVisible.value = true
      } else document.body.classList.remove("scroll-block");
    }
);

onMounted(() => {
  if (props.isOpen)
    bodyVisible.value = true;
})
</script>

<template>
  <teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="modal__overlay" @click="initClose">
        <Transition name="modal">
          <div v-if="bodyVisible" class="modal" @click.stop>
            <div class="modal__header">
              <h3 v-if="title">{{ title }}</h3>
              <button
                  class="modal__close"
                  :class="{ absolute: !title }"
                  @click="initClose"
              >
                <closeIcon/>
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
  background-color: var(--color-second-background);
  padding: 20px;
  border-radius: 5px;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;

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
      color: var(--color-text);
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
    margin-left: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &.absolute {
      position: absolute;
      bottom: 100%;
      left: 100%;
    }

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
