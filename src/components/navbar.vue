<template>
  <div>
    <!-- Icona del menu a tendina per dispositivi mobili -->
    <v-btn icon @click="toggleSidebar" class="hidden-sm-and-up menu-icon">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <!-- Navigation drawer per dispositivi mobili -->
    <v-navigation-drawer v-if="isMobile" v-model="sidebar" app>
      <v-list dense>
        <v-list-item v-for="item in menuItems" :key="item.title" :to="item.path" @click="handleMenuClick(item)">
          <v-list-item-content>{{ item.title }}</v-list-item-content>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app class="navbar" color="white" v-else>
      <v-container class="nav-container">
        <v-row class="nav">
          <v-img src="/logo.jpg" max-width="50" max-height="50" contain />
          <v-btn to="/home" class="nav-button">
            Auto <v-icon class="nav-icon">mdi-car</v-icon>
          </v-btn>
          <v-btn to="/nuoveUscite" class="nav-button">
            Nuove Uscite <v-icon class="nav-icon">mdi-new-box</v-icon>
          </v-btn>
          <v-btn @click="raggiungiPrenotazioni()" class="nav-button">
            Prenotazioni <v-icon class="nav-icon">mdi-calendar-check</v-icon>
          </v-btn>
          <v-btn @click="raggiungiNotifiche()" class="nav-button">
            Notifiche <v-icon class="nav-icon">mdi-bell</v-icon>
          </v-btn>
          <v-btn @click="logout()" class="nav-button">
            Logout <v-icon class="nav-icon">mdi-logout</v-icon>
          </v-btn>
          <div class="div-search">
            <v-text-field class="nav_v-text-field" append-inner-icon="mdi-magnify" placeholder="Cerca" outlined
              dense></v-text-field>
          </div>
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- Aggiungi v-alert per mostrare errori -->
    <v-alert title="Errore" v-if="errorMessage" color="error" closable>
      {{ errorMessage }}
    </v-alert>
  </div>
</template>


<script>
import router from '@/router';

export default {
  name: "App",
  data() {
    return {
      sidebar: false,
      idUtente: null,
      errorMessage: '', // Aggiungi una proprietà per il messaggio di errore
      menuItems: [
        { title: 'Home', icon: 'mdi-home', path: '/home' },
        { title: 'Nuove Uscite', icon: 'mdi-new-box', path: '/nuoveUscite' },
        { title: 'Prenotazioni', icon: 'mdi-calendar-check', action: 'raggiungiPrenotazioni' },
        { title: 'Notifiche', icon: 'mdi-bell',action: 'raggiungiNotifiche' },
        { title: 'Logout', icon: 'mdi-logout', action: 'logout' }
      ],
      isMobile: false
    };
  },
  methods: {
    logout() {
      localStorage.clear();
      router.push("/login");
    },
    async prendiID() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${window.dreamdrive_cfg.api}/getUserID`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': `${token}`
          }
        });
        if (response.ok) {
          let data = await response.json();
          this.idUtente = data.userId;
          console.log('ID utente:', this.idUtente);
        } else {
          this.errorMessage = 'Errore nel caricamento di idUtente: ' + response.statusText;
        }
      } catch (error) {
        this.errorMessage = 'Errore nella richiesta per idUtente: ' + error.message;
      }
    },
    raggiungiPrenotazioni() {
      if (this.idUtente) {
        router.push({ name: 'Prenotazioni', params: { idUtente: this.idUtente } });
      } else {
        this.errorMessage = 'ID utente non disponibile';
      }
    },
    raggiungiNotifiche() {
      if (this.idUtente) {
        router.push({ name: 'Notifiche', params: { idUtente: this.idUtente } });
      } else {
        this.errorMessage = 'ID utente non disponibile';
      }
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
    toggleSidebar() {
      this.sidebar = !this.sidebar;
    },
    handleMenuClick(item) {
      if (item.action) {
        this[item.action]();
      } else if (item.path) {
        router.push(item.path);
      }
    }
  },
  created() {
    if (localStorage.getItem('token')) {
      this.prendiID();
    } else {
      router.push('/login');
    }
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  }
};
</script>


<style scoped>
body,
#app {
  margin: 0;
  padding: 0;
}

.nav-button {
  text-align: left;
  margin-right: 10px;
  transition: background-color 1s;
}

.div-search {
  margin-top: 20px;
  display: flex;
  width: 400px;
}

.nav-button:hover {
  color: white;
  text-shadow: 1px 1px #000000;
  background-color: #ffa500;
}

.nav_v-text-field {
  width: 50px;
  padding-left: 30px;
}

.nav-container {
  padding: 0;
}

.nav {
  display: flex;
  align-items: center;
}

/* Imposta l'altezza della barra di navigazione */
.v-toolbar__content {
  min-height: 50px;
  /* Imposta l'altezza desiderata */
}

.navbar {
  background-color: #294c80 !important;
  color: #ffffff !important;
}

.v-navigation-drawer {
  background-color: #294c80;
  color: #fff;
}

/* Stile per gli item nella lista */
.v-list-item {
  cursor: pointer;
}

/* Stile per l'icona e il contenuto degli item nella lista */
.v-list-item-icon,
.v-list-item-content {
  color: #fff;
}

.menu-icon {
  position: fixed;
  top: 0;
  left: 0;
  padding: 8px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 999;
}

.menu-container {
  width: 100%;
  height: 50px;
  background-color: #294c80;
  padding: 8px;
  z-index: 999;
}

.nav-icon {
  color: white;
  /* Colore iniziale delle icone */
  transition: color 0.3s;
  /* Aggiungi una transizione al cambio di colore */
  margin-left: 5px;
}
</style>