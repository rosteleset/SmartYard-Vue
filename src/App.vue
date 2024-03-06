<script setup lang="ts">
import { provide, ref } from "vue";
import Header from "./components/Header.vue";

const isMenuOpen = ref(false);
provide("isMenuOpen", isMenuOpen);
</script>

<template>
  <Header />
  <div class="content" :class="{ 'menu-open': isMenuOpen }">
    <router-view></router-view>
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
