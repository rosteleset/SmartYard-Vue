<script setup lang="ts">
import dayjs from "dayjs";
import { computed, ref, watch } from "vue";
import resetCode from "@/api/resetCode";
import reloadIcon from "@/assets/reload.svg?component";
import useSettings from "@/hooks/useSettings";
import Button from "@/components/Button.vue";
import Faces from "@/components/Faces.vue";
import Switch from "@/components/Switch.vue";
import convertSettingsBoolean from "@/lib/convertSettingsBoolean";
import { useRouter } from "vue-router";

// определение свойств
const { flatId } = defineProps<{
  flatId: string;
}>();

// использование настроек
const { settings, save } = useSettings(flatId);
const router = useRouter();

// установка значения doorCode
const doorCode = ref(settings.value?.doorCode);

// вычисление текущего состояния autoOpen
const isAutoOpen = computed(() =>
  dayjs().isBefore(dayjs(settings.value?.autoOpen))
);

const isFacesOpen = ref(false);

const openFacesHandler = () => {
  router.push(`/faces/${flatId}`);
};

// функции для проверки настроек
const isFRSSetting = (key: string) => {
  return key === "FRSDisabled";
};

const isWhiteRabbitSetting = (key: string) => {
  return key === "whiteRabbit";
};

// функция обновления настроек
const update = (key: string, value: string | boolean) => {
  const _value = isFRSSetting(key) ? !value : value;
  const string = isWhiteRabbitSetting(key)
    ? _value
      ? "5"
      : "0"
    : _value
    ? "t"
    : "f";
  save({ [key]: string });
};

// функция для генерации нового кода
const regenerateCode = () => {
  resetCode(flatId).then((code) => (doorCode.value = code));
};

// функция для установки автоматического открытия
const setAutoOpen = () => {
  if (!isAutoOpen.value)
    save({ autoOpen: dayjs().add(1, "hour").format("YYYY-MM-DD HH:mm:ss") });
};

// отслеживание изменений кода открытия в общем обьекте настроек
watch(settings, (newSettings) => {
  if (newSettings && newSettings.doorCode !== doorCode.value) {
    doorCode.value = newSettings.doorCode;
  }
});
</script>

<template>
  <div>
    <div class="grid" v-if="settings">
      <h4>{{ $t("settings.intercom") }}</h4>
      <template v-if="settings.CMS !== undefined">
        <div>{{ $t("settings.CMS") }}</div>
        <Switch
          :modelValue="convertSettingsBoolean(settings.CMS)"
          @update:modelValue="update('CMS', $event)"
        />
      </template>
      <template v-if="settings.VoIP !== undefined">
        <div>{{ $t("settings.VoIP") }}</div>
        <Switch
          :modelValue="convertSettingsBoolean(settings.VoIP)"
          @update:modelValue="update('VoIP', $event)"
        />
      </template>
      <!-- Для FRSDisabled значение инвертируем -->
      <template v-if="settings.FRSDisabled !== undefined">
        {{ $t("settings.FRSDisabled") }}
        <Switch
          :modelValue="!convertSettingsBoolean(settings.FRSDisabled)"
          @update:modelValue="update('FRSDisabled', $event)"
        />
      </template>
      <template v-if="settings.whiteRabbit !== undefined">
        <div>{{ $t("settings.whiteRabbit") }}</div>
        <Switch
          :modelValue="settings.whiteRabbit !== '0'"
          @update:modelValue="update('whiteRabbit', $event)"
        />
      </template>

      <template v-if="settings.hiddenPlog !== undefined">
        <div>{{ $t("settings.hiddenPlog") }}</div>
        <Switch
          :modelValue="convertSettingsBoolean(settings.hiddenPlog)"
          @update:modelValue="update('hiddenPlog', $event)"
        />
      </template>

      <template v-if="settings.disablePlog !== undefined">
        <div>{{ $t("settings.disablePlog") }}</div>
        <Switch
          :modelValue="convertSettingsBoolean(settings.disablePlog)"
          @update:modelValue="update('disablePlog', $event)"
        />
      </template>

      <template v-if="settings.paperBill !== undefined">
        <div>{{ $t("settings.paperBill") }}</div>
        <Switch
          :modelValue="convertSettingsBoolean(settings.paperBill)"
          @update:modelValue="update('paperBill', $event)"
        />
      </template>

      <h4>{{ $t("settings.access") }}</h4>
      <template v-if="settings.allowDoorCode === 't'">
        <div>
          {{ $t("settings.reset-code") }} <strong>{{ doorCode }}</strong>
        </div>
        <button class="reset" @click="regenerateCode">
          <reloadIcon/>
        </button>
      </template>
      <template v-if="settings.autoOpen !== undefined">
        <div>
          {{ $t("settings.guest-access") }}
        </div>
        <Button
          :variant="isAutoOpen ? 'sucsses' : 'primary'"
          @click="setAutoOpen"
        >
          {{ isAutoOpen ? "открыто" : "открыть" }}
        </Button>
      </template>

      <div class="faces-block">
        <Button
          v-if="settings.FRSDisabled === 'f' && !isFacesOpen"
          variant="primary"
          @click="openFacesHandler"
        >
          {{ $t("settings.frs") }}
        </Button>
        <Faces v-if="isFacesOpen" :flatId="flatId" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.grid {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 12px;
  // width: max-content;

  h4 {
    grid-column-start: 1;
    grid-column-end: 3;
  }
}

.reset {
  background: none;
  border: 0;
  cursor: pointer;

  img {
    display: inline-block;
    transform: rotate(0deg);
    transition: transform 1s;
  }

  &:active {
    img {
      transition: transform 0s;
      transform: rotate(-360deg);
    }
  }
}
.faces-block {
  grid-column-start: 1;
  grid-column-end: 3;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
