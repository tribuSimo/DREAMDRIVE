<template>
  <v-app>
    <navbar></navbar>
    <v-container class="container">
      <v-alert v-if="errorMessage" color="error" dismissible>
        {{ errorMessage }}
      </v-alert>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card class="riepilogo-card">
            <v-row>
              <v-col cols="12">
                <h1 class="riepilogo_title">RIEPILOGO</h1>
              </v-col>
              <v-col cols="12">
                <h3 class="riepilogo_marcaModello">{{ auto[0].marca }} {{ auto[0].modello }}</h3>
              </v-col>
              <v-col cols="12">
                <h3 class="riepilogo_potenza">Potenza: {{ auto[0].potenza }} cv</h3>
              </v-col>
              <v-col cols="12">
                <h3 class="riepilogo_chilometraggio">Chilometraggio: {{ auto[0].chilometraggio }} km</h3>
              </v-col>
              <v-col cols="12">
                <h3 class="riepilogo_anno">Anno di produzione: {{ auto[0].annoProduzione }}</h3>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" md="8" class="text-center">
          <h1 class="riepilogo_Prezzo">Prezzo: {{ auto[0].prezzo }} €</h1>
          <v-btn class="btnPrenota rounded-xl" @click="apriDialog">Prenota</v-btn>
        </v-col>
      </v-row>
    </v-container>
    <finePagina></finePagina>

    <v-dialog v-model="dialogVisibile" max-width="600">
      <v-card>
        <v-card-title class="headline">Scegli un Orario</v-card-title>
        <v-card-text>
          <v-btn-toggle v-model="orarioSelezionato" color="primary" class="text-center">
            <v-btn :value="orario" v-for="orario in orari" :key="orario" color="primary">{{ orario }}</v-btn>
          </v-btn-toggle>
          <v-date-picker v-model="dataSelezionata" class="mt-4" :min="minDate"></v-date-picker>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="blue darken-1" @click="prenota">Prenota</v-btn>
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
      auto: [{
        "idAuto": "",
        "targa": "",
        "descrizione": "",
        "potenza": "",
        "chilometraggio": "",
        "annoProduzione": "",
        "cambio": "",
        "peso": "",
        "usata": false,
        "prezzo": "",
        "marca": "",
        "carburante": "",
        "modello": "",
        "colore": "",
        "immagini": ""
      }],
      dialogVisibile: false,
      orarioSelezionato: null,
      dataSelezionata: null,
      orari: ['9:00', '12:00', '15:00'],
      idUtente: null,
      errorMessage: '',
      minDate: moment().add(1, 'days').format('YYYY-MM-DD')
    };
  },
  created() {
    if (localStorage.getItem('token') && localStorage.getItem('ruolo') && localStorage.getItem('ruolo') >= 1) {
      this.prendiID();
      this.caricaAuto(this.$route.params.idAuto);
    } else {
      router.push('/login');
    }
  },
  methods: {
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
        } else {
          console.error('Errore nel caricamento di idUtente prenotazione:', response.statusText);
          this.errorMessage = 'Errore nel caricamento di idUtente prenotazione: ' + response.statusText;
        }
      } catch (error) {
        console.error('Errore nella richiesta per idUtente', error);
        this.errorMessage = 'Errore nella richiesta per idUtente', error.message;
      }
    },
    async caricaAuto(idAuto) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${window.dreamdrive_cfg.api}/auto/${idAuto}`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': `${token}`
          }
        });
        if (response.ok) {
          this.auto = await response.json();
        } else {
          console.error('Errore nel caricamento dei dettagli dell\'auto:', response.statusText);
          this.errorMessage = 'Errore nel caricamento dei dettagli dell\'auto: ' + response.statusText;
        }
      } catch (error) {
        console.error('Errore nella richiesta dei dettagli dell\'auto:', error);
        this.errorMessage = 'Errore nella richiesta dei dettagli dell\'auto: ' + error.message;
      }
    },
    apriDialog() {
      this.dialogVisibile = true;
    },
    async prenota() {
      try {
        const formattedDate = moment(this.dataSelezionata);

        if (!formattedDate.isValid())
          throw new Error('Formato data non valido');

        const formattedDateString = formattedDate.format('YYYY-MM-DD');
        const timeString = this.orarioSelezionato;
        const dateTimeString = `${formattedDateString} ${timeString}`;

        // Converti la data e l'ora nel formato datetime SQL valido
        const formattedDateTime = moment(dateTimeString, 'YYYY-MM-DD HH:mm');

        // Verifica se la data e l'ora convertite sono valide
        if (!formattedDateTime.isValid())
          throw new Error('Formato data e ora non validi');

        const dateTimeSQL = formattedDateTime.format('YYYY-MM-DD HH:mm:ss');
        const token = localStorage.getItem('token');

        const params = new URLSearchParams();
        params.append('idAuto', this.auto[0].idAuto);
        params.append('idUtente', this.idUtente);
        params.append('dataOra', dateTimeSQL);
        const response = await fetch(`${window.dreamdrive_cfg.api}/prenotazione`, {
          method: 'POST',
          body: params,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': `${token}`
          }
        });
        if (!response.ok) {
          this.errorMessage = 'Errore durante la prenotazione';
          throw new Error('Errore durante la prenotazione');
        } else {
          console.log('Prenotazione effettuata con successo');
        }
      } catch (error) {
        console.error('Errore invio richiesta prenotazione:', error);
        this.errorMessage = 'Errore invio richiesta prenotazione: ' + error.message;
      }
      this.dialogVisibile = false;
    }
  }
};
</script>

<style scoped>
.riepilogo_title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
}

.riepilogo-card {
  border: 2px solid black;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.riepilogo_marcaModello,
.riepilogo_potenza,
.riepilogo_chilometraggio,
.riepilogo_anno {
  font-size: 18px;
  margin-bottom: 5px;
}

.riepilogo_Prezzo {
  border: 2px solid #ffa500;
  border-radius: 10px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  font-size: 24px;
  margin-top: 20px;
}

.btnPrenota {
  margin-top: 20px;
  background-color: #ffa500;
  color: white;
  width: 100%;
  max-width: 200px;
}
</style>