<template>
  <v-app>
    <navbar @ricerca-eseguita="prendiCerca"></navbar>
    <v-container class="containerSearch">
      <v-row class="d-flex justify-space-between flex-wrap mb-4">
        <v-col cols="12" md="4" class="filter-item">
          <v-select label="Ordina" :items="['Nessuno', 'Prezzo', 'Anno produzione', 'Chilometraggio']"
            class="custom-select" v-model="filtro"></v-select>
        </v-col>
        <v-col cols="12" md="4" class="filter-item">
          <v-select label="Marca" class="custom-select" :items="marche" v-model="marcaSelezionata"></v-select>
        </v-col>
        <v-col cols="12" md="4" class="filter-item">
          <v-checkbox class="custom-checkbox" v-model="mostraUsate" label="Usata"></v-checkbox>
        </v-col>
      </v-row>
      <v-row v-if="auto.length > 0">
        <v-col cols="12" sm="6" md="4" v-for="(auto, index) in auto" :key="index">
          <v-card class="card" @click="visualizzaDettagli(index)" outlined>
            <v-img :src="auto.immagini && auto.immagini.length > 0 ? auto.immagini.split(',')[0] : 'workInProgress.jpg'"
              aspect-ratio="16/9" class="card-image" cover></v-img>
            <v-card-title class="card-title"><strong>{{ auto.marca }} {{ auto.modello }}</strong></v-card-title>
            <v-card-text class="card-text">
              <div><strong>Potenza:</strong> {{ auto.potenza }} cv</div>
              <div><strong>Chilometraggio:</strong> {{ auto.chilometraggio }} km</div>
              <div><strong>Anno di produzione:</strong> {{ auto.annoProduzione }}</div>
              <div><strong>Usata:</strong> {{ auto.usata && auto.usata.data[0] === 1 ? 'Sì' : 'No' }}</div>
              <div><strong>Prezzo:</strong> {{ auto.prezzo }} €</div>
              <div><strong>Carburante:</strong> {{ auto.carburante }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="12">
          <p class="no-new-release">Nessuna auto disponibile</p>
        </v-col>
      </v-row>
      <v-alert title="Errore" v-if="errorMessage" color="error" closable>
        {{ errorMessage }}
      </v-alert>
    </v-container>
    <finePagina></finePagina>
  </v-app>
</template>

<script>
import navbar from './navbar.vue';
import finePagina from './footer.vue';
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
    if (localStorage.getItem('token')) {
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
      console.log("ciao");
      this.cercaQuery = searchQuery;
      this.caricaAuto();
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