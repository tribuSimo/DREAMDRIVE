<template>
  <v-app>
    <navbar></navbar>
    <v-alert title="Errore" v-if="errorMessage" color="error" closable>
      {{ errorMessage }}
    </v-alert>
    <div v-if="vendite.length === 0" class="no-data-message">
      <h3>Non ci sono vendite effettuate.</h3>
    </div>
    <v-table class="tabella" v-else>
      <thead>
        <tr>
          <th class="text-center">
            <b>Nome auto</b>
          </th>
          <th class="text-center">
            <b>Nome Acquirente</b>
          </th>
          <th class="text-center">
            <b>Cognome Acquirente</b>
          </th>
          <th class="text-center">
            <b>Codice fiscale</b>
          </th>
          <th class="text-center">
            <b>Telefono Acquirente</b>
          </th>
          <th class="text-center">
            <b>Data Vendita</b>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="vendita in vendite" :key="vendita.idVendita">
          <td><b>{{ vendita.marca }} {{ vendita.modello }}</b></td>
          <td><b>{{ vendita.nome }}</b></td>
          <td><b>{{ vendita.cognome }}</b></td>
          <td><b>{{ vendita.codiceFiscale }}</b></td>
          <td><b>{{ vendita.telefono }}</b></td>
          <td><b>{{ formatDateTime(vendita.data_ora) }}</b></td>
        </tr>
      </tbody>
    </v-table>

    <finePagina></finePagina>
  </v-app>
</template>
<script>
import navbar from './navbar.vue';
import finePagina from '../footer.vue';
import router from '@/router';
import moment from 'moment';

export default {
  components: {
    navbar,
    finePagina
  },
  data() {
    return {
      vendite: [], // Array per le vendite
      dialog: false,
      selectedVendita: null,
      errorMessage: ''
    };
  },
  created() {
    if (localStorage.getItem('token') && localStorage.getItem('ruolo') && localStorage.getItem('ruolo') >= 2) {
      this.caricaVendite(this.$route.params.idUtente);
    } else {
      router.push('/login');
    }
  },
  methods: {
    async caricaVendite(idUtente) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${window.dreamdrive_cfg.api}/getVendite/${idUtente}`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': `${token}`
          }
        });
        if (response.ok) {
          this.vendite = await response.json();
        } else {
          console.error('Errore nel caricamento delle vendite:', response.statusText);
          this.errorMessage = 'Errore nel caricamento delle vendite: ' + response.statusText;
        }
      } catch (error) {
        console.error('Errore nella richiesta di caricamento delle vendite:', error);
        this.errorMessage = 'Errore nella richiesta di caricamento delle vendite: ' + error.message;
      }
    },
    formatDateTime(dateTime) {
      return moment(dateTime).format('DD/MM/YYYY HH:mm:ss');
    },
  }
};
</script>

<style scoped>
.no-data-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  color: grey;
}

/* Stile per la larghezza della tabella */
.tabella {
  margin-top: 60px;
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  /* Combina i bordi delle celle */
}

/* Stile per i bordi della tabella e delle celle */
.tabella th,
.tabella td {
  border: 1px solid #dddddd;
  /* Aggiungi bordo grigio */
  padding: 8px;
  /* Aggiungi spazio interno */
  text-align: center;
  /* Allinea il testo al centro */
}

/* Stile per il pulsante Disdici */
.v-btn.error {
  color: white;
}
</style>