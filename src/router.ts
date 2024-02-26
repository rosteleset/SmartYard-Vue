import { createRouter, createWebHistory } from "vue-router";
import AddressesList from "./components/AddressesList.vue";

const routes = [
    {
        path: '/addresses',
        name: 'AddressesList',
        component: AddressesList
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router