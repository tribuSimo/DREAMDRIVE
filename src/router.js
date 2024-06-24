// router.js
import { createRouter, createWebHistory } from 'vue-router';
import login from './components/login.vue';
import registrazione from './components/registrazione.vue';
//clienti
import home from './components/clienti/home.vue';
import dettagliAuto from './components/clienti/dettagliAuto.vue';
import effettuaPrenotazioni from './components/clienti/effettuaPrenotazioni.vue';
import prenotazioni from './components/clienti/prenotazioni.vue';
import nuoveUscite from './components/clienti/nuoveUscite.vue';
import notifiche from './components/clienti/notifiche.vue';
//admin
import dashboardAdmin from './components/admin/dashboard.vue';
import autoAdmin from './components/admin/auto.vue';
import dettagliAutoAdmin from './components/admin/dettagliAuto.vue';
import vendiAutoCliente from './components/admin/effettuaVendita.vue';
import notificheAdmin from './components/admin/notifiche.vue';
import prenotazioniAdmin from './components/admin/prenotazioni.vue';
import venditeAdmin from './components/admin/vendite.vue';
//superAdmin
import aggiungiAuto from './components/superAdmin/aggiungiAuto.vue';
import aggiungiImmagine from './components/superAdmin/aggiungiImmagine.vue';
import nuovoAdmin from './components/superAdmin/nuovoAdmin.vue';
import cancellaAdmin from './components/superAdmin/cancellaAdmin.vue';
import catalogo from './components/superAdmin/catalogo.vue';
import dettagliAutoSuperAdmin from './components/superAdmin/dettagliAuto.vue';

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
    path: '/clienti/home',
    name : 'home',
    component: home
  },
  {
    path: '/clienti/dettagliAuto/:idAuto',
    name : 'Dettagli auto',
    component : dettagliAuto
  },
  {
    path: '/clienti/effettuaPrenotazioni/:idAuto',
    name : 'Effettua Prenotazioni',
    component: effettuaPrenotazioni
  },
  {
    path: '/clienti/prenotazioni/:idUtente',
    name : 'Prenotazioni',
    component: prenotazioni
  },
  {
    path: '/clienti/nuoveUscite',
    name : 'Nuove Uscite',
    component: nuoveUscite
  },
  {
    path: '/clienti/notifiche/:idUtente',
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
    path: '/admin/effettuaVendita/:idAuto',
    name : 'Effettua vendita admin',
    component: vendiAutoCliente
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
  {
    path: '/superAdmin/aggiungiAuto',
    name : 'Aggiungi auto',
    component: aggiungiAuto
  },

  {
    path: '/superAdmin/nuovoAdmin',
    name : 'Nuovo admin',
    component: nuovoAdmin
  },

  {
    path: '/superAdmin/cancellaAdmin',
    name : 'Cancella admin',
    component: cancellaAdmin
  },
  {
    path: '/superAdmin/aggiungiImmagine',
    name : 'Aggiungi immagine',
    component: aggiungiImmagine
  },
  {
    path: '/superAdmin/catalogo',
    name : 'Catalogo',
    component: catalogo
  },
  {
    path: '/superAdmin/dettagliAuto/:idAuto',
    name : 'Dettagli auto superAdmin',
    component: dettagliAutoSuperAdmin
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;