import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import { getBasePath } from "./lib/basePath";

const BASE_PATH = getBasePath();

const routes: RouteRecordRaw[] = [
  {
    path: `${BASE_PATH}/addresses`,
    name: "AddressesList",
    component: () => import("./components/AddressesList.vue"),
  },
  {
    path: `${BASE_PATH}/addresses/:houseId`,
    component: () => import("./components/Address.vue"),
    props: (route) => ({ houseId: route.params.houseId }),
  },
  {
    path: `${BASE_PATH}/cameras`,
    name: "CityCameras",
    component: () => import("./components/Cameras.vue"),
  },

  {
    path: `${BASE_PATH}/cameras/:houseId`,
    component: () => import("./components/Cameras.vue"),
    props: (route) => ({ houseId: route.params.houseId }),
  },
  {
    path: `${BASE_PATH}/chat`,
    name: "Chat",
    component: () => import("./components/Chat.vue"),
  },
  {
    path: `${BASE_PATH}/settings`,
    name: "Settings",
    component: () => import('./components/Settings.vue'),
  },
  {
    path: `${BASE_PATH}/settings/:houseId`,
    component: () => import('./components/AddressSettings.vue'),
    props: (route) => ({ houseId: route.params.houseId }),
  },
  {
    path: `${BASE_PATH}/events/:houseId`,
    component: () => import("./components/Events.vue"),
    props: (route) => ({ houseId: route.params.houseId }),
  },
  {
    path: `${BASE_PATH}/faces/:flatId`,
    component: () => import("./components/Faces.vue"),
    props: (route) => ({ flatId: route.params.flatId }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
