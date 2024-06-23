<template>
  <v-app>
    <navbar></navbar>
    <v-container class="containerSearch">
      <v-row v-if="this.prenotazioni.length > 0">
        <v-col v-for="prenotazione in prenotazioni" :key="prenotazione.id" :cols="12" :md="4">
          <v-card :class="getCardClass(prenotazione.data_ora)" class="appointment-card">
            <v-card-title>Prenotazione per {{ prenotazione.marca }} {{ prenotazione.modello }}</v-card-title>
            <v-card-subtitle>{{ formatDate(prenotazione.data_ora) }}</v-card-subtitle>
            <v-card-text>
              <p>Effettuata da: {{ prenotazione.email }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <div v-else class="no-data-message">
        <h3>Non ci sono appuntamenti confermati al momento.</h3>
      </div>
      <v-alert v-if="errorMessage" type="error">
        {{ errorMessage }}
      </v-alert>
    </v-container>
    <finePagina></finePagina>
  </v-app>
</template>

<script>
import navbar from './navbar.vue';
import finePagina from '../footer.vue';
import router from '@/router';

export default {
  components: {
    navbar,
    finePagina
  },
  data() {
    return {
      prenotazioni: [],
      errorMessage: '',
    };
  },
  created() {
    if (localStorage.getItem('token') && localStorage.getItem('ruolo') && localStorage.getItem('ruolo') >= 2) {
      this.caricaPrenotazioni();
    } else {
      router.push('/login');
    }
  },
  methods: {
    async caricaPrenotazioni() {
      try {
        const token = localStorage.getItem('token');
        let url = `${window.dreamdrive_cfg.api}/getPrenotazioni`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': `${token}`
          }
        });

        if (response.ok) {
          this.prenotazioni = await response.json();
          console.log(this.prenotazioni);
        } else {
          console.error('Errore nel caricamento delle prenotazioni:', response.statusText);
          this.errorMessage = 'Errore nel caricamento delle prenotazioni: ' + response.statusText;
        }
      } catch (error) {
        console.error('Errore nel caricamento delle prenotazioni:', error);
        this.errorMessage = 'Errore nella richiesta delle prenotazioni: ' + error.message;
      }
    },
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    getCardClass(date) {
      const currentDate = new Date();
      const appointmentDate = new Date(date);
      const diffTime = appointmentDate - currentDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        return 'card-red';
      } else if (diffDays <= 3) {
        return 'card-yellow';
      } else {
        return 'card-green';
      }
    },
  }
};
</script>

<style scoped>
.containerSearch {
  width: 100%;
  height: 100%;
  margin-top: 10vh;
}

.card-red {
  background-color: #ffcccc;
}

.card-yellow {
  background-color: #fff5cc;
}

.card-green {
  background-color: #ccffcc;
}

.appointment-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.appointment-card:hover {
  transform: scale(1.05);
}

.card {
  color: #000000;
  border: 2px solid #d1d8e0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-image {
  height: 250px;
  object-fit: cover;
}

.v-alert {
  margin-top: 20px;
}

.no-new-release {
  font-size: 24px;
  font-family: 'Roboto', sans-serif;
  color: #555;
  text-align: center;
  padding-bottom: 800px;
}
</style>