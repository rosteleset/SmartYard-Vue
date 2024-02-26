import { createRouter, createWebHistory } from "vue-router";
import Addresses from "./components/Addresses.vue";

const routes = [
    {
        path: '/addresses',
        name: 'Addresses',
        component: Addresses
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router