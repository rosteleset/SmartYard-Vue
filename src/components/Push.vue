<script setup lang="ts">
import {usePushStore} from "@/store/push.ts";
import CloseIcon from "@/assets/close.svg?component";
import {useRouter} from "vue-router";

const router = useRouter();
const {notifications, removeNotification} = usePushStore()
</script>

<template>
  <div class="list">
    <div v-for="message in notifications" :key="message.messageId" class="item" @click="router.push('/chat')">
      <CloseIcon class="close-icon" @click.stop="removeNotification(message)"/>
      <p>Title: {{ message.notification?.title }}</p>
      <p>Body: {{ message.notification?.body }}</p>
      <p>Badge: {{ message.data?.badge }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list {
  position: absolute;
  right: 24px;
  top: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
}

.item {
  position: relative;
  background-color: var(--color-second-background);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 12px;
  min-width: 300px;
  box-shadow: 0 0 12px 3px var(--color-background);
  cursor: pointer;

  p {
    margin: 0;
  }
}

.close-icon {
  cursor: pointer;
  position: absolute;
  top: 12px;
  right: 12px;
}
</style>