// router.js
import { createRouter, createWebHistory } from 'vue-router';
import login from './components/login.vue';
import registrazione from './components/registrazione.vue';
//clienti
import home from './components/home.vue';
import dettagliAuto from './components/dettagliAuto.vue';
import effettuaPrenotazioni from './components/effettuaPrenotazioni.vue';
import prenotazioni from './components/prenotazioni.vue';
import nuoveUscite from './components/nuoveUscite.vue';
import notifiche from './components/notifiche.vue';
//admin
import dashboardAdmin from './components/admin/dashboard.vue';
import autoAdmin from './components/admin/auto.vue';
import dettagliAutoAdmin from './components/admin/dettagliAuto.vue';
import acquistaAutoCliente from './components/admin/effettuaAcquisto.vue';
import notificheAdmin from './components/admin/notifiche.vue';
import prenotazioniAdmin from './components/admin/prenotazioni.vue';
import venditeAdmin from './components/admin/vendite.vue';


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
    path: '/dettagliAuto/:idAuto',
    name : 'Dettagli auto',
    component : dettagliAuto
  },
  {
    path: '/effettuaPrenotazioni/:idAuto',
    name : 'Effettua Prenotazioni',
    component: effettuaPrenotazioni
  },
  {
    path: '/prenotazioni/:idUtente',
    name : 'Prenotazioni',
    component: prenotazioni
  },
  {
    path: '/nuoveUscite',
    name : 'Nuove Uscite',
    component: nuoveUscite
  },
  {
    path: '/notifiche/:idUtente',
    name : 'Notifiche',
    component: notifiche
  },
  {
    path: '/admin/dashboard',
    name : 'Dashboard admin',
    component: dashboardAdmin
  },
  {
    path: '/admin/auto',
    name : 'Auto admin',
    component: autoAdmin
  },
  {
    path: '/admin/dettagliAuto/:idAuto',
    name : 'DettagliAuto admin',
    component: dettagliAutoAdmin
  },
  {
    path: '/admin/effettuaAcquisto/:idAuto',
    name : 'Acquisto admin',
    component: acquistaAutoCliente
  },
  {
    path: '/admin/notifiche/:idUtente',
    name : 'Notifiche admin',
    component: notificheAdmin
  },
  {
    path: '/admin/prenotazioni',
    name : 'Prenotazioni admin',
    component: prenotazioniAdmin
  },
  {
    path: '/admin/vendite/:idUtente',
    name : 'Vendite admin',
    component: venditeAdmin
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;