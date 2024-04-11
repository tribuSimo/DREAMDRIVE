<template>
  <v-app>
    <navbar></navbar>
    <v-select label="Ordina" :items="['Nessuno', 'Prezzo', 'Anno produzione', 'Chilometraggio']" class="combo"
      v-model="filtro" @update:modelValue="ordinaCombo()"></v-select>

    <v-checkbox class="checkbox" label="Usata"></v-checkbox>
    <v-container class="containerSearch">
      <v-row>
        <v-col v-for="(auto, index) in auto" :key="index" cols="3" class="text-left">
          <v-card class="card" @click="visualizzaDettagli(index)" outlined>
            <v-img :width="300" aspect-ratio="16/9" cover
              src="../../public/toyotaCorolla1.jpg"></v-img>
            <v-card-title>{{ auto.marca }} {{ auto.modello }}</v-card-title>
            <v-card-text>
              <div>Potenza: {{ auto.potenza }} cv</div>
              <div>Chilometraggio: {{ auto.chilometraggio }} km</div>
              <div>Anno di produzione: {{ auto.annoProduzione }}</div>
              <div>Usata: {{ auto.usata ? 'Sì' : 'No' }}</div>
              <div>Prezzo: {{ auto.prezzo }} €</div>
              <div>Carburante: {{ auto.carburante }}</div>

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
    };
  },
  created() {
    if (localStorage.getItem('token'))
      this.caricaAuto();
    else
      router.push('/login');
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
    },
    async ordinaCombo() {
      try {
        const token = localStorage.getItem('token');
        let url = 'http://localhost:3000/api/auto';

        if (this.filtro !== "Nessuno" && this.filtro !== "") {
          url += '?sortBy=' + encodeURIComponent(this.filtro);
        }

        console.log(url);

        // if (this.filtro === "Prezzo") {
        //   url += '?sortBy=prezzo'; // Aggiungi il parametro per l'ordinamento per prezzo
        // } else if (this.filtro === "Chilometraggio") {
        //   url += '?sortBy=chilometraggio'; // Aggiungi il parametro per l'ordinamento per chilometraggio
        // }else{
        //   url += '?sortBy=annoProduzione';
        // }

        const response = await fetch(url, {
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
    },
    visualizzaDettagli(index) {
      const idAuto = this.auto[index].idAuto; // Ottieni l'id dell'auto selezionata utilizzando l'indice
      console.log(idAuto);
      this.$router.push({ name: 'Dettagli auto', params: { idAuto: idAuto } });
    }
  }
};
</script>

<style scoped>
.containerSearch {
  width: 75%;
  margin: 20px auto;
}

.nav_Drawer {
  margin-top: 0px;

}

.card {
  margin-left: 50px;
  transition: transform 1s ease, border-color 0.7s ease;
}

.card:hover {
  transform: scale(1.1);
  border-color: #888;

}

.text-left {
  text-align: left;
}

.search {
  margin-top: 100px;
}

.combo {
  margin-top: 79px;
  width: 300px;
  margin-left: 225px;
}

.checkbox {
  margin-left: 225px;
  height: 60px;
}
</style>
