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
  },/*,
  {
    path: '/admin',
    component: () => import('./views/admin/AdminLayout.vue'), // Layout generico per l'admin
    children: [
      {
        path: '',
        name: 'adminDashboard',
        component: () => import('./views/admin/Dashboard.vue') // Pagina dashboard per l'admin
      },
      {
        path: 'users',
        name: 'adminUsers',
        component: () => import('./views/admin/Users.vue') // Pagina per la gestione degli utenti per l'admin
      },
      // Altre rotte specifiche per l'admin
    ]
  },
  {
    path: '/client',
    component: () => import('./views/client/ClientLayout.vue'), // Layout generico per il cliente
    children: [
      {
        path: '',
        name: 'clientDashboard',
        component: () => import('./views/client/Dashboard.vue') // Pagina dashboard per il cliente
      },
      {
        path: 'orders',
        name: 'clientOrders',
        component: () => import('./views/client/Orders.vue') // Pagina per la gestione degli ordini per il cliente
      },
      // Altre rotte specifiche per il cliente
    ]
  },
  {
    path: '/superadmin',
    component: () => import('./views/superadmin/SuperAdminLayout.vue'), // Layout generico per il superadmin
    children: [
      {
        path: '',
        name: 'superadminDashboard',
        component: () => import('./views/superadmin/Dashboard.vue') // Pagina dashboard per il superadmin
      },
      {
        path: 'settings',
        name: 'superadminSettings',
        component: () => import('./views/superadmin/Settings.vue') // Pagina per le impostazioni del superadmin
      },
      // Altre rotte specifiche per il superadmin
    ]
  },*/
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;