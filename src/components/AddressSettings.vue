<script setup lang="ts">
import { computed } from "vue";
import { useLocale } from "../hooks/locale";
import { useAddressesStore } from "../store/addresses";
import FlatSettings from "./FlatSettings.vue";
import Tabs from "./Tabs.vue";

const { houseId } = defineProps<{ houseId: string }>();

const { getAddressByHouseId, getClientsByHouseId } = useAddressesStore();
const { t } = useLocale();
const building = getAddressByHouseId(houseId);
const clients = getClientsByHouseId(houseId);
// Вычисляемое свойство для добавления заголовков клиентов
const clientsWithTitles = computed(() =>
  clients.value.map((client) => ({
    tabId: client.flatId,
    tabTitle: t("addresses.flat", [client.flatId]),
  }))
);
</script>
<template>
  <div class="">
    <template v-if="building">
      <div class="label">{{ building?.address }}</div>
      <Tabs :tabs="clientsWithTitles">
        <template
          v-for="client in clientsWithTitles"
          v-slot:[client.tabId]
          :key="client.tabId"
        >
          <FlatSettings :flat-id="client.tabId" />
        </template>
      </Tabs>
    </template>
    <template v-else>
      <div class="global-error">404</div>
    </template>
  </div>
</template>
<style scoped lang="scss">
.label {
  font-size: 24px;
  margin: 24px 0;
}
.container {
//   max-width: 600px;
}
</style>
