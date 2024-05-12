<template>
  <v-app-bar app class="navbar" color="white">
    <v-container class="nav-container">
      <v-row class="nav">
        <v-img src="/logo.jpg" max-width="50" max-height="50" contain />
        <v-btn to="/home" class="nav-button">
          Auto
        </v-btn>
        <v-btn to="/nuove-uscite" class="nav-button">
          Nuove Uscite
        </v-btn>
        <v-btn @click="raggiungiPrenotazioni()" class="nav-button">
          Prenotazioni
        </v-btn>
        <v-btn to="/notifiche" class="nav-button">
          Notifiche
        </v-btn>
        <v-btn @click="logout()" class="nav-button">
          Logout
        </v-btn>
        <div class="div-search">
          <v-text-field class="nav_v-text-field" append-inner-icon="mdi-magnify" placeholder="Cerca" outlined
            dense></v-text-field>
        </div>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import router from '@/router';

export default {
  name: "App",
  created() {
    if (localStorage.getItem('token')) {
      this.prendiID();
    } else {
      router.push('/login');
    }
  },
  data: () => ({
    items: [
      { title: 'Click Me' },
      { title: 'Click Me' },
      { title: 'Click Me' },
      { title: 'Click Me 2' },
    ],
    idUtente: null
  }),
  methods: {
    logout() {
      localStorage.clear();
      router.push("/login");
    },
    async prendiID() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/getUserID', {
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
          console.error('Errore nel caricamento di idUtente:', response.statusText);
        }
      } catch (error) {
        console.error('Errore nella richiesta per idUtente', error);
      }
    },
    raggiungiPrenotazioni() {
      if (this.idUtente) {
        // Esegue il reindirizzamento alla pagina delle prenotazioni con l'ID dell'utente come parametro
        router.push({ name: 'Prenotazioni', params: { idUtente: this.idUtente } });
      } else {
        console.error('ID utente non disponibile');
      }
    }
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
</style>
