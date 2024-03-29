import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import { getBasePath } from "@/lib/basePath";
import Auth from "@/components/Auth.vue";
import { useUserStore } from "@/store/user";
import { watch } from "vue";

const BASE_PATH = getBasePath();

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Auth",
    component: Auth,
  },
  {
    path: `/addresses`,
    name: "AddressesList",
    component: () => import("@/components/AddressesList.vue"),
  },
  {
    path: `/addresses/:houseId`,
    component: () => import("./components/Address.vue"),
    props: (route) => ({ houseId: route.params.houseId }),
  },
  {
    path: `/cameras`,
    name: "CityCameras",
    component: () => import("./components/Cameras.vue"),
    props: () => ({ overview: true }),
  },
  {
    path: `/cameras/all`,
    component: () => import("./components/Cameras.vue"),
  },
  {
    path: `/cameras/:houseId`,
    component: () => import("./components/Cameras.vue"),
    props: (route) => ({ houseId: route.params.houseId }),
  },
  {
    path: `/chat`,
    name: "Chat",
    component: () => import("./components/Chat.vue"),
  },
  {
    path: `/settings`,
    name: "Settings",
    component: () => import("./components/Settings.vue"),
  },
  {
    path: `/settings/:houseId`,
    component: () => import("./components/AddressSettings.vue"),
    props: (route) => ({ houseId: route.params.houseId }),
  },
  {
    path: `/events/:houseId`,
    component: () => import("./components/Events.vue"),
    props: (route) => ({ houseId: route.params.houseId }),
  },
  {
    path: `/faces/:flatId`,
    component: () => import("./views/Faces.vue"),
    props: (route) => ({ flatId: route.params.flatId }),
  },
];

const router = createRouter({
  history: createWebHistory(BASE_PATH),
  routes,
});

// ожидание загрузки данных пользователя
router.beforeEach(async (_to, _from, next) => {
  const userStore = useUserStore();
  if (userStore.isLoaded) next();
  const awaitLoad = async () => {
    return new Promise((resolve) => {
      const unwatch = watch(
        () => userStore.isLoaded,
        (value) => {
          if (value) {
            unwatch(); // Отписываемся от слежения после изменения значения
            resolve(true);
          }
        }
      );
    });
  };
  await awaitLoad();
  next();
});

// переадресаця неавторизованных
router.beforeEach(async (to) => {
  const { isLoaded, error } = useUserStore();
  const isAuthenticated = isLoaded && !error;
  if (
    // make sure the user is authenticated
    !isAuthenticated &&
    // ❗️ Avoid an infinite redirect
    to.name !== "Auth"
  ) {
    // redirect the user to the login page
    return { name: "Auth" };
  }
});

export default router;
