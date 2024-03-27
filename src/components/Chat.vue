<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useApi } from "@/hooks/useApi";

const {get} = useApi()
const inbox = ref();

onMounted(() => {
  get<any>("inbox/inbox").then((r) => (inbox.value = r.code));
});

</script>
<template>
    <div v-html="inbox" />
</template>
<style scoped lang="scss"></style>
