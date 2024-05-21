<template>
  <v-app>
    <navbar></navbar>

    <div class="container">
      <v-alert title="Errore" v-if="errorMessage" color="error" closable>
        {{ errorMessage }}
      </v-alert>
      <!-- Testo "Riepilogo" posizionato in alto a destra -->
      <h1 class="riepilogo_title">RIEPILOGO</h1>
      <h3 class="riepilogo_marcaModello">{{ auto[0].marca }} {{ auto[0].modello }}</h3>
      <h3 class="riepilogo_potenza">Potenza: {{ auto[0].potenza }} cv</h3>
      <h3 class="riepilogo_chilometraggio">Chilometraggio: {{ auto[0].chilometraggio }} km</h3>
      <h3 class="riepilogo_anno">Anno di produzione: {{ auto[0].annoProduzione }}</h3>
      <!-- Altri dettagli dell'auto -->
    </div>

    <!-- Div a destra con testo h1 e bottone -->
    <div class="right-div">
      <h1 class="riepilogo_Prezzo">Prezzo: {{ auto[0].prezzo }} €</h1>
      <v-btn class="btnPrenota rounded-xl" @click="apriDialog">Prenota Incontro</v-btn>
    </div>

    <finePagina></finePagina>

    <!-- Dialog -->
    <v-dialog v-model="dialogVisibile" max-width="600">
      <v-card>
        <v-card-title class="headline">Scegli un Orario</v-card-title>
        <v-card-text>
          <v-btn-toggle v-model="orarioSelezionato" color="primary" class="text-center">
            <v-btn :value="orario" v-for="orario in orari" :key="orario" color="primary">{{ orario }}</v-btn>
          </v-btn-toggle>
          <v-date-picker v-model="dataSelezionata" class="mt-4"></v-date-picker>
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
import finePagina from './footer.vue';
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
      errorMessage: ''
    };
  },
  created() {
    if (localStorage.getItem('token')) {
      this.prendiID();
      this.caricaAuto(this.$route.params.idAuto);
    }
    else
      router.push('/login');
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
        this.errorMessage = 'Errore nella richiesta per idUtente', error.message
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
/* Stile per posizionare il testo "Riepilogo" in alto a destra */
.riepilogo_title {
  font-size: 40px;
  font-weight: bold;
  position: absolute;
  top: 150px;
  /* Regola l'altezza dal top */
  left: 10%;
  /* Regola la distanza dal bordo destro */
}

/* Stile per posizionare gli altri dettagli dell'auto in alto a sinistra */
.riepilogo_marcaModello {
  position: absolute;
  top: 220px;
  /* Regola l'altezza dal top */
  left: 10%;
  /* Regola la distanza dal bordo sinistro */
}

.riepilogo_potenza {
  position: absolute;
  top: 260px;
  /* Regola l'altezza dal top */
  left: 10%;
  /* Regola la distanza dal bordo sinistro */
}

.riepilogo_chilometraggio {
  position: absolute;
  top: 300px;
  /* Regola l'altezza dal top */
  left: 10%;
  /* Regola la distanza dal bordo sinistro */
}

.riepilogo_anno {
  position: absolute;
  top: 340px;
  /* Regola l'altezza dal top */
  left: 10%;
  /* Regola la distanza dal bordo sinistro */
}

/* Stile per posizionare il nuovo div a destra */
.right-div {
  position: absolute;
  top: 150px;
  /* Regola l'altezza dal top */
  right: 10%;
  /* Regola la distanza dal bordo destro */
  width: 30%;
  /* Regola la larghezza del div */
  padding: 20px;
  /* Opzionale: spazio interno per il div */
}

/* Stile per il prezzo con bordo sfocato */
.riepilogo_Prezzo {
  border: 2px solid #ffa500;
  /* Bordo sfocato */
  border-radius: 10px;
  padding: 10px;
  /* Spazio interno */
  backdrop-filter: blur(5px);
  /* Effetto di sfocatura */
  -webkit-backdrop-filter: blur(5px);
  /* Effetto di sfocatura per browser Webkit */
}

.btnPrenota {
  margin-top: 20px;
  background-color: #ffa500;
  color: white;
  width: 200px;
}
</style>