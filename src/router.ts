import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/addresses",
    name: "AddressesList",
    component: () => import("./components/AddressesList.vue"),
  },
  {
    path: "/addresses/:houseId",
    component: () => import("./components/Address.vue"),
    props: (route) => ({ houseId: route.params.houseId }),
  },
  {
    path: "/cameras",
    name: "CityCameras",
    component: () => import("./components/Cameras.vue"),
  },

  {
    path: "/cameras/:houseId",
    component: () => import("./components/Cameras.vue"),
    props: (route) => ({ houseId: route.params.houseId }),
  },
  {
    path: "/chat",
    name: "Chat",
    component: () => import("./components/Chat.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import('./components/Settings.vue'),
  },
  {
    path: "/events/:houseId",
    component: () => import("./components/Events.vue"),
    props: (route) => ({ houseId: route.params.houseId }),
  },
  {
    path: "/faces/:flatId",
    component: () => import("./components/Faces.vue"),
    props: (route) => ({ flatId: route.params.flatId }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
