import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import Address from "./components/Address.vue";
import AddressesList from "./components/AddressesList.vue";
import Cameras from "./components/Cameras.vue";
import Chat from "./components/Chat.vue";
import Settings from "./components/Settings.vue";
import Events from "./components/Events.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/addresses",
    name: "AddressesList",
    component: AddressesList,
  },
  {
    path: "/addresses/:houseId",
    component:Address
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/cameras",
    name: "CityCameras",
    component: Cameras,
  },
  {
    path: "/cameras/:houseId",
    component: Cameras,
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
  },
  {
    path: "/events/:houseId",
    component: Events,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
