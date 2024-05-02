<script setup lang="ts">
import {computed, inject, ref, Ref, watch} from "vue";
import {
  RouteLocationNormalizedLoaded,
  RouteRecord,
  useRouter,
} from "vue-router";
import useLocale from "@/hooks/useLocale";
import GoBack from "@/assets/goBack.svg"
import NavIcon from "@/components/HeaderNavIcon.vue";
import {useConfigStore} from "@/store/config.ts";

const {t} = useLocale();
const {currentRoute, getRoutes, back} = useRouter();
const routes = getRoutes();
const {config} = useConfigStore();
const alwaysMenu = computed(() => config["alwaysMenu"]);
const cssVars = computed(() => `
--header-size:${alwaysMenu.value ? 24 : 32}px;
--header-padding: ${alwaysMenu.value ? 12 : 24}px;
`);
const isMenuOpen: Ref<boolean> = inject("isMenuOpen") || ref(false);
const menuList = ref<HTMLElement | null>(null);
const height = ref("0px");

const isFirst = ref(!!history.state.back);

const getRouteName = (route: RouteLocationNormalizedLoaded | RouteRecord) =>
    typeof route.name === "string" ? t(`routes.${route.name}`) : undefined;

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
  <header :style="cssVars">
    <div class="container">
      <div class="header__grid">
        <Transition name="fade">
          <GoBack v-if="isFirst" @click="back"/>
        </Transition>
        <div class="header__label">
          SmartYard-WEB
          {{ currentRoute && getRouteName(currentRoute) }}
        </div>
        <div v-if="!alwaysMenu" class="nav">
          <NavIcon/>
        </div>
      </div>

      <Transition name="height" to>
        <div class="menu" v-if="alwaysMenu || isMenuOpen">
          <div class="menu__list" ref="menuList">
            <RouterLink
                v-for="route in routes.filter((route) => route.name && route.name !== 'Auth')"
                :to="route.path"
            >{{ getRouteName(route) }}
            </RouterLink
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
  font-size: var(--header-size);
  font-weight: 700;
  text-align: center;
  padding: var(--header-padding) 0;
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
    padding: var(--header-padding);

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
