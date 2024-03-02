// router.js
import { createRouter, createWebHistory } from 'vue-router';
import login from './components/login.vue';
import registrazione from './components/registrazione.vue';
import navbar from './components/navbar.vue';
import home from './components/home.vue';


const routes = [
  {
    path: '/',
    // name : 'login',
    // component: login
    redirect : "/login"
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
  ,
  {
    path: '/home',
    name : 'home',
    component: home
  },
  {
    path: '/navbar',
    name : 'navbar',
    component: navbar
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;