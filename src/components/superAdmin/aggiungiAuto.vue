<template>
  <v-app>
    <navbar></navbar>
    <v-container>
      <v-form ref="form" v-model="valid">
        <v-text-field class="txtMarca" v-model="auto.marca" :rules="[v => !!v || 'Marca è obbligatoria']" label="Marca"
          required></v-text-field>

        <v-text-field class="txtAuto" v-model="auto.modello" :rules="[v => !!v || 'Modello è obbligatorio']"
          label="Modello" required></v-text-field>

        <v-text-field class="txtAuto" v-model="auto.chilometri" :rules="[v => !!v || 'Chilometri è obbligatorio']"
          label="Chilometri" type="number" required></v-text-field>

        <v-text-field class="txtAuto" v-model="auto.annoUscita" :rules="[v => !!v || 'Anno di Uscita è obbligatorio']"
          label="Anno di Uscita" type="number" :min="1886" :max="new Date().getFullYear()" required></v-text-field>

        <v-select class="txtAuto" v-model="auto.carburante" :items="carburanti"
          :rules="[v => !!v || 'Carburante è obbligatorio']" label="Carburante" required></v-select>

        <v-text-field class="txtAuto" v-model="auto.potenza" :rules="[v => !!v || 'Potenza è obbligatoria']"
          label="Potenza (in CV)" type="number" required></v-text-field>

        <v-text-field class="txtAuto" v-model="auto.targa" :rules="[v => !!v || 'Targa è obbligatoria']" label="Targa"
          type="text" required></v-text-field>

        <v-text-field class="txtAuto" v-model="auto.descrizione" :rules="[v => !!v || 'Descrizione è obbligatoria']"
          label="Descrizione" type="text" required></v-text-field>

        <v-text-field class="txtAuto" v-model="auto.cambio" :rules="[v => !!v || 'Cambio è obbligatorio']"
          label="Cambio" type="text" required></v-text-field>

        <v-text-field class="txtAuto" v-model="auto.peso" :rules="[v => !!v || 'Peso è obbligatorio']" label="Peso"
          type="number" required></v-text-field>

        <v-text-field class="txtAuto" v-model="auto.prezzo" :rules="[v => !!v || 'Prezzo è obbligatorio']"
          label="Prezzo" type="number" required>€</v-text-field>

        <v-text-field class="txtAuto" v-model="auto.colore" :rules="[v => !!v || 'Colore è obbligatorio']"
          label="Colore" type="text" required></v-text-field>

        <v-checkbox class="custom-checkbox" v-model="auto.usata" label="Usata"></v-checkbox>

        <v-btn :disabled="!valid" color="success" @click="submitForm">
          Invia
        </v-btn>
      </v-form>
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
      valid: false,
      carburanti: [],
      auto: {
        marca: '',
        modello: '',
        immagine: null,
        chilometri: '',
        annoUscita: '',
        carburante: '',
        potenza: '',
        targa: '',
        descrizione: '',
        cambio: '',
        peso: 0,
        prezzo: 0,
        usata: false,
        colore: ''
      },
      errorMessage: ''
    };
  },
  created() {
    if (localStorage.getItem('token') && localStorage.getItem('ruolo') && localStorage.getItem('ruolo') >= 1) {
      this.visualizzaCarburanti();
    } else {
      router.push('/login');
    }
  },
  methods: {
    async submitForm() {
      try {
        if (this.$refs.form.validate()) {
          const token = localStorage.getItem('token');
          const aus = this.auto.marca;
          const aus1 = this.auto.modello;
          const aus2 = this.auto.colore;
          // Step 1: Check if the brand (marca) exists
          let response = await fetch(`${window.dreamdrive_cfg.api}/marche/${this.auto.marca}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': token
            }
          });
          let marca = await response.json();
          // Step 2: If brand does not exist, add it
          if (marca === 'Marca non trovata') {
            response = await fetch(`${window.dreamdrive_cfg.api}/inserisciMarca`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token
              },
              body: JSON.stringify({ marca: aus })
            });
            marca = await response.json();
          }

          // Step 3: Check if the model (modello) exists
          response = await fetch(`${window.dreamdrive_cfg.api}/modelli/${this.auto.modello}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': token
            }
          });
          let modello = await response.json();

          // Step 4: If model does not exist, add it
          if (modello === 'Modello non trovato') {
            response = await fetch(`${window.dreamdrive_cfg.api}/inserisciModello`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token
              },
              body: JSON.stringify({ modello: aus1, idMarca: marca.idMarca })
            });
            modello = await response.json();
          }

          response = await fetch(`${window.dreamdrive_cfg.api}/colori/${this.auto.colore}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': token
            }
          });
          let colore = await response.json();
          if (colore === 'Colore non trovato') {
            response = await fetch(`${window.dreamdrive_cfg.api}/inserisciModello`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token
              },
              body: JSON.stringify({ colore: aus2 })
            });
            colore = await response.json();
          }
          // Step 5: Prepare form data for car insertion
          const formData = new FormData();
          formData.append('targa', this.auto.targa);
          formData.append('descrizione', this.auto.descrizione);
          formData.append('potenza', this.auto.potenza);
          formData.append('chilometraggio', this.auto.chilometri);
          formData.append('annoProduzione', this.auto.annoUscita);
          formData.append('cambio', this.auto.cambio);
          formData.append('peso', this.auto.peso);
          formData.append('usata', this.auto.usata);
          formData.append('prezzo', this.auto.prezzo);
          formData.append('idMarca', marca.idMarca);
          formData.append('idModello', modello.idModello);
          formData.append('idColore', colore.idColore);
          formData.append('idCarburante', this.auto.carburante);
          
          // Step 6: Send car insertion request to backend
          response = await fetch(`${window.dreamdrive_cfg.api}/inserisciAuto`, {
            method: 'POST',
            headers: {
              'Authorization': token
            },
            body: formData
          });

          // Step 7: Handle response from backend
          if (response.ok) {
            alert('Form inviato con successo!');
            // Clear form fields or do any additional handling
          } else {
            console.error('Errore nell\'inserimento dell\'auto:', response.statusText);
            this.errorMessage = 'Errore nell\'inserimento dell\'auto: ' + response.statusText;
          }
        }
      } catch (error) {
        console.error(`Errore nell'inserimento dell'auto:`, error);
        this.errorMessage = `Errore nell'inserimento dell'auto: ` + error.message;
      }
    }
    ,
    async visualizzaCarburanti() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${window.dreamdrive_cfg.api}/carburanti`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': `${token}`
          }
        });
        if (response.ok) {
          const carburanti = await response.json();
          this.carburanti = carburanti.map(carburante => carburante.carburante);
          console.log(this.carburanti);
        } else {
          console.error('Errore nel caricamento dei carburanti:', response.statusText);
          this.errorMessage = 'Errore nel caricamento dei carburanti: ' + response.statusText;
        }
      } catch (error) {
        console.error('Errore nel caricamento dei carburanti:', error);
        this.errorMessage = 'Errore nella richiesta dei carburanti: ' + error.message;
      }
    }
  }
};
</script>

<style scoped>
.v-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.txtAuto {
  margin-top: 2vh;
  width: 35vw;
}

.txtMarca {
  margin-top: 10vh;
  width: 35vw;
}
</style>