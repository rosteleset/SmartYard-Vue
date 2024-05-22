<script setup lang="ts">
import {ref, watch} from "vue";
import Button from "@/components/Button.vue";
import PhoneInput from "@/components/PhoneInput.vue";
import useApi from "@/hooks/useApi.ts";
import {useUserStore} from "@/store/user.ts";
import {useRouter} from "vue-router";
import generateDeviceId from "@/lib/generateDeviceId.ts";

const userStore = useUserStore()
const {request} = useApi()

const router = useRouter();

const phone = ref<string>("")
const code = ref<string>("")
const status = ref<number>(0);

const requestCode = () => {
  const method = 'sms';
  request('/user/requestCode', {
    userPhone: phone.value,
    method
  }).then(r => {
    console.log(r)
    if (r.data.method === method)
      status.value = 1;
  })
}

const confirmCode = () => {
  request('/user/confirmCode', {
    userPhone: phone.value,
    smsCode: code.value,
    deviceToken: generateDeviceId(),
    platform: '2'
  }).then(r => {
    console.log(r)
    if (r.data.accessToken)
      userStore.setToken(r.data.accessToken)
  })
}

const handler = (e:Event) => {
  e.preventDefault();
  switch (status.value) {
    case 0:
      requestCode()
      return;
    case 1:
      confirmCode()
      return;
    default:
      break;
  }
}

watch(userStore, store => {
  if (store.isAuth)
    router.push('/addresses')
})

// const userStore = useUserStore();
// const addressesStore = useAddressesStore();
// const { axiosInstance } = useApi();
// const router = useRouter();

// const status = ref<string>();
// const inputType = ref("password");
// const tt = computed({
//   get() {
//     return userStore.token || "";
//   },
//   set(value: string) {
//     debouncedValidate();
//     userStore.setToken(value);
//   },
// });
//
// const handler = () => router.push(`/addresses`);
//
// const validate = () => {
//   axiosInstance.value
//     .post("user/ping")
//     .then((res) => {
//       status.value = res.status === 204 ? "Valid token" : "Hmm";
//       if (res.status === 204) {
//         userStore.load();
//         addressesStore.load();
//       }
//     })
//     .catch((err: any) => {
//       userStore.error = err.message;
//       status.value =
//         err.response.status === 401 ? "Invalid token" : "Server error";
//     });
// };
//
// const debouncedValidate = debounce(validate, 500);

// onMounted(validate);
</script>

<template>
  <form class="wrap" @submit="handler">
    <p>{{ phone }}</p>
    <PhoneInput v-model="phone" :disabled="status !== 0"/>
    <Button v-if="status === 0" variant="primary">Запросить код</Button>
    <template v-if="status === 1">
      <input
          v-model="code"
          placeholder="Код"
      />
      <Button variant="primary">Отправить</Button>
    </template>
  </form>
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
