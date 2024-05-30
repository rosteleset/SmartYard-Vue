<script setup lang="ts">
import eventIcon from "@/assets/events.svg?component";
import EventsFilter from "@/components/EventsFilter.vue";
import EventsList from "@/components/EventsList.vue";
import Label from "@/components/Label.vue";
import {useAddressesStore} from "@/store/addresses";
import {provide, ref} from "vue";
import useEvents from "@/hooks/useEvents.ts";


const {houseId} = defineProps<{
  houseId: string;
}>();

// Использование сторов и реактивных переменных
const {getClientsByHouseId} = useAddressesStore();
const clients = getClientsByHouseId(houseId);
const events = useEvents(clients.value.map((client) => client.flatId))
const isOpen = ref(false);

provide("events", events)

// Обработчик для открытия/закрытия списка событий
const handleToggle = (open: boolean) => {
  isOpen.value = open;
};
</script>

<template>
  <Label
      :icon="eventIcon"
      :text="$t('addresses.events')"
      @toggle="handleToggle"
  />
  <Transition>
    <div v-if="isOpen" class="events">
      <EventsFilter :clients="clients"/>
      <EventsList :clients="clients"/>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.events {
  padding: 24px;
}
</style>
