<script setup lang="ts">
import {useRouter} from "vue-router";
import {computed, ref} from "vue";
import {
  Invitation, InvitationAcceptOptions,
  Inviter, Referral,
  Registerer,
  RegistererOptions, Session,
  SessionState,
  SIPExtension,
  UserAgent,
  UserAgentOptions
} from "sip.js";
import {SimpleUser, SimpleUserOptions} from "sip.js/lib/platform/web";

const video = ref<HTMLVideoElement>()
const audio = ref<HTMLVideoElement>()

const router = useRouter()
const query = computed(() => router.currentRoute.value.query)

console.log(query.value)
const image = computed(() => `https://rbt-demo.lanta.me/mobile/call/live/${query.value.hash}`)

const options: SimpleUserOptions = {
  aor: `sip:${query.value.extension}@${query.value.server}`,
  userAgentOptions: {
    authorizationPassword: query.value.pass?.toString(),
    logLevel: "error",
    delegate: {
      onInvite: (inv) => {
        console.log(inv)
        inv.accept()
      }
    }
  },
  media: {
    remote: {
      audio: audio.value,
    }
  }
};


const simpleUser = new SimpleUser(`wss://${query.value.server}/wss`, options);

// Supply delegate to handle inbound calls (optional)
simpleUser.delegate = {
  onCallReceived: async () => {
    console.log("received call")
    await simpleUser.answer();
  }
};

// Connect to server
await simpleUser.connect().then(() => console.log("Connected"));
// Register to receive inbound calls (optional)
await simpleUser.register().then(() => console.log("Registered"));

console.log(simpleUser)

await simpleUser.call("sip:100002@rbt-demo.lanta.me");

// const onInvite = (invitation: Invitation) => {
//   console.log(invitation)
//   let constrainsDefault: MediaStreamConstraints = {
//     audio: true,
//     video: false,
//   }
//
//   const options: InvitationAcceptOptions = {
//     sessionDescriptionHandlerOptions: {
//       constraints: constrainsDefault
//     },
//   }
//   invitation.accept(options);
// }
//
// // Create user agent instance (caller)
// const userAgent = new UserAgent({
//   uri: UserAgent.makeURI(`sip:${query.value.extension}@${query.value.server}`),
//   authorizationUsername: query.value.extension?.toString(),
//   authorizationPassword: query.value.pass?.toString(),
//   logLevel: "error",
//
//   sessionDescriptionHandlerFactoryOptions: {
//     iceGatheringTimeout: 500, //currently, the smallest allowed value
//     peerConnectionConfiguration: {
//       iceServers: [{urls: [query.value.stun?.toString()]}]
//     }
//   },
//   transportOptions: {
//     server: `wss://${query.value.server}/wss`
//   },
//   delegate: {
//     onInvite
//   }
// });
//
// const registererOptions: RegistererOptions = { /* ... */};
// const registerer = new Registerer(userAgent, registererOptions);
//
//
// // Connect the user agent
userAgent.start().then(() => {

  registerer.register()
  console.log("ok")

  console.log(userAgent)

});
</script>

<template>
  <h1>Вызов {{ query.callerId }}</h1>
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