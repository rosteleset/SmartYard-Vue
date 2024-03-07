<script setup lang="ts">
import { useRoute } from "vue-router";
import Nav from "./Nav.vue";
const route = useRoute()
</script>

<template>
  <header>
    <div class="container">
      <div class="header__grid">
        <div class="header__label">SmartYard-WEB {{ route.name && ': ' + $t(`routes.${route.name as string}`) }}</div>
        <div class="nav">
          <Nav />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
    position: relative;
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
  line-height: 3;
  text-align: center;
}
.nav {
  grid-area: menu;
}
</style>
