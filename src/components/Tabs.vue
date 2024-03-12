<script setup lang="ts" generic="T extends {tabId:string,tabTitle:string}">
import { ref } from "vue";

const {} = defineProps<{
  tabs: T[];
}>();

const activeTab = ref(0);
</script>

<template>
  <div>
    <div class="tabs">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ active: activeTab === index }"
        @click="activeTab = index"
      >
        {{ tab.tabTitle }}
      </div>
    </div>
    <div class="tab-content">
      <Transition name="fade">
        <slot :name="tabs[activeTab].tabId"></slot>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tabs {
  display: flex;
}

.tabs > div {
  padding: 10px 20px;
  cursor: pointer;
  border: solid 1px #f0f0f1;
  border-bottom: none;
  border-radius: 12px 12px 0 0;
  margin-right: 5px;
  transition: 0.5s;
}

.tabs > div.active {
  border-color: #298bff;
  background-color: #298bff;
  color: #ffffff;
}

.tab-content {
  position: relative;
  border: 1px solid #298bff;
  border-radius: 0 12px 12px 12px;
  padding: 20px;
  margin-top: -1px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease; /* Продолжительность и тип анимации */
}
.fade-enter-active {
  position: absolute;
  top: 0;
  z-index: -1;
}
.fade-enter,
.fade-leave-to {
  // position: absolute;
  opacity: 0;
}
</style>
