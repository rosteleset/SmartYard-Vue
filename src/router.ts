import {RouteRecordRaw, createRouter, createWebHistory} from "vue-router";
import Auth from "@/views/Auth.vue";
import {useUserStore} from "@/store/user";
import {watch} from "vue";

const BASE_PATH = import.meta.env.VITE_BASE_PATH || '/';

export const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "Auth",
        component: Auth,
        beforeEnter: (() => {
            const userStore = useUserStore();
            if (userStore.isAuth)
                return {name: "AddressesList"};
        })
    },
    {
        path: `/addresses`,
        name: "AddressesList",
        component: () => import("@/views/Addresses.vue"),
    },
    {
        path: `/addresses/:houseId`,
        component: () => import("@/views/Address.vue"),
        props: (route) => ({houseId: route.params.houseId}),
    },
    {
        path: `/cameras`,
        name: "CityCameras",
        component: () => import("@/views/Cameras.vue"),
        props: () => ({overview: true}),
    },
    {
        path: `/cameras/all`,
        component: () => import("@/views/Cameras.vue"),
    },
    {
        path: `/cameras/:houseId`,
        component: () => import("@/views/Cameras.vue"),
        props: (route) => ({houseId: route.params.houseId}),
    },
    {
        path: `/chat`,
        name: "Chat",
        component: () => import("@/views/Chat.vue"),
    },
    {
        path: `/settings`,
        name: "Settings",
        component: () => import("@/views/Settings.vue"),
    },
    {
        path: `/settings/:houseId`,
        component: () => import("@/views/Settings.vue"),
        props: (route) => ({houseId: route.params.houseId}),
    },
    {
        path: `/events/:houseId`,
        component: () => import("@/views/Events.vue"),
        props: (route) => ({houseId: route.params.houseId}),
    },
    {
        path: `/faces/:flatId`,
        component: () => import("@/views/Faces.vue"),
        props: (route) => ({flatId: route.params.flatId}),
    },
    {
        path: `/call`,
        component: () => import("@/views/Call.vue"),
    }
];

const router = createRouter({
    history: createWebHistory(BASE_PATH),
    routes,
});

// ожидание загрузки данных пользователя
router.beforeEach(async (_to, _from, next) => {
    const userStore = useUserStore();
    if (userStore.isLoaded || userStore.error) next();
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
    const {isLoaded, isAuth} = useUserStore();
    if (
        // make sure the user is authenticated
        isLoaded && !isAuth &&
        // ❗️ Avoid an infinite redirect
        to.name !== "Auth"
    ) {
        // redirect the user to the login page
        return {name: "Auth"};
    }
});

export default router;
