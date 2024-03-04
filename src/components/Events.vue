<script setup lang="ts">
// Импорт необходимых зависимостей
import { ref, computed } from "vue";
import { useEvents } from "../store/events";
import { useLocaleStore } from "../store/locale";
import useEventNames from "../lib/useEventNames";
import Label from "./Label.vue";
import Event from "./Event.vue";
import Select from "./Select.vue";
import eventIcon from "../assets/events.svg";
import { inject } from "vue";
import { useAdressesStore } from "../store/addresses";

// Интерфейс для опций
interface OptionType {
  id: string;
  name: string;
}

const houseId = inject<string>("houseId");
if (houseId === undefined) throw new Error("not find houseId");

const addressesStore = useAdressesStore();
const clients = addressesStore.getClientsByHouseId(houseId);
const eventNames = ref(useEventNames().eventNames);

const options = computed(() => {
  return Object.entries(eventNames.value)
    .filter(([id]) => id !== "default")
    .map(([id, name]) => ({ id, name }));
});

const selectedOption = ref<OptionType | null>(null);
const selectedClient = ref<OptionType | null>(null);

const flatIds = computed(() => {
  if (selectedClient.value) return [selectedClient.value.id];
  else return clients.value.map((client) => client.flatId);
});

const selectedOptionId = computed(() => selectedOption.value?.id);

// Реактивная переменная для открытия/закрытия списка
const isOpen = ref(false);

// Получение событий для определенного flatId
const { events } = useEvents(flatIds, selectedOptionId);

// Локализация
const localeStore = useLocaleStore();

// Функция обновления выбранной опции
const updateOption = (newOption: OptionType | null) => {
  selectedOption.value = newOption;
};

// Функция обновления выбранной опции
const updateClient = (newClient: OptionType | null) => {
  selectedClient.value = newClient;
};

// Функция обработки открытия/закрытия списка
const handleToggle = (open: boolean) => {
  isOpen.value = open;
};
</script>
<template>
  <Label
    :icon="eventIcon"
    alt="event icon"
    :text="$t('addresses.events')"
    @toggle="handleToggle"
  />
  <div class="events__list" v-if="isOpen">
    <div class="filters">
      <Select
        :options="options"
        :model-value="selectedOption"
        @update:model-value="updateOption"
      />
      <Select
        :options="
          clients.map((client) => ({
            id: client.flatId,
            name: client.flatNumber.toString(),
          }))
        "
        :model-value="selectedClient"
        @update:model-value="updateClient"
      />
    </div>
    <div class="events__day" v-for="day in events" :key="day.date">
      <div class="events__title" v-if="day.events.length > 0">
        {{ localeStore.localizedDayjs(day.date).format("dddd, D MMMM") }}
      </div>
      <Event v-for="event in day.events" :key="event.uuid" :event="event" />
    </div>
  </div>
</template>
<style scoped lang="scss">
.events {
  &__list {
    padding: 24px;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 12px;
  }
  &__day {
    margin-bottom: 24px;
  }
  &__title {
    font-size: 70%;
  }
}
.filters {
  display: flex;
  gap: 24px;
}
</style>
