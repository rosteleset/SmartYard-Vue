<script setup lang="ts">
import {computed, provide, ref} from "vue";
import Header from "@/components/Header.vue";
import {useAddressesStore} from "@/store/addresses";
import {useUserStore} from "@/store/user";
import Push from "@/components/Push.vue";
import Call from "@/components/Call.vue";

const addressesStore = useAddressesStore();
const userStore = useUserStore();

const isLoaded = computed(() => userStore.isLoaded);

const isMenuOpen = ref(false);
provide("isMenuOpen", isMenuOpen);

</script>

<template>
  <Header/>
  <Push/>
  <template v-if="userStore.isLoaded && userStore.isAuth">
    <Call/>
  </template>
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

<style scoped lang="scss">
@use "./style/variables" as *;

.welcome {
  margin: 24px 0;
  text-align: center;
  font-size: 200%;
}

.content {
  transition: 0.3s ease-out;
  z-index: 1;
  background-color: var(--color-background);
  color: var(--color-text);
  border-radius: $size * 2 $size * 2 0 0;
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: calc($size / 2);
    overflow: hidden;
    border-radius: 24px;
  }

  &::-webkit-scrollbar-track {
    margin-top: $size + 3px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    outline: 1px solid slategrey;
    border-radius: 24px;
  }

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
