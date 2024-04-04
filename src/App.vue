<script setup lang="ts">
import {computed, provide, ref} from "vue";
import Header from "@/components/Header.vue";
import {useAddressesStore} from "@/store/addresses";
import {useUserStore} from "@/store/user";
import {useRegisterSW} from 'virtual:pwa-register/vue'
import {initializeApp} from "firebase/app";
import {getMessaging, getToken,onMessage} from "firebase/messaging";

const addressesStore = useAddressesStore();
const userStore = useUserStore();

const isLoaded = computed(() => userStore.isLoaded && addressesStore.isLoaded);

const isMenuOpen = ref(false);
provide("isMenuOpen", isMenuOpen);



const firebaseConfig = {
  apiKey: "AIzaSyAFkbkOT0gId8ZVh44nSBVpkMeQQbCN6oc",
  authDomain: "rosteleset-d38e1.firebaseapp.com",
  projectId: "rosteleset-d38e1",
  storageBucket: "rosteleset-d38e1.appspot.com",
  messagingSenderId: "13160569054",
  appId: "1:13160569054:web:c6bbb75e09b56844078a4f",
};

const firebaseApp = initializeApp(firebaseConfig);

const messaging = getMessaging(firebaseApp);
// navigator.serviceWorker.getRegistration().then((registration) => {
//   getToken(messaging, {
//     vapidKey: "BNCFz9Y0C8bn6siEF-_Mu2CrdITso6rWKLXhF30yh2aa8vFkNp8dgmSfe6n5nq3ORPoynmH3kQuAKJC-KKy7rIc",
//     serviceWorkerRegistration: registration
//   })
//       .then(r => console.log(r))
// })

onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
});


</script>

<template>
  <Header/>
  <router-view v-slot="{ Component }">
    <Transition name="route" mode="out-in">
      <div class="content" :key="$route.fullPath">
        <div class="container">
          <component
              v-if="isLoaded && Component"
              :is="Component"
          />
        </div>
      </div>
    </Transition>
  </router-view>
</template>

<style scoped>
.welcome {
  margin: 24px 0;
  text-align: center;
  font-size: 200%;
}

.content {
  transition: 0.3s ease-out;
  z-index: 1;

  &.menu-open {
    margin-top: 50px;
  }
}

.route-enter-to,
.route-leave-from {
  transform: translateY(0);
}

.route-enter-from {
  transform: translateY(100%);
}

.route-leave-to {
  transform: translateY(100%);
}
</style>
