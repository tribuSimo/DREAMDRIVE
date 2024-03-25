<template>
  <v-app>
    <navbar></navbar>
    <v-container class="containerSearch">
      <v-row>
        <v-col v-for="(auto, index) in auto" :key="index" cols="12" class="text-left">
          <v-card outlined>
            <v-card-title>{{ auto.marca }} {{ auto.modello }}</v-card-title>
            <v-card-text>
              <div>Targa: {{ auto.targa }}</div>
              <div>Descrizione: {{ auto.descrizione }}</div>
              <div>Potenza: {{ auto.potenza }}</div>
              <div>Chilometraggio: {{ auto.chilometraggio }}</div>
              <div>Anno di produzione: {{ auto.annoProduzione }}</div>
              <div>Usata: {{ auto.usata ? 'Sì' : 'No' }}</div>
              <div>Prezzo: {{ auto.prezzo }}</div>
              <div>Carburante: {{ auto.carburante }}</div>
              <div>Colore: {{ auto.colore }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <finePagina></finePagina>
  </v-app>
</template>

<script>
import navbar from './navbar.vue';
import finePagina from './footer.vue';

export default {
  components: {
    navbar,
    finePagina
  },
  data() {
    return {
      auto: []
    };
  },
  created() {
    this.caricaAuto();
  },
  methods: {
    async caricaAuto() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/auto', {
          method: 'GET',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': `${token}`
          }
        });
        if (response.ok) {
          this.auto = await response.json();
          console.log('ecco le auto:', this.auto);
        } else {
          console.error('Errore nel caricamento delle auto:', response.statusText);
        }
      } catch (error) {
        console.error('Errore nel caricamento delle auto:', error);
      }
    }
  }
};
</script>

<style scoped>
.containerSearch {
  width: 75%;
  margin: 20px auto;
}

.text-left {
  text-align: left;
}
</style>
