<template>
    <v-app>
      <navbar></navbar>
      <div v-if="dati.length === 0" class="no-data-message">
        <h3>Non ci sono prenotazioni da confermare o disdire al momento.</h3>
      </div>
      <v-table class="tabella" v-else>
        <thead>
          <tr>
            <th class="text-center">
              <b>Nome auto</b>
            </th>
            <th class="text-center">
              <b>Email</b>
            </th>
            <th class="text-center">
              <b>Data Ora</b>
            </th>
            <th class="text-center">
              <b>Conferma</b>
            </th>
            <th class="text-center">
              <b>Disdetta</b>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dati" :key="item.name">
            <td><b>{{ item.marca }} {{ item.modello }}</b></td>
            <td><b>{{ item.email }}</b></td>
            <td><b>{{ formatDateTime(item.data_ora) }}</b></td>
            <td>
              <v-btn color="success" @click="selectedPrenotazione = item; accettaPrenotazione(selectedPrenotazione.idPrenotazione,selectedPrenotazione.email)">Conferma</v-btn>
            </td>
            <td>
              <!-- Aggiorna il pulsante Disdici -->
              <v-btn color="error" @click="dialog = true; selectedPrenotazione = item">Disdici</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-alert title="Errore" v-if="errorMessage" color="error" closable>
        {{ errorMessage }}
      </v-alert>
      <finePagina></finePagina>
  
      <!-- Aggiungi il dialog di conferma -->
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title class="headline">Conferma disdetta</v-card-title>
          <v-card-text>
            Sei sicuro di voler disdire l'appuntamento?
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="dialog = false">Annulla</v-btn>
            <v-btn color="error"
              @click="disdiciPrenotazione(selectedPrenotazione.idPrenotazione, selectedPrenotazione.email); dialog = false">Conferma</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
        dati: {}, // Aggiungi un array vuoto per contenere i dati della tabella
        dialog: false, // Aggiungi una variabile per controllare la visualizzazione del dialog di conferma
        selectedPrenotazione: null, // Aggiungi una variabile per memorizzare la prenotazione selezionata
        errorMessage: ''
      };
    },
    created() {
      if (localStorage.getItem('token')  && localStorage.getItem('ruolo') && localStorage.getItem('ruolo') >= 2)
        this.caricaPrenotazioni();
      else
        router.push('/login');
    },
    methods: {
      async caricaPrenotazioni() {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${window.dreamdrive_cfg.api}/getPrenotazioniAttesa`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              'Authorization': `${token}`
            }
          });
          if (response.ok) {
            this.dati = await response.json();
          } else {
            console.error('Errore nel caricamento delle prenotazioni:', response.statusText);
            this.errorMessage = 'Errore nel caricamento delle prenotazioni: ' + response.statusText;
          }
        } catch (error) {
          console.error('Errore nella richiesta di caricamento delle prenotazioni:', error);
          this.errorMessage = 'Errore nella richiesta di caricamento delle prenotazioni: ' + error.message;
        }
      },
      async disdiciPrenotazione(idPrenotazione, email) {
        try {
          const token = localStorage.getItem('token');
          const bodyData = new URLSearchParams();
          bodyData.append('email', email);

          const response = await fetch(`${window.dreamdrive_cfg.api}/disdiciPrenotazione/${idPrenotazione}`, {
            method: 'DELETE',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              'Authorization': `${token}`
            },
            body: bodyData.toString()
          });
          if (response.ok) {
            // Ricarica le prenotazioni dopo aver disdetto una
            this.caricaPrenotazioni(this.$route.params.idUtente);
            console.log('Prenotazione disdetta con successo');
          } else {
            console.error('Errore nella disdetta della prenotazione:', response.statusText);
            this.errorMessage = 'Errore nella disdetta della prenotazione: ' + response.statusText;
          }
        } catch (error) {
          console.error('Errore nella richiesta di disdetta della prenotazione:', error);
          this.errorMessage = 'Errore nella richiesta di disdetta della prenotazione: ' + error.message;
        }
      },
      async accettaPrenotazione(idPrenotazione,email) {
        try {
          const token = localStorage.getItem('token');
          const bodyData = new URLSearchParams();
          bodyData.append('email', email);
          const response = await fetch(`${window.dreamdrive_cfg.api}/accettaPrenotazioni/${idPrenotazione}`, {
            method: 'PUT',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              'Authorization': `${token}`
            },
            body: bodyData.toString()
            });
          if (response.ok) {
            // Ricarica le prenotazioni dopo aver disdetto una
            this.caricaPrenotazioni();
            console.log('Prenotazione accettata con successo');
          } else {
            console.error('Errore nella conferma della prenotazione:', response.statusText);
            this.errorMessage = 'Errore nella conferma della prenotazione: ' + response.statusText;
          }
        } catch (error) {
          console.error('Errore nella richiesta di conferma della prenotazione:', error);
          this.errorMessage = 'Errore nella richiesta di conferma della prenotazione: ' + error.message;
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