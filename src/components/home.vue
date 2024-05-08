<template>
  <v-app>
    <navbar></navbar>
    <v-container class="containerSearch">
      <v-row>
        <v-col cols="4"> <!-- Utilizzo la metà della larghezza disponibile per ciascun elemento -->
          <!-- Stile personalizzato per la select -->
          <v-select label="Ordina" :items="['Nessuno', 'Prezzo', 'Anno produzione', 'Chilometraggio']"
            class="custom-select" v-model="filtro" @update:modelValue="ordinaCombo()">
          </v-select>
        </v-col>

        <v-col cols="4">
          <!-- Stile personalizzato per la select -->
          <v-select label="Marca" class="custom-select" :items="marche" v-model="marcaSelezionata"
            @update:modelValue="ordinaMarca()"></v-select>
        </v-col>
        <v-col cols="4">
          <!-- Stile personalizzato per la checkbox -->
          <v-checkbox class="custom-checkbox" v-model="mostraUsate" label="Usata"></v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="(auto, index) in auto" :key="index">
          <v-card class="gold-card" @click="visualizzaDettagli(index)" outlined>
            <v-img :src="auto.immagini && auto.immagini.length > 0 ? auto.immagini.split(',')[0] : 'workInProgress.jpg'" aspect-ratio="16/9" cover></v-img>
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
    async visualizzaUsate() {
      try {
        if (this.mostraUsate === true) {
          const token = localStorage.getItem('token');
          let url = 'http://localhost:3000/api/autoUsate';
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              'Authorization': `${token}`
            }
          });

          if (response.ok) {
            this.auto = await response.json();
            console.log('Ecco le auto usate:', this.auto);
          } else {
            console.error('Errore nel caricamento delle auto usate:', response.statusText);
          }
        } else {
          // Se la checkbox non è selezionata, carica tutte le auto
          await this.caricaAuto();
        }
      } catch (error) {
        console.error('Errore nel caricamento delle auto:', error);
      }
    },
    async visualizzaMarche() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/marche', {
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
          console.log('ecco le marche:', this.marche);
        } else {
          console.error('Errore nel caricamento delle marche:', response.statusText);
        }
      } catch (error) {
        console.error('Errore nel caricamento delle marche:', error);
      }
    },
    visualizzaDettagli(index) {
      const idAuto = this.auto[index].idAuto;
      this.$router.push({ name: 'Dettagli auto', params: { idAuto: idAuto } });
    },
    async ordinaMarca() {
      try {
        if (this.marcaSelezionata === 'Nessuna') {
          this.caricaAuto();
        } else {
          const token = localStorage.getItem('token');
          let url = `http://localhost:3000/api/autoMarca/${this.marcaSelezionata}`;

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

.nav_Drawer {
  margin-top: 0px;
}

.gold-card {
  background-color: #ffd700; /* Oro */
  margin-left: 50px;
  transition: transform 1s ease, border-color 0.7s ease;
}

.gold-card:hover {
  transform: scale(1.1);
  border-color: #888;
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