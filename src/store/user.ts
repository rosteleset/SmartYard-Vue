import { onMounted, ref } from "vue";
import { get } from "../api";
import { Client, Names, Notifications } from "../types/user";
import { defineStore } from "pinia";

const LOCAL_STORAGE_TOKEN_KEY = "jwt-token";

export const useUserStore = defineStore("user", () => {
  const isLoaded = ref(false);
  const clients = ref<Client[]>([]);
  const names = ref<Names>({} as Names);
  const notifications = ref<Notifications>({});
  const error = ref<string>();
  const token = ref<string | null>(
    localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)
  );

  const load = () => {
    Promise.all([
      get<Client[]>("address/getSettingsList"),
      get<Notifications>("user/notification"),
    ])
      .then(([clientsResponse, notificationsResponse]) => {
        clients.value = clientsResponse;
        notifications.value = notificationsResponse;
        isLoaded.value = true;

      })
      .catch((_error) => {
        error.value = _error.message;
      });
  };
  
  // вынес отдельно для обратной совместимости
  get<Names>("user/getName").then((namesResponse) => {
    names.value = namesResponse;
  }).catch((_error) => {
    error.value = _error.message;
  });

  onMounted(load);

  return {
    clients,
    names,
    notifications,
    isLoaded,
    error,
    token
  };
});
