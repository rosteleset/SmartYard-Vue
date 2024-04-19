<script setup lang="ts">
import {useRouter} from "vue-router";
import {computed, ref} from "vue";
import {Invitation, Inviter, Registerer, Session, SessionState, UserAgent, UserAgentOptions} from "sip.js";
import {SimpleUser} from "sip.js/lib/platform/web";

const video = ref<HTMLVideoElement>()
const audio = ref<HTMLVideoElement>()

const router = useRouter()
const {server, extension, pass, callerId, hash, stun} = router.currentRoute.value.query

const image = computed(() => `https://rbt-demo.lanta.me/mobile/call/live/${hash}`)



const uri = UserAgent.makeURI(`sip:${extension}@${server}`);

const transportOptions = {
  server: `wss://${server}/wss`,
  stunServers: [stun?.toString() || "stun:stun.l.google.com:19302"]
};

const userAgentOptions: UserAgentOptions = {
  authorizationPassword: pass?.toString(),
  authorizationUsername: extension?.toString(),
  logLevel: 'error',
  transportOptions,
  uri,
};

const userAgent = new UserAgent(userAgentOptions);
const registerer = new Registerer(userAgent);
userAgent.delegate = {
  onInvite(invitation: Invitation): void {
    console.log("!!! invite", invitation)
    invitation.accept({
      sessionDescriptionHandlerOptions:{
        constraints: { audio: false, video: false }
      }
    })
    // invitation.reject();
  },
  onConnect() {
    console.log('!!! connect')
  },
  onDisconnect() {
    console.log("!!! disconnect")
  },
  onMessage(message) {
    console.log("!!! message", message)
  }
}
userAgent.start().then(() => {
  console.log("!@!", userAgent)
  registerer.register();
  // const target = UserAgent.makeURI("sip:7000000000@preyai.ddns.net");
  // if (target) {
  //   const inviter = new Inviter(userAgent, target);
  //   inviter.invite();
  // }
});


</script>

<template>
  <h1>Вызов {{ callerId }}</h1>
  <!--  <img :src="image" alt="call" class="image"/>-->
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