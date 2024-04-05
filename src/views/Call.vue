<script setup lang="ts">
import {useRouter} from "vue-router";
import {computed} from "vue";

const router = useRouter()
const query = computed(() => router.currentRoute.value.query)
const image = computed(() => `https://rbt-demo.lanta.me/call/camshot/${query.value.hash}`)


var socket = new JsSIP.WebSocketInterface('wss://your-asterisk-server-ip:8089/ws');
var configuration = {
  sockets: [socket],
  uri: 'sip:2000002848@your-asterisk-server-ip',
  authorization_user: '2000002848',
  password: '14b4fef2ee59cf08d5501c64c46a8b7d',
  register: true,
  session_timers: false,
  no_answer_timeout: 60,
  stun_servers: ['stun:stun.l.google.com:19302']
};


</script>

<template>
  <h1>Вызов {{query.callerId}}</h1>
  <img :src="image" alt="call"/>
</template>

<style scoped lang="scss">

</style>