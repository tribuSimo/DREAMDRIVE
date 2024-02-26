// router.js
import { createRouter, createWebHistory } from 'vue-router';
import login from './components/login.vue';
import registrazione from './components/registrazione.vue';

const routes = [
  {
    path: '/',
    name : 'login',
    component: login
  },
  {
    path: '/login',
    name: 'login',
    component: login // Pagina di login generica
  }
  ,
  {
    path: '/registrazione',
    name : 'registrazione',
    component: registrazione
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;