<script setup lang="ts">
import {useRouter} from "vue-router";
import {computed} from "vue";
import Button from "@/components/Button.vue";
import openDoor from "@/lib/openDoor.ts";

const router = useRouter()
const {callerId, hash, domophoneId} = router.currentRoute.value.query

const image = computed(() => `https://rbt-demo.lanta.me/mobile/call/live/${hash}`)

</script>

<template>
  <h1>Вызов {{ callerId }}</h1>
  <img :src="image" alt="call" class="image"/>

  <div class="flex">
    <Button variant="success" @click="openDoor(Number(domophoneId))">{{ $t('call.open') }}</Button>
    <Button variant="error" @click="router.go(-1)">{{ $t('call.ignore') }}</Button>
  </div>

</template>

<style scoped lang="scss">
.image {
  width: 300px;
}

.video {
  width: 300px;
}

.flex {
  display: flex;
  gap: 24px;
  padding: 12px;
  align-items: center;
}
</style>