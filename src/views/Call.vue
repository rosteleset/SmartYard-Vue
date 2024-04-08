<script setup lang="ts">
import {useRouter} from "vue-router";
import {computed} from "vue";
import {Inviter, SessionState, SIPExtension, UserAgent} from "sip.js";
import {Web} from "sip.js";

// Helper function to get an HTML audio element
function getAudioElement(id: string): HTMLAudioElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLAudioElement)) {
    throw new Error(`Element "${id}" not found or not an audio element.`);
  }
  return el;
}

const router = useRouter()
const query = computed(() => router.currentRoute.value.query)
console.log(query)
const image = computed(() => `https://rbt-demo.lanta.me/mobile/call/live/${query.value.hash}`)

// WebSocket server to connect with
const server = `wss://${query.value.server}/wss`;

// Options for SimpleUser
const options: Web.SimpleUserOptions = {
  aor: `sip:${query.value.extension}@${query.value.server}`, // caller
  media: {
    constraints: {audio: true, video: true}, // audio only call
    // remote: {audio: getAudioElement("remoteAudio")} // play remote audio
  }
};

// Construct a SimpleUser instance
const simpleUser = new Web.SimpleUser(server, options);

// Connect to server and place call
simpleUser.connect()
    .then(() => simpleUser.call(`sip:${query.value.extension}`))
    .catch((error: Error) => {
      console.log(error.message)
    });

</script>

<template>
  <h1>Вызов {{ query.callerId }}</h1>
  <img :src="image" alt="call" class="image"/>
  <video class="video" />
</template>

<style scoped lang="scss">
.image {
  width: 300px;
}
.video {
  width: 300px;
}
</style>