import { createRouter, createWebHistory } from "vue-router";
import AddressesList from "./components/AddressesList.vue";
import Test from "./components/Test.vue";

const routes = [
    {
        path: '/addresses',
        name: 'AddressesList',
        component: AddressesList
    },
    {
        path:'/test',
        name: 'test',
        component: Test
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router