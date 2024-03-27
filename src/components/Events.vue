<script setup lang="ts">
import { computed, ref } from "vue";
import eventIcon from "../assets/events.svg?component";
import { useEvents } from "../hooks/events";
import useEventNames from "../hooks/useEventNames";
import { useAddressesStore } from "../store/addresses";
import Event from "./Event.vue";
import Label from "./Label.vue";
import Select from "./Select.vue";
import { useLocale } from "../hooks/locale";

// Интерфейс для опций
interface OptionType {
  id: string;
  name: string;
}

const { houseId } = defineProps<{
  compact?: boolean;
  houseId: string;
}>();

// Использование сторов и реактивных переменных
const { getAddressByHouseId, getClientsByHouseId } = useAddressesStore();
const building = getAddressByHouseId(houseId);
const clients = getClientsByHouseId(houseId);
const {eventNames} = useEventNames();
const options = computed(() => {
  return Object.entries(eventNames.value)
    .filter(([id]) => id !== "default")
    .map(([id, name]) => ({ id, name }));
});
const selectedOption = ref<OptionType>();
const selectedClient = ref<OptionType>();
const flatIds = computed(() => {
  if (selectedClient.value) return [selectedClient.value.id];
  else return clients.value.map((client) => client.flatId);
});
const selectedOptionId = computed(() => selectedOption.value?.id);
const isOpen = ref(false);
const { events } = useEvents(flatIds, selectedOptionId);
const localeStore = useLocale();

// Функции для обновления опций и клиентов
const updateOption = (newOption?: OptionType) => {
  selectedOption.value = newOption;
};
const updateClient = (newClient?: OptionType) => {
  selectedClient.value = newClient;
};

// Обработчик для открытия/закрытия списка событий
const handleToggle = (open: boolean) => {
  isOpen.value = open;
};
</script>

<template>
  <template v-if="houseId && clients && clients.length > 0">
    <Label
      v-if="compact"
      :icon="eventIcon"
      :alt="$t('addresses.events')"
      :text="$t('addresses.events')"
      @toggle="handleToggle"
    />
    <div v-else class="title">{{$t('addresses.events')}} : {{ building?.address }}</div>
    <Transition>
      <div class="events__list" v-if="isOpen || !compact">
        <div class="filters">
          <Select
            :options="options"
            :model-value="selectedOption"
            @update:model-value="updateOption"
            allow-undefined
            :undefined-text="$t('select.events')"
          />
          <Select
            v-if="clients && clients.length > 1"
            :options="
              clients.map((client) => ({
                id: client.flatId,
                name: client.flatNumber.toString(),
              }))
            "
            :model-value="selectedClient"
            @update:model-value="updateClient"
            allow-undefined
            :undefined-text="$t('select.flat')"
          />
        </div>
        <div class="events__day" v-for="day in events" :key="day.date">
          <div class="events__title" v-if="day.events.length > 0">
            {{
              localeStore.localizedDayjs.value(day.date).format("dddd, D MMMM")
            }}
          </div>
          <Event v-for="event in day.events" :key="event.uuid" :event="event" />
        </div>
      </div>
    </Transition>
  </template>
  <template v-else>
    <div class="global-error">{{ $t("events.not-found") }}</div>
  </template>
</template>

<style scoped lang="scss">
.title {
  font-size: 24px;
  margin: 24px 0;
}
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
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
