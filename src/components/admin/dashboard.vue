<template>
    <v-app>
      <navbar></navbar>
      <v-container class="containerSearch">
        <p></p>
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
        mostraUsate: false,
        marche: [],
        idUtente: null,
        errorMessage: '',
        inner_filtro: "Nessuno",
        inner_marca: "Nessuna",
        cercaQuery: ""
      };
    },
    created() {
      if (localStorage.getItem('token')  && localStorage.getItem('ruolo') && localStorage.getItem('ruolo') >= 1) {
        this.caricaAuto();
        this.visualizzaMarche();
      } else {
        router.push('/login');
      }
    },
    watch: {
      mostraUsate(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.visualizzaUsate();
        }
      }
    },
    computed: {
      filtro: {
        get() {
          return this.inner_filtro;
        },
        set(val) {
          this.inner_filtro = val;
          this.caricaAuto();
        }
      },
      marcaSelezionata: {
        get() {
          return this.inner_marca;
        },
        set(val) {
          this.inner_marca = val;
          this.caricaAuto();
        }
      }
    },
    methods: {
      prendiCerca(searchQuery){
        this.cercaQuery = searchQuery;
        this.caricaAuto();
      },
      getImageSrc(auto) {
        if (auto.immagini && auto.immagini.length > 0) {
          // Separa la stringa delle immagini e prendi la prima immagine
          const images = auto.immagini.split(',');
          // Aggiungi il percorso corretto della cartella pubblica
          return images.length > 0 ? `/${images[0]}` : '/workInProgress.jpg';
        }
        // Restituisce un'immagine di fallback se non ci sono immagini
        return '/workInProgress.jpg';
      },
      async caricaAuto() {
        try {
          const token = localStorage.getItem('token');
          let url = `${window.dreamdrive_cfg.api}/auto`;
          const params = new URLSearchParams();
          if (this.filtro && this.filtro !== "Nessuno") {
            params.append('sortBy', this.filtro);
          }
          console.log(this.cercaQuery);
          if(this.cercaQuery && this.cercaQuery !== ""){
            params.append('cerca', this.cercaQuery);
          }
          if (this.mostraUsate) {
            params.append('usata', 'true');
          }
  
          if (this.marcaSelezionata && this.marcaSelezionata !== 'Nessuna') {
            params.append('marca', this.marcaSelezionata);
          }
  
          if (params.toString()) {
            url += `?${params.toString()}`;
          }
  
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              'Authorization': `${token}`
            }
          });
  
          if (response.ok) {
            this.auto = await response.json();
          } else {
            console.error('Errore nel caricamento delle auto:', response.statusText);
            this.errorMessage = 'Errore nel caricamento delle auto: ' + response.statusText;
          }
        } catch (error) {
          console.error('Errore nel caricamento delle auto:', error);
          this.errorMessage = 'Errore nella richiesta delle auto: ' + error.message;
        }
      },
      visualizzaUsate() {
        this.caricaAuto();
      },
      async visualizzaMarche() {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${window.dreamdrive_cfg.api}/marche`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              'Authorization': `${token}`
            }
          });
          if (response.ok) {
            const marcheJson = await response.json();
            // Aggiungi la marca "Nessuna" all'inizio dell'array
            this.marche = ['Nessuna', ...marcheJson.map(marca => marca.marca)];
          } else {
            console.error('Errore nel caricamento delle marche:', response.statusText);
            this.errorMessage = 'Errore nel caricamento delle marche: ' + response.statusText;
          }
        } catch (error) {
          console.error('Errore nel caricamento delle marche:', error);
          this.errorMessage = 'Errore nella richiesta delle marche: ' + error.message;
        }
      },
      visualizzaDettagli(index) {
        const idAuto = this.auto[index].idAuto;
        this.$router.push({ name: 'Dettagli auto', params: { idAuto: idAuto } });
      }
    }
  };
  </script>
  
  <style scoped>
  .containerSearch {
    width: 100%;
    margin-top: 10vh;
    height: 300px;
  }
  
  .custom-select,
  .custom-checkbox {
    width: 100%;
  }
  
  @media (min-width: 600px) {
  
    .custom-select,
    .custom-checkbox {
      width: auto;
    }
  }
  
  .card {
    background-color: #f0f4f8;
    color: #000000;
    border: 2px solid #d1d8e0;
    margin: 2vh auto;
    transition: transform 1s ease, border-color 0.7s ease, background-color 0.7s ease, color 0.7s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .card:hover {
    transform: scale(1.05);
    background-color: #f0f0f0;
    border-color: #b0b0b0;
  }
  
  .card-image {
    height: 250px;
    /* Set a fixed height for the image */
    object-fit: cover;
    /* Ensure the image covers the area */
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