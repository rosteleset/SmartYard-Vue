<script setup lang="ts">
import { provide, ref } from "vue";
import Header from "./components/Header.vue";
import { useAdressesStore } from "./store/addresses";
import { useUserStore } from "./store/user";

const isMenuOpen = ref(false);
provide("isMenuOpen", isMenuOpen);

const adressesStore = useAdressesStore();
const userStore = useUserStore();
</script>

<template>
  <Header />
  <div class="content" :class="{ 'menu-open': isMenuOpen }">
    <div class="container">
      <router-view v-if="userStore.isLoaded && adressesStore.isLoaded" />
      <template v-else-if="userStore.error">
        <div class="global-error">{{ userStore.error }}</div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.content {
  transition: 0.5s ease-out;
  z-index: 1;
  &.menu-open {
    transform: translateY(100px);
  }
}
</style>
