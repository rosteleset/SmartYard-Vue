import { createRouter, createWebHistory } from "vue-router";
import AddressesList from "./components/AddressesList.vue";
import Test from "./components/Test.vue";
import Settings from "./components/Settings.vue";
import Chat from "./components/Chat.vue";
import CityCameras from "./components/CityCameras.vue";

const routes = [
  {
    path: "/addresses",
    name: "AddressesList",
    component: AddressesList,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/cameras",
    name: "CityCameras",
    component: CityCameras,
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
