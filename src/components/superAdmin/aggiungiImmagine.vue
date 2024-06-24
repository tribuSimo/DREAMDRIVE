<template>
    <v-app>
      <navbar></navbar>
      <v-container class="container">
        <v-select 
          label="Auto" 
          class="custom-select"
          v-model="autoSelezionata"
          :items="auto"
          item-text="nome"
          item-title="nome"
          item-value="idAuto"
        ></v-select>
        <v-file-input 
        label="Inserisci immagine"
        v-model="immagini"
        multiple>
        </v-file-input>

        <v-btn @click="aggiungiImmagine">Aggiungi immagine</v-btn>
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
        autoSelezionata : null,
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
            this.auto = data.map(car => ({...car, nome: `${car.marca } ${car.modello}`}));
            console.log(this.auto);
            
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

   async aggiungiImmagine(){
    
    if(!this.auto){
        alert("Seleziona prima un'auto");
        return;
      }  
      
      const formData = new formData();
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
            const data = await response.json();
            this.auto = data.map(car => ({...car, nome: `${car.marca } ${car.modello}`}));
            console.log(this.auto);
            
        } else {
          console.error('Errore nel caricamento delle dati:', response.statusText);
          this.errorMessage = 'Errore nel caricamento dei dati: ' + response.statusText;
        }
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
        this.errorMessage = 'Errore nella richiesta dei dati: ' + error.message;
      }
   }
};
  </script>
  
  <style scoped>
  .container {
    width: 40vw;
    height: 80vh;
    margin: 0 auto;
  }
  </style>
  