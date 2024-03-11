<script setup lang="ts">
import { ref, watch } from "vue";
import { useUserStore } from "../store/user";
import sendName from "../api/sendName";
import Button from "./Button.vue";
import Switch from "./Switch.vue";
import convertSettingsBoolean from "../lib/convertSettingsBoolean";

const { names, notifications } = useUserStore();
const isProcessed = ref(false);
const name = ref<string>(names.name);
const patronymic = ref<string>(names.patronymic || "");
const notificationsEnable = ref(notifications.enable && convertSettingsBoolean(notifications.enable));
const notificationsMoney = ref(notifications.money && convertSettingsBoolean(notifications.money));


const updateNames = async () => {
  isProcessed.value = true;
  await sendName({ name: name.value, patronymic: patronymic.value });
  isProcessed.value = false;
};
</script>

<template>
  <div class="container">
    <h2>контактные данные</h2>
    <div class="settings-block">
      <input type="text" placeholder="имя" v-model="name" />
      <input type="text" placeholder="отчество" v-model="patronymic" />
      <input type="text" placeholder="телефон" disabled />
      <Button variant="primary" @click="updateNames" :disabled="isProcessed"
        >Сохранить</Button
      >
    </div>
    <h2>уведомления</h2>
    <div class="settings-block">
      <Switch
        v-model="notificationsEnable"
        label="Показывать уведомления"
        justify="space-between"
      />
      <Switch
        v-model="notificationsMoney"
        label="Оповещать о недостатке средств"
        justify="space-between"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  max-width: 600px;
}
.settings-block {
  display: flex;
  flex-direction: column;
  gap: 24px;

  input {
    padding: 12px;
    border: solid 1px #f0f0f1;
    &:focus {
      outline: solid 1px #298bff;
    }
  }
}
</style>
