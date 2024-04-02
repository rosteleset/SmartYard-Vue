<script setup lang="ts">
import { useUserStore } from "@/store/user.ts";
import { computed, onMounted, ref } from "vue";
import Button from "@/components/Button.vue";
import useApi from "@/hooks/useApi.ts";
import debounce from "@/lib/debounce.ts";
import { useRouter } from "vue-router";
import { useAddressesStore } from "@/store/addresses.ts";

const userStore = useUserStore();
const addressesStore = useAddressesStore();
const { axiosInstance } = useApi();
const router = useRouter();

const status = ref<string>();
const inputType = ref("password");
const tt = computed({
  get() {
    return userStore.token || "";
  },
  set(value: string) {
    debouncedValidate();
    userStore.setToken(value);
  },
});

const handler = () => router.push(`/addresses`);

const validate = () => {
  axiosInstance.value
    .post("user/ping")
    .then((res) => {
      status.value = res.status === 204 ? "Valid token" : "Hmm";
      if (res.status === 204) {
        userStore.load();
        addressesStore.load();
      }
    })
    .catch((err: any) => {
      userStore.error = err.message;
      status.value =
        err.response.status === 401 ? "Invalid token" : "Server error";
    });
};

const debouncedValidate = debounce(validate, 500);

onMounted(validate);
</script>

<template>
  <div class="wrap">
    <input
      :type="inputType"
      v-model="tt"
      @focusin="inputType = 'text'"
      @focusout="inputType = 'password'"
    />
    <Button
      v-if="status"
      :variant="status === 'Valid token' ? 'sucesses' : 'error'"
      >{{ status }}</Button
    >
    <Button v-if="status === 'Valid token'" @click="handler" variant="primary"
      >К адресам</Button
    >
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 24px;

  input {
    padding: 12px;
    font-size: 24px;
    text-align: center;
  }
}
</style>
