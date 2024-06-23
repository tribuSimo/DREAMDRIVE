<template>
    <v-app>
      <navbar></navbar>
      <v-container class="container">
        <v-select 
          label="Auto" 
          class="custom-select"
          v-model="auto"
          :items="autoOptions"
          item-text="model"
          item-value="model"
        ></v-select>
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
        auto: null,
        autoOptions: [] // Array per memorizzare le opzioni delle auto
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
            alert("dovrebbe andare");
          // Aggiungi la marca "Nessuna" all'inizio dell'array
          
        } else {
          console.error('Errore nel caricamento delle marche:', response.statusText);
          this.errorMessage = 'Errore nel caricamento delle marche: ' + response.statusText;
        }
      } catch (error) {
        console.error('Errore nel caricamento delle marche:', error);
        this.errorMessage = 'Errore nella richiesta delle marche: ' + error.message;
      }
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
  