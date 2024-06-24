<template>
  <v-app>
    <navbar></navbar>
    <v-container class="container">
      <v-row>
        <v-col cols="12">
          <v-select v-model="autoSelezionata" :items="auto" item-title="nome" item-text="nome" item-value="idAuto"
            label="Seleziona un'auto" outlined dense class="custom-select"></v-select>
        </v-col>

        <v-col cols="12">
          <v-file-input v-model="immagini" label="Seleziona immagini" multiple outlined dense></v-file-input>
        </v-col>

        <v-col cols="12">
          <v-btn @click="aggiungiImmagine()" color="primary" class="custom-button">Aggiungi immagine</v-btn>
        </v-col>
      </v-row>
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
      auto: [],
      autoSelezionata: null,
      immagini: []
      // Array per memorizzare le opzioni delle auto
    };
  },
  created() {
    if (localStorage.getItem('token') && localStorage.getItem('ruolo') && localStorage.getItem('ruolo') >= 3) {
      this.caricaMarcaModello(); // Caricare le opzioni delle auto
    } else {
      router.push('/login');
    }
  },
  methods: {
    // Metodo per recuperare le opzioni delle auto
    async caricaMarcaModello() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${window.dreamdrive_cfg.api}/prendiMarcaModello`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': `${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          this.auto = data.map(car => ({ ...car, nome: `${car.marca} ${car.modello}` }));
        } else {
          console.error('Errore nel caricamento delle dati:', response.statusText);
          this.errorMessage = 'Errore nel caricamento dei dati: ' + response.statusText;
        }
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
        this.errorMessage = 'Errore nella richiesta dei dati: ' + error.message;
      }
    },

    async aggiungiImmagine() {

      if (!this.auto) {
        alert("Seleziona prima un'auto");
        return;
      }

      const formData = new FormData();

      this.immagini.forEach((immagine) => {
        formData.append('immagini', immagine);
      })
      formData.append('idAuto', this.autoSelezionata);
      try {

        const token = localStorage.getItem('token');
        const response = await fetch(`${window.dreamdrive_cfg.api}/inserisciImmagine`, {
          method: 'POST',
          headers: {
            // "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': `${token}`
          },
          body: formData
        });
        if (response.ok) {
          alert('Immagine inserita con successo');
        } else {
          console.error('Errore nel caricamento delle dati:', response.statusText);
          this.errorMessage = 'Errore nel caricamento dei dati: ' + response.statusText;
        }
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
        this.errorMessage = 'Errore nella richiesta dei dati: ' + error.message;
      }
    }
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  /* Occupa tutta la larghezza disponibile */
  max-width: 600px;
  /* Limita la larghezza per una migliore leggibilità */
  margin: 0 auto;
  /* Centra il contenuto orizzontalmente */
  padding: 20px;
  /* Aggiunge spazio intorno al contenuto */
}

.custom-select {
  width: 100%;
  /* Occupa tutta la larghezza disponibile */
  margin-bottom: 20px;
  /* Spazio inferiore tra gli elementi */
}

.v-btn {
  margin-top: 10px;
  background-color: #ffa500;
  color: white;
  width: 200px;
}
</style>
