<script setup lang="ts">

import Modal from "@/components/Modal.vue";
import {computed} from "vue";

interface Call {
  callerId: string,
  domophoneId: string,
  dtmf: string,
  extension: string,
  flatId: string,
  flatNumber: string,
  hash?: string,
  pass?: string,
  platform?: string,
  port?: string,
  server: string,
  stun?: string,
  stunTransport?: string,
  timestamp?: string,
  transport?: string,
  ttl?: string,
}

interface CallProps {
  call: Call
}

const {call} = defineProps<CallProps>()

const isCall = computed(() => !!call)

</script>
<Modal :is-open="isCall">

</Modal>
<template>

</template>

<style scoped lang="scss">

</style>