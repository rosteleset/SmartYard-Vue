<script setup lang="ts">

import Modal from "@/components/Modal.vue";
import {computed} from "vue";
import {usePushStore} from "@/store/push.ts";
import openDoor from "@/lib/openDoor.ts";
import Button from "@/components/Button.vue";

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

const push = usePushStore()

const call = computed(() => push.call ? {...{}, ...push.call.data} as Call : undefined)
const image = computed(() => call.value ? `https://rbt-demo.lanta.me/mobile/call/live/${call.value.hash}` : undefined)
</script>

<template>
  <Modal :isOpen="!!call" :title="`Вызов ${call?.callerId}`" @onClose="push.setCall">
    <div v-if="call" class="wrap">
      <img :src="image" alt="call" class="image"/>
      <div class="flex">
        <Button v-if="call.domophoneId" variant="success" @click="openDoor(Number(call.domophoneId))">{{ $t('call.open') }}</Button>
        <Button variant="error" @click="push.setCall">{{ $t('call.ignore') }}</Button>
      </div>
    </div>
  </Modal>
</template>

<style scoped lang="scss">
.wrap {
  text-align: center;
}

.image {
  max-width: 50vh;
}

.flex {
  display: flex;
  gap: 24px;
  padding: 12px;
  align-items: center;
  justify-content: center;
}
</style>