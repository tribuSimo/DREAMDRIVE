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
      <v-alert v-if="errorMessage" type="error" dismissible @input="errorMessage = ''">
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
      filtro: null,
      mostraUsate: false,
      marche: [],
      marcaSelezionata: null,
      idUtente: null,
      errorMessage: ''
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
        const response = await fetch(`${window.dreamdrive_cfg.api}/auto`, {
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
        this.errorMessage = 'Errore nella richiesta delle auto' + error.message;
      }
    },
    async ordinaCombo() {
      try {
        const token = localStorage.getItem('token');
        let url = `${window.dreamdrive_cfg.api}/auto`;

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
        } else {
          console.error('Errore nel caricamento delle auto ordinate:', response.statusText);
          this.errorMessage = 'Errore nel caricamento delle auto ordinate: ' + response.statusText;
        }
      } catch (error) {
        console.error('Errore nella richiesta delle auto:', error);
        this.errorMessage = 'Errore nella richiesta delle auto ordinate: ' + error.message;
      }
    },
    async visualizzaUsate() {
      try {
        if (this.mostraUsate === true) {
          const token = localStorage.getItem('token');
          let url = `${window.dreamdrive_cfg.api}/autoUsate`;
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
            console.error('Errore nel caricamento delle auto usate:', response.statusText);
            this.errorMessage = 'Errore nel caricamento delle auto usate: ' + response.statusText;
          }
        } else {
          // Se la checkbox non è selezionata, carica tutte le auto
          await this.caricaAuto();
        }
      } catch (error) {
        console.error('Errore nella richiesta delle auto usate:', error);
        this.errorMessage = 'Errore nella richiesta delle auto usate: ' + error.message;
      }
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
    },
    async ordinaMarca() {
      try {
        if (this.marcaSelezionata === 'Nessuna') {
          this.caricaAuto();
        } else {
          const token = localStorage.getItem('token');
          let url = `${window.dreamdrive_cfg.api}/autoMarca/${this.marcaSelezionata}`;

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
            console.error('Errore nel caricamento delle auto ordinate per marca:', response.statusText);
            this.errorMessage = 'Errore nel caricamento delle auto ordinate per marca: ' + response.statusText;
          }
        }
      } catch (error) {
        console.error('Errore nella richiesta del caricamento delle auto ordinate per marca:', error);
        this.errorMessage = 'Errore nella richiesta del caricamento delle auto ordinate per marca: ' + error.message;
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
  width: 23vw;
}

/* Stile personalizzato per la checkbox */
.custom-checkbox {
  margin-top: 75px;
  /* Aggiungi spazio sopra solo per la checkbox */
}
</style>