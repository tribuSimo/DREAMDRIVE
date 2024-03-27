<template>
  <v-app>
    <navbar></navbar>
   
      <v-navigation-drawer :width="200" class="nav_Drawer">
            <v-list-item title="Ricerca Auto" subtitle=""></v-list-item>
            <v-divider></v-divider>
            <v-list-item link title="Marca"></v-list-item>
            
            <v-list-item link title="Modello"></v-list-item>
            <v-list-item link title="Prezzo">
              <v-card >
                  <v-card-text>
                    <v-range-slider style="margin-top:30px ;" v-model="valuePrice" step="10" thumb-label="always"></v-range-slider> 
                  </v-card-text>
                </v-card>
            </v-list-item>
            <v-list-item link title="Carburante"></v-list-item>
            <v-list-item link title="Chilometraggio">
                <v-card >
                  <v-card-text>
                    <v-range-slider style="margin-top:30px ;" v-model="value" step="10" thumb-label="always"></v-range-slider> 
                  </v-card-text>
                </v-card>
            </v-list-item>
            <v-list-item link title="Usata">
              <v-checkbox style="margin-left:50px ;" label="SI"></v-checkbox>
            </v-list-item>
        <div class="text-center">
          <v-btn>Cerca</v-btn>
        </div>
      </v-navigation-drawer>
   
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
      auto: [],
      valuePrice:[20,100],
      value: [20, 100],
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
.nav_Drawer{
  margin-top: 65px;

}
.text-left {
  text-align: left;
}

.search{
 margin-top: 100px;
}
</style>
