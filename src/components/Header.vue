<script setup lang="ts">
import { computed, inject, ref, Ref, watch } from "vue";
import {
  RouteLocationNormalizedLoaded,
  RouteRecord,
  useRouter,
} from "vue-router";
import { useLocale } from "../hooks/locale.ts";
import Arrow from "./Arrow.vue";
import Nav from "./Nav.vue";
import { useConfigStore } from "../store/config.ts";

const { t } = useLocale();
const { currentRoute, getRoutes, back } = useRouter();
const routes = getRoutes();
const { config } = useConfigStore();
const alwaysMenu = computed(() => config["alwaysMenu"]);
const isMenuOpen: Ref<boolean> = inject("isMenuOpen") || ref(false);
const menuList = ref<HTMLElement | null>(null);
const height = ref("0px");

const isFirst = ref(!!history.state.back);

const getRouteName = (route: RouteLocationNormalizedLoaded | RouteRecord) =>
  typeof route.name === "string" && t(`routes.${route.name}`);

watch(
  menuList,
  () =>
    (height.value = menuList.value
      ? menuList.value.getBoundingClientRect().height + "px"
      : height.value)
);
watch(currentRoute, () => {
  isFirst.value = !!history.state.back;
  isMenuOpen.value = false;
});
</script>

<template>
  <header>
    <div class="container">
      <div class="header__grid">
        <Transition name="fade">
          <Arrow v-if="isFirst" @click="back" />
        </Transition>
        <div class="header__label">
          SmartYard-WEB : {{ currentRoute && getRouteName(currentRoute) }}
        </div>
        <div v-if="!alwaysMenu" class="nav">
          <Nav />
        </div>
      </div>

      <Transition name="height" to>
        <div class="menu" v-if="alwaysMenu || isMenuOpen">
          <div class="menu__list" ref="menuList">
            <RouterLink
              v-for="route in routes.filter((route) => route.name)"
              :to="route.path"
              >{{ getRouteName(route) }}</RouterLink
            >
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<style scoped lang="scss">
header {
  position: relative;
}
.container {
  padding-bottom: 0;
  padding-top: 0;
}
.header__grid {
  display: grid;
  grid-template-areas: ". label menu";
  grid-template-columns: 1fr 3fr 1fr;
  align-items: center;
}

.header__label {
  grid-area: label;
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  padding: 24px 0;
  @media (max-width: 480px) {
    font-size: 24px;
  }
}
.nav {
  grid-area: menu;
  display: flex;
  justify-content: end;
}

.menu {
  width: 100%;
  z-index: 0;

  &__list {
    display: flex;
    justify-content: center;
    gap: 24px;
    padding: 24px;

    @media (max-width: 480px) {
      flex-direction: column;
      align-items: center;
    }
  }
  a {
    color: #ffffff;
    font-size: 24px;
    text-decoration: none;
    transition: 0.5s ease-out;
    &:hover {
      transform: translateY(-6px);
    }
  }
}

.height-enter-active,
.height-leave-active {
  max-height: v-bind(height);
  transition: 0.5s ease;
}

.height-enter-from,
.height-leave-to {
  max-height: 0px;
}
</style>
