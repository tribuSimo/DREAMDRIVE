<template>
  <v-app>
    <navbar></navbar>
    <v-container class="containerSearch">
      <v-row v-if="auto.length > 0">
        <v-col cols="12" sm="6" md="4" v-for="(auto, index) in auto" :key="index">
          <v-card class="card" @click="visualizzaDettagli(index)" outlined>
            <v-img :src="auto.immagini && auto.immagini.length > 0 ? auto.immagini.split(',')[0] : 'workInProgress.jpg'"
              aspect-ratio="16/9" cover></v-img>
            <v-card-title>{{ auto.marca }} {{ auto.modello }}</v-card-title>
            <v-card-text>
              <div>Potenza: {{ auto.potenza }} cv</div>
              <div>Chilometraggio: {{ auto.chilometraggio }} km</div>
              <div>Anno di produzione: {{ auto.annoProduzione }}</div>
              <div>Usata: {{ auto.usata && auto.usata.data[0] === 1 ? 'Sì' : 'No' }}</div>
              <div>Prezzo: {{ auto.prezzo }} €</div>
              <div>Carburante: {{ auto.carburante }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="12">
          <p class="no-new-release">Nessuna nuova uscita</p>
        </v-col>
      </v-row>
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
      filtro: null,
      mostraUsate: false,
      marche: [],
      marcaSelezionata: null,
      idUtente: null
    };
  },
  created() {
    if (localStorage.getItem('token')) {
      this.caricaAuto();
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
  methods: {
    async caricaAuto() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/nuoveAuto', {
          method: 'GET',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': `${token}`
          }
        });
        if (response.ok) {
          this.auto = await response.json();
          console.log(this.auto);
        } else {
          console.error('Errore nel caricamento delle auto:', response.statusText);
        }
      } catch (error) {
        console.error('Errore nel caricamento delle auto:', error);
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
  width: 75%;
  margin: 20px auto;
  margin-top: 80px;
}

.no-new-release {
  font-size: 24px;
  font-family: 'Roboto', sans-serif;
  color: #555;
  text-align: center;
  padding-bottom: 800px;
}

.nav_Drawer {
  margin-top: 0px;
}

.card {
  background-color: #f0f4f8;
  color: #000000;
  border: 2px solid #d1d8e0;
  margin-left: 50px;
  margin-bottom: 10px;
  transition: transform 1s ease, border-color 0.7s ease, background-color 0.7s ease, color 0.7s ease;
}

.card:hover {
  transform: scale(1.1);
  background-color: #f0f0f0;
  border-color: #b0b0b0;
}

.text-left {
  text-align: left;
}

.search {
  margin-top: 100px;
}

.custom-select {
  margin-top: 73px;
  width: 100%;
}

/* Stile personalizzato per la checkbox */
.custom-checkbox {
  margin-top: 75px;
  /* Aggiungi spazio sopra solo per la checkbox */
}
</style>