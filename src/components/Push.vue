<script setup lang="ts">
import {getMessaging, MessagePayload, onMessage} from "firebase/messaging"
import {onMounted, ref} from "vue";
import {getFirebaseApp, getToken} from "@/firebase";
import {useRouter} from "vue-router";
import useApi from "@/hooks/useApi.ts";

const {request} = useApi()
const router = useRouter();
const firebaseApp = getFirebaseApp();
const messaging = getMessaging(firebaseApp);
const messages = ref<MessagePayload[]>([])

getToken().then(token => {
  const storageToken = localStorage.getItem('push-token')
  console.log(token)
  if (token !== storageToken) {
    localStorage.setItem('push-token', token)
    request('user/registerPushToken', {pushToken: token, platform: "android"})
  }
})

const removeMessage = (message: MessagePayload) => {
  messages.value = messages.value.filter(m => m.messageId !== message.messageId)
}

onMessage(messaging, (event) => {
  console.log(event)
  if (event.data?.action)
    messages.value.push(event)
  else {
    router.push({path: "/call", query: event.data})
  }
})

onMounted(() => {
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data.type === "push-message")
      messages.value.push(event.data.payload)
  });
})
</script>

<template>
  <div class="list">
    <div v-for="message in messages" :key="message.messageId" class="item" @click="removeMessage(message)">
      <p>Title: {{ message.notification?.title }}</p>
      <p>Body: {{ message.notification?.body }}</p>
      <p>Badge: {{ message.data?.badge }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list {
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
}

.item {
  background-color: var(--color-second-background);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 12px;
  min-width: 300px;

  p {
    margin: 0;
  }
}
</style>