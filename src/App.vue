<script setup lang="ts">
import {computed, provide, ref} from "vue";
import Header from "@/components/Header.vue";
import {useAddressesStore} from "@/store/addresses";
import {useUserStore} from "@/store/user";
import {useConfigStore} from "@/store/config.ts";

const addressesStore = useAddressesStore();
const userStore = useUserStore();
// const configStore = useConfigStore();
// switch (configStore.getTheme()) {
//   case "dark":
//     import("@/style/dark.scss")
//     break;
//   case "light":
//     import("@/style/light.scss")
//     break;
//   default:
//     import("@/style/light.scss")
//     break;
// }

const isLoaded = computed(() => userStore.isLoaded && addressesStore.isLoaded);

const isMenuOpen = ref(false);
provide("isMenuOpen", isMenuOpen);

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
