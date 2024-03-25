<script setup lang="ts">
import { provide, ref } from "vue";
import Header from "./components/Header.vue";
import { useAddressesStore } from "./store/addresses";
import { useUserStore } from "./store/user";
import { watch } from "vue";
import { computed } from "vue";
import { useRouter } from "vue-router";

const addressesStore = useAddressesStore();
const userStore = useUserStore();
const router = useRouter();

const isLoaded = computed(() => userStore.isLoaded && addressesStore.isLoaded);

const isMenuOpen = ref(false);
provide("isMenuOpen", isMenuOpen);

watch(userStore, () => {
  console.log(userStore.error);
  
  if (userStore.error === "Request failed with status code 401")
    router.replace("/");
});
</script>

<template>
  <Header />
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
