<script setup lang="ts">
import EventsFilter from "@/components/EventsFilter.vue";
import EventsList from "@/components/EventsList.vue";
import useLocale from "@/hooks/useLocale";
import { useAddressesStore } from "@/store/addresses.ts";

const { houseId } = defineProps<{
  houseId: string;
}>();
const { getClientsByHouseId } = useAddressesStore();
const clients = getClientsByHouseId(houseId);
const { locale, changeLocale } = useLocale();
const tt = () => {
  if (locale.value === "ru") changeLocale("en");
  else changeLocale("ru");
};
</script>

<template>
  <h1 @click="tt">Events</h1>
  <EventsFilter :clients="clients" />
  <EventsList :clients="clients" />
</template>

<style scoped lang="scss">
.title {
  font-size: 24px;
  margin: 24px 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
