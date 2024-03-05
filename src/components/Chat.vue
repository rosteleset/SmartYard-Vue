<script setup lang="ts">
import { onMounted, ref } from "vue";
import { get } from "../api";

const inbox = ref();

onMounted(() => {
  get<any>("inbox/inbox").then((r) => (inbox.value = r.code));
});

</script>
<template>
  <div class="container">
    <h1>chat</h1>
    <div v-html="inbox" />
  </div>
</template>
<style scoped lang="scss"></style>
