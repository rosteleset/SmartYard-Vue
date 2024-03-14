import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import Address from "./components/Address.vue";
import AddressesList from "./components/AddressesList.vue";
import Cameras from "./components/Cameras.vue";
import Chat from "./components/Chat.vue";
import Events from "./components/Events.vue";
import Faces from "./components/Faces.vue";
import Settings from "./components/Settings.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/addresses",
    name: "AddressesList",
    component: AddressesList,
  },
  {
    path: "/addresses/:houseId",
    component: Address,
    props: (route) => ({ houseId: route.params.houseId }),
  },
  {
    path: "/cameras",
    name: "CityCameras",
    component: Cameras,
  },

  {
    path: "/cameras/:houseId",
    component: Cameras,
    props: (route) => ({ houseId: route.params.houseId }),
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/events/:houseId",
    component: Events,
    props: (route) => ({ houseId: route.params.houseId }),
  },
  {
    path: "/faces/:flatId",
    component: Faces,
    props: (route) => ({ flatId: route.params.flatId }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
