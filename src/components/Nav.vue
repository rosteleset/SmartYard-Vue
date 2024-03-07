<script setup lang="ts">
import { inject } from "vue";
import { RouterLink, useRouter } from "vue-router";

const isMenuOpen = inject("isMenuOpen");

const {getRoutes} = useRouter()
const routes = getRoutes()

</script>
<template>
  <button class="nav">
    <svg
      class="toggle-svg"
      :class="{ active: isMenuOpen }"
      @click="isMenuOpen = !isMenuOpen"
      viewbox="0 0 60 40"
    >
      <g
        stroke="#fff"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path id="top-line" d="M10,10 L50,10 Z"></path>
        <path id="middle-line" d="M10,20 L50,20 Z"></path>
        <path id="bottom-line" d="M10,30 L50,30 Z"></path>
      </g>
    </svg>
  </button>
  <div class="menu">
    <RouterLink v-for="route in routes.filter(route=>route.name)" :to="route.path" >{{ $t(`routes.${route.name as string}`) }}</RouterLink>
  </div>
</template>
<style scoped lang="scss">
.menu {
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  z-index: 0;
  display: flex;
  justify-content: center;
  gap: 24px;
  a {
    color: #FFFFFF;
    font-size: 24px;
    text-decoration: none;
    transition: .5s ease-out;
    &:hover {
        transform: translateY(-6px);
    }
  }
}
.nav {
  display: block;
  height: max-content;
  background: none;
  border: 0;
  box-shadow: 0;
}
.toggle-svg {
  width: 60px;
  height: 40px;
  &.active {
    #top-line {
      animation: down-rotate 0.6s ease-out both;
    }
    #bottom-line {
      animation: up-rotate 0.6s ease-out both;
    }
    #middle-line {
      animation: hide 0.6s ease-out forwards;
    }
  }
}

#top-line,
#bottom-line,
#middle-line {
  transform-box: fill-box;
  transform-origin: center;
}

@keyframes up-rotate {
  0% {
    animation-timing-function: cubic-bezier(0.16, -0.88, 0.97, 0.53);
    transform: translateY(0px);
  }
  30% {
    transform-origin: center;
    animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: translateY(-10px);
  }
  100% {
    transform-origin: center;
    transform: translateY(-10px) rotate(45deg) scale(0.9);
  }
}

@keyframes down-rotate {
  0% {
    animation-timing-function: cubic-bezier(0.16, -0.88, 0.97, 0.53);
    transform: translateY(0px);
  }
  30% {
    transform-origin: center;
    animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: translateY(10px);
  }
  100% {
    transform-origin: center;
    transform: translateY(10px) rotate(-45deg) scale(0.9);
  }
}

@keyframes hide {
  29% {
    opacity: 1;
  }
  30% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
</style>
