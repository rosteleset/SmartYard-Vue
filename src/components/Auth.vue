<script setup lang="ts">

import {useUserStore} from "../store/user.ts";

const {token, setToken} = useUserStore()
</script>

<template>
  <input
      type="text"
  />
</template>

<style lang="scss" scoped>

</style>