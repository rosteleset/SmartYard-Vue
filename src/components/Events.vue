<script setup lang="ts">
import eventIcon from "@/assets/events.svg?component";
import EventsFilter from "@/components/EventsFilter.vue";
import EventsList from "@/components/EventsList.vue";
import Label from "@/components/Label.vue";
import { useAddressesStore } from "@/store/addresses";
import { ref } from "vue";


const { houseId } = defineProps<{
  houseId: string;
}>();

// Использование сторов и реактивных переменных
const { getClientsByHouseId } = useAddressesStore();
const clients = getClientsByHouseId(houseId);
const isOpen = ref(false);

// Обработчик для открытия/закрытия списка событий
const handleToggle = (open: boolean) => {
  isOpen.value = open;
};
</script>

<template>
  <Label
    :icon="eventIcon"
    :alt="$t('addresses.events')"
    :text="$t('addresses.events')"
    @toggle="handleToggle"
  />
  <Transition>
    <div v-if="isOpen" class="events">
      <EventsFilter :clients="clients" />
      <EventsList :clients="clients" />
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.events {
  padding: 24px;
}
</style>
