<script setup lang="ts">
import { provide, ref } from "vue";
import Header from "./components/Header.vue";
import { useAdressesStore } from "./store/addresses";
import { useUserStore } from "./store/user";

const adressesStore = useAdressesStore();
const userStore = useUserStore();

const isMenuOpen = ref(false);
provide("isMenuOpen", isMenuOpen);

</script>

<template>
  <Header />
  <router-view v-slot="{ Component }" >
    <Transition name="route" mode="out-in">
      <div
        class="content"
        :class="{ 'menu-open': isMenuOpen }"
        :key="$route.fullPath"
      >
        <div class="container">
          <component
            v-if="userStore.isLoaded && adressesStore.isLoaded"
            :is="Component"
          />

          <template v-else-if="userStore.error">
            <div class="global-error">{{ userStore.error }}</div>
          </template>
        </div>
      </div>
    </Transition>
  </router-view>
</template>

<style scoped>
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
