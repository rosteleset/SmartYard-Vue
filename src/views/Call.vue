<script setup lang="ts">
import {useRouter} from "vue-router";
import {computed, ref} from "vue";
import {Invitation, Inviter, UserAgent, UserAgentOptions} from "sip.js";

const video = ref<HTMLVideoElement>()
const audio = ref<HTMLVideoElement>()

const router = useRouter()
const {server, extension, pass, callerId, hash, stun} = router.currentRoute.value.query

const image = computed(() => `https://rbt-demo.lanta.me/mobile/call/live/${hash}`)

function onInvite(invitation: Invitation) {
  invitation.accept();
}

const uri = UserAgent.makeURI("sip:4000000001@preyai.ddns.net");

const transportOptions = {
  server: "wss://preyai.ddns.net/wss"
};

const userAgentOptions: UserAgentOptions = {
  authorizationPassword: '4000000001',
  authorizationUsername: '4000000001',
  delegate: {
    onInvite
  },
  transportOptions,
  uri
};

const userAgent = new UserAgent(userAgentOptions);

userAgent.start().then(() => {
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