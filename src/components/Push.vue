<script setup lang="ts">
import {usePushStore} from "@/store/push.ts";
import CloseIcon from "@/assets/close.svg?component";
import {useRouter} from "vue-router";
import {MessagePayload} from "firebase/messaging";

const router = useRouter();
const push = usePushStore();

const handler = (notification: MessagePayload) => {
  switch (notification.data?.action) {
    case "inbox":
    case "videoReady":
    case "newAddress":
    case "paySuccess":
    case "chat":
      router.push('/chat');
      break;
    default:
      break;
  }
}
</script>

<template>
  <div class="list">
    <div v-for="message in push.notifications" :key="message.messageId" class="item" :class="`item-${message.messageId}`" @click="handler(message)">
      <CloseIcon class="close-icon" @click.stop="push.removeNotification(message.messageId)"/>
      <p class="title">{{ message.notification?.title }}</p>
      <p class="message">{{ message.notification?.body }}</p>
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
  width: 300px;
  box-shadow: 0 0 12px 3px var(--color-background);
  cursor: pointer;

  p {
    margin: 0;
  }

  .title {
    font-size: 24px;
  }

  .message {
    font-size: 12px;
  }
}

.close-icon {
  cursor: pointer;
  position: absolute;
  top: 12px;
  right: 12px;
}
</style>