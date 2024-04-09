<script setup lang="ts">
import {useRouter} from "vue-router";
import {computed, ref} from "vue";
import {debug, UA, WebSocketInterface} from "jssip";
import {IncomingRTCSessionEvent, UAConfiguration} from "jssip/lib/UA";
import {AnswerOptions} from "jssip/lib/RTCSession";

const video = ref<HTMLVideoElement>()
const audio = ref<HTMLVideoElement>()

const router = useRouter()
const {server, extension, pass, callerId, hash, stun} = router.currentRoute.value.query

const image = computed(() => `https://rbt-demo.lanta.me/mobile/call/live/${hash}`)

debug.enable('JsSIP:*')

const socket = new WebSocketInterface(`wss://${server}/wss`);
const configuration: UAConfiguration = {
  sockets: [socket],
  uri: `sip:${extension}@${server}`,
  password: pass?.toString(),
};

navigator.mediaDevices.getUserMedia({video: false, audio: true})
    .then(stream => {
      const userAgent = new UA(configuration);

      userAgent.start();

      const options: AnswerOptions = {
        'mediaConstraints': {'audio': true, 'video': false},
        mediaStream: stream,
        pcConfig: {
          iceServers: [{urls: stun?.toString() || "stun:stun.l.google.com:19302"}]
        }
      };

      userAgent.on('newRTCSession', (event: IncomingRTCSessionEvent) => {
        const session = event.session;

        if (session.direction === "incoming") {
          session.answer(options)
          // incoming call here
          session.on("accepted", function () {
            // the call has answered
            console.log(1)
          });
          session.on("confirmed", function () {
            console.log(2)
          });
          session.on("ended", function () {
            // the call has ended
            console.log(3)
          });
          session.on("failed", function (e) {
            // unable to establish the call
            console.log(e)
          });

          // Reject call (or hang up it)
          // session.terminate();
        }
      })
    })


// const session = userAgent.call('100002@rbt-demo.lanta.me', options);

</script>

<template>
  <h1>Вызов {{ callerId }}</h1>
  <img :src="image" alt="call" class="image"/>
  <video ref="video" class="video"/>
  <audio ref="audio" class="audio"/>

</template>

<style scoped lang="scss">
.image {
  width: 300px;
}

.video {
  width: 300px;
}
</style>