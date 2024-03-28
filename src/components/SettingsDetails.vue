<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/Button.vue";
import sendName from "@/api/sendName";
import { useUserStore } from "@/store/user";

const { names } = useUserStore();

const isProcessed = ref(false);
const name = ref<string>(names.name);
const patronymic = ref<string>(names.patronymic || "");

const updateNames = async () => {
  isProcessed.value = true;
  await sendName({ name: name.value, patronymic: patronymic.value });
  isProcessed.value = false;
};
</script>

<template>
  <div>
    <h2>{{ $t("settings.details") }}</h2>
    <div class="settings-block">
      <input type="text" :placeholder="$t('settings.name')" v-model="name" />
      <input
        type="text"
        :placeholder="$t('settings.patronymic')"
        v-model="patronymic"
      />
      <input type="text" :placeholder="$t('settings.phone')" disabled />
      <Button variant="primary" @click="updateNames" :disabled="isProcessed">{{
        $t("settings.save")
      }}</Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
