import { onMounted, ref } from "vue";
import { get } from "../api";
import { Client, Names, Notifications } from "../types/user";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const isLoaded = ref(false);
  const clients = ref<Client[]>([]);
  const names = ref<Names>({} as Names);
  const notifications = ref<Notifications>({});
  const error = ref<string>();

  const load = () => {
    Promise.all([
      get<Client[]>("address/getSettingsList"),
      get<Names>("user/getName"),
      get<Notifications>("user/notification"),
    ])
      .then(([clientsResponse, namesResponse, notificationsResponse]) => {
        clients.value = clientsResponse;
        names.value = namesResponse;
        notifications.value = notificationsResponse;
        isLoaded.value = true;
      })
      .catch((error) => {
        error.value = error.message;
      });
  };

  onMounted(load);

  return {
    clients,
    names,
    notifications,
    isLoaded,
    error,
  };
});
