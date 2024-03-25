<template>
  <v-app>
    <navbar></navbar>
    <v-container class="containerSearch">
      <v-col v-for="(auto, index) in auto" :key="index" cols="12" class="text-left">
        <v-card outlined>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-label>Modello: {{ auto.modello }}</v-label>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-label>Prezzo: {{ auto.prezzo }}</v-label>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-label>Anno di produzione: {{ auto.annoProduzione }}</v-label>
              </v-col>
            </v-row>
            <!-- Aggiungi qui altre informazioni sull'auto -->
          </v-container>
        </v-card>
      </v-col>
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
      selectedItem: null,
      items: ['Elemento 1', 'Elemento 2', 'Elemento 3', 'Elemento 4', 'Elemento 5'],
      auto: null,
    };
  },
  created() {
    this.caricaAuto();
  },
  methods: {
    async caricaAuto() {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:3000/api/auto', {
          method: 'GET',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': `${token}`
          }
        });
        if (response.ok) {
          this.auto = await response.text();
          console.log('Ecco le auto: ', this.auto);
        } else
          console.error('Errore nel caricamento delle auto:', response.statusText);

      } catch (error) {
        console.error('Errore nel caricamento delle auto:', error);
      }
    }
  }
};
</script>

<style scoped>
.containerSearch {
  width: 25%;
  height: 800px;
  margin-left: 0px;
  margin-top: 80px;
  border-right: #333;
  float: right;
}

.containerMain {
  width: 75%;
  float: left;
  margin-top: 0px;
  margin-left: 0px;
  position: absolute;

}
</style>
