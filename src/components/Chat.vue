<script setup lang="ts">
import { onMounted, ref } from "vue";
import { get } from "../api";

const inbox = ref();

onMounted(() => {
  get<any>("inbox/inbox").then((r) => (inbox.value = r.code));
});

</script>
<template>
    <h1>chat</h1>
    <div v-html="inbox" />
</template>
<style scoped lang="scss"></style>
