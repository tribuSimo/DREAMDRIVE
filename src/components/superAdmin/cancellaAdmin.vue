<template>
    <v-app>
      <navbar></navbar>
      <v-alert title="Errore" v-if="errorMessage" color="error" closable>
        {{ errorMessage }}
      </v-alert>
      <div v-if="dati.length === 0" class="no-data-message">
        <h3>Non ci sono prenotazioni attive a tuo nome al momento.</h3>
      </div>
      <v-table class="tabella" v-else>
        <thead>
          <tr>
            <th class="text-center">
              <b>Email</b>
            </th>
            <th class="text-center">
              <b>Password</b>
            </th>
            <th class="text-center">
              <b>Data nascita</b>
            </th>
            <th class="text-center">
              <b>Azioni</b>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dati" :key="item.name">
            <td><b>{{ item.marca }} {{ item.modello }}</b></td>
            <td><b>{{ formatDateTime(item.data_ora) }}</b></td>
            <td>
              <v-chip :color="getChipColor(item.stato)" variant="flat"><b>{{ item.stato }}</b></v-chip>
            </td>
            <td>
              <!-- Aggiorna il pulsante Disdici -->
              <v-btn color="error" @click="dialog = true; selectedPrenotazione = item">Disdici</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
  
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
              @click="disdiciPrenotazione(selectedAdmin.idUtente); dialog = false">Conferma</v-btn>
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
    data() {this.$route.params.idUtente
      return {
        dati: {}, // Aggiungi un array vuoto per contenere i dati della tabella
        dialog: false, // Aggiungi una variabile per controllare la visualizzazione del dialog di conferma
        selectedAdmin: null, // Aggiungi una variabile per memorizzare la prenotazione selezionata
        errorMessage: '',
        idUtente: null
      };
    },
    created() {
      if (localStorage.getItem('token')  && localStorage.getItem('ruolo') && localStorage.getItem('ruolo') >= 1)
        this.caricaUtenti(this.$route.params.idUtente);
      else
        router.push('/login');
    },
    methods: {
      async caricaUtenti(idUtente) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${window.dreamdrive_cfg.api}/utenti/${idUtente}`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              'Authorization': `${token}`
            }
          });
          if (response.ok) {
            this.dati = await response.json();
          } else {
            console.error('Errore nel caricamento degli utenti:', response.statusText);
            this.errorMessage = 'Errore nel caricamento degli utenti: ' + response.statusText;
          }
        } catch (error) {
          console.error('Errore nella richiesta di caricamento degli utenti:', error);
          this.errorMessage = 'Errore nella richiesta di caricamento degli utenti: ' + error.message;
        }
      },
      async eliminaAdmin(idUtente) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${window.dreamdrive_cfg.api}/eliminaAdmin/${idUtente}`, {
            method: 'DELETE',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              'Authorization': `${token}`
            }
          });
          if (response.ok) {
            // Ricarica le prenotazioni dopo aver disdetto una
            this.caricaPrenotazioni(this.$route.params.idUtente);
            console.log('Prenotazione disdetta con successo');
          } else {
            console.error(`Errore nella cancellazione dell'admin:`, response.statusText);
            this.errorMessage = `Errore nella cancellazione dell'admin: ` + response.statusText;
          }
        } catch (error) {
          console.error(`Errore nella richiesta di eliminazione dell'admin:`, error);
          this.errorMessage = `Errore nella richiesta di eliminazione dell'admin: ` + error.message;
        }
      },
      formatDateTime(dateTime) {
        return moment(dateTime).format('DD/MM/YYYY HH:mm:ss');
      },
      getChipColor(status) {
        // Assegna un colore diverso in base allo stato della prenotazione
        switch (status) {
          case 'In attesa':
            return 'yellow';
          case 'Accettata':
            return 'primary';
          case 'Effettuata':
            return 'green';
          default:
            return '';
        }
      }
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