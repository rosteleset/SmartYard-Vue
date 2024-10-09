<script setup lang="ts">
import {ref, watch} from "vue";
import Button from "@/components/Button.vue";
import PhoneInput from "@/components/PhoneInput.vue";
import useApi from "@/hooks/useApi.ts";
import {useUserStore} from "@/store/user.ts";
import {useRouter} from "vue-router";
import generateDeviceId from "@/lib/generateDeviceId.ts";
import debounce from "@/lib/debounce.ts";
import QrCode from "@/components/QrCode.vue";

const authType = import.meta.env.VITE_AUTH_TYPE
const userStore = useUserStore()
const {request} = useApi()

const router = useRouter();

const phone = ref<string>("")
const code = ref<string>("")
const status = ref<number>(0);
const outgoingPhone = ref<string>()

const requestCode = () => {
  // const method = 'sms';
  request('/user/requestCode', {
    userPhone: phone.value,
    method: authType
  }).then(r => {
    if (r.data.method === 'sms')
      status.value = 1;
    if (r.data.method === 'outgoingCall') {
      status.value = 2;
      outgoingPhone.value = r.data.confirmationNumbers[0]
    }
  })
}

const confirmCode = () => {
  request('/user/confirmCode', {
    userPhone: phone.value,
    smsCode: code.value,
    deviceToken: generateDeviceId(),
    platform: '2'
  }).then(r => {
    if (r.data.accessToken)
      userStore.setToken(r.data.accessToken)
  })
}

const confirmCall = () => {
  request('/user/checkPhone', {
    userPhone: phone.value,
    deviceToken: generateDeviceId(),
    platform: '2'
  }).then(r => {
    if (r.data.accessToken)
      userStore.setToken(r.data.accessToken)
  })
}

const handler = (e: Event) => {
  e.preventDefault();
  switch (status.value) {
    case 0:
      requestCode()
      return;
    case 1:
      confirmCode()
      return;
    case 2:
      confirmCall()
      return;
    default:
      break;
  }
}

watch(userStore, store => {
  if (store.isAuth)
    router.push('/addresses')
})

// for token
const {axiosInstance} = useApi();

const tokenStatus = ref<string>();
const inputType = ref("password");
const token = ref("")

const validate = () => {
  axiosInstance.value
      .post("user/ping", {}, {headers: {Authorization: `Bearer ${token.value}`}})
      .then((res) => {
        tokenStatus.value = res.status === 204 ? "Valid token" : "Hmm";
        if (res.status === 204) {
          userStore.setToken(token.value)
        }
      })
      .catch((err: any) => {
        tokenStatus.value =
            err.response.status === 401 ? "Invalid token" : "Server error";
      });
};

const debouncedValidate = debounce(validate, 1000);

</script>

<template>

  <template v-if="authType === 'token'">
    <div class="wrap">
      <input
          :type="inputType"
          v-model="token"
          @focusin="inputType = 'text'"
          @focusout="inputType = 'password'"
          @input="debouncedValidate"
      />
      <Button
          v-if="tokenStatus"
          :variant="tokenStatus === 'Valid token' ? 'success' : 'error'"
      >{{ tokenStatus }}
      </Button
      >
      <Button v-if="tokenStatus === 'Valid token'" @click="router.push('/addresses')" variant="primary"
      >К адресам
      </Button
      >
    </div>
  </template>
  <form v-else class="wrap" @submit="handler">
    <PhoneInput v-model="phone" :disabled="status !== 0"/>
    <Button v-if="status === 0" variant="primary">Запросить код</Button>
    <template v-if="status === 1">
      <input
          v-model="code"
          placeholder="Код"
      />
      <Button variant="primary">Отправить</Button>
    </template>
    <template v-if="status === 2">
      <p class="phone">Позвоните на номер: <a :href="`tel:${outgoingPhone}`">{{ outgoingPhone }}</a> или отсканируйте
        код для подтверждения.
      </p>
      <div class="qr">
        <QrCode :text="`tel:${outgoingPhone}`"/>
      </div>
      <Button variant="primary">Продолжить</Button>
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

  .phone {
    text-align: center;
    font-size: 24px;
  }

  .qr {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
