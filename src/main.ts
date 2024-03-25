import { createApp } from 'vue'
import './style/style.scss'
import App from './App.vue'
import router from './router';
import store from './store';
import i18n from './i18n';
import 'dayjs/locale/en';
import 'dayjs/locale/ru';


createApp(App)
    .use(router)
    .use(store)
    .use(i18n)
    .mount('#app')