<script setup lang="ts">
import { provide, ref } from "vue";
import Header from "./components/Header.vue";
import { useAddressesStore } from "./store/addresses";
import { useUserStore } from "./store/user";
import axios from "axios";

const addressesStore = useAddressesStore();
const userStore = useUserStore();

const isMenuOpen = ref(false);
provide("isMenuOpen", isMenuOpen);

// axios
//   .post("/fpst/system-api/GetTranslationURL")
//   .then((r) => console.log(r));
</script>

<template>
  <Header />
  <router-view v-slot="{ Component }">
    <Transition name="route" mode="out-in">
      <div class="content" :key="$route.fullPath">
        <div class="container">
          <component
            v-if="userStore.isLoaded && addressesStore.isLoaded && Component"
            :is="Component"
          />
          <template v-else-if="userStore.error">
            <div class="global-error">{{ userStore.error }}</div>
          </template>
          <div v-else class="welcome">Welcome</div>
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
