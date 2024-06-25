<template>
  <v-app>
    <navbar></navbar>
    <v-container>
      <v-form ref="form" v-model="valid">
        <v-text-field class="txtMarca" v-model="marca" :rules="[v => !!v || 'Marca è obbligatoria']" label="Marca"
          required></v-text-field>

        <v-text-field class="txtAuto" v-model="modello" :rules="[v => !!v || 'Modello è obbligatorio']" label="Modello"
          required></v-text-field>

        <v-text-field class="txtAuto" v-model="chilometri" :rules="[v => !!v || 'Chilometri è obbligatorio']"
          label="Chilometri" type="number" required></v-text-field>

        <v-text-field class="txtAuto" v-model="annoUscita" :rules="[v => !!v || 'Anno di Uscita è obbligatorio']"
          label="Anno di Uscita" type="number" :min="1886" :max="new Date().getFullYear()" required></v-text-field>

        <v-select v-model="carburante" item-title="carburante" :items="carburanti" item-text="carburante"
          item-value="idCarburante" label="Carburante" required :rules="[v => !!v || 'Carburante è obbligatorio']">
        </v-select>

        <v-text-field class="txtAuto" v-model="potenza" :rules="[v => !!v || 'Potenza è obbligatoria']"
          label="Potenza (in CV)" type="number" required></v-text-field>

        <v-text-field class="txtAuto" v-model="targa" :rules="[v => !!v || 'Targa è obbligatoria']" label="Targa"
          type="text" required></v-text-field>

        <v-text-field class="txtAuto" v-model="descrizione" :rules="[v => !!v || 'Descrizione è obbligatoria']"
          label="Descrizione" type="text" required></v-text-field>

        
        <v-select v-model="cambio" :items="cambi" item-text="cambio"
          label="Cambio" required :rules="[v => !!v || 'Cambio è obbligatorio']">
        </v-select>

        <v-text-field class="txtAuto" v-model="peso" :rules="[v => !!v || 'Peso è obbligatorio']" label="Peso"
          type="number" required></v-text-field>

        <v-text-field class="txtAuto" v-model="prezzo" :rules="[v => !!v || 'Prezzo è obbligatorio']" label="Prezzo"
          type="number" required>€</v-text-field>

        <v-text-field class="txtAuto" v-model="colore" :rules="[v => !!v || 'Colore è obbligatorio']" label="Colore"
          type="text" required></v-text-field>

        <v-checkbox class="custom-checkbox" v-model="usata" label="Usata"></v-checkbox>
        <v-btn :disabled="!valid" color="success" @click="submitForm">Invia</v-btn>
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
      cambi: ['Automatico', 'Manuale'],
      marca: '',
      modello: '',
      immagine: null,
      chilometri: '',
      annoUscita: '',
      carburante: null,
      potenza: '',
      targa: '',
      descrizione: '',
      cambio: '',
      peso: 0,
      prezzo: 0,
      usata: false,
      colore: '',
      errorMessage: ''
    };
  },
  created() {
    if (localStorage.getItem('token') && localStorage.getItem('ruolo') && localStorage.getItem('ruolo') >= 3) {
      this.visualizzaCarburanti();
      console.log(this.usata);
    } else {
      router.push('/login');
    }
  },
  methods: {
    async submitForm() {
      try {
        if (this.$refs.form.validate()) {
          const token = localStorage.getItem('token');

          let response = await fetch(`${window.dreamdrive_cfg.api}/marche/${this.marca}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `${token}`
            }
          });
          let marca = await response.json();

          if (marca === 'Marca non trovata') {
            response = await fetch(`${window.dreamdrive_cfg.api}/inserisciMarca`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `${token}`
              },
              body: new URLSearchParams({ marca: this.marca }).toString()
            });
            marca = await response.json();
          }
          console.log("diocane!: ", marca);
          response = await fetch(`${window.dreamdrive_cfg.api}/modelli/${this.modello}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `${token}`
            }
          });
          let modello = await response.json();

          if (modello === 'Modello non trovato') {
            response = await fetch(`${window.dreamdrive_cfg.api}/inserisciModello`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `${token}`
              },
              body: new URLSearchParams({ modello: this.modello, idMarca: marca.idMarca }).toString()
            });
            modello = await response.json();
          }

          response = await fetch(`${window.dreamdrive_cfg.api}/colori/${this.colore}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `${token}`
            }
          });

          let colore = await response.json();
          if (colore === 'Colore non trovato') {
            response = await fetch(`${window.dreamdrive_cfg.api}/inserisciColore`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `${token}`
              },
              body: new URLSearchParams({ colore: this.colore }).toString()
            });
            colore = await response.json();
          }

          const formData = new URLSearchParams({
            targa: this.targa,
            descrizione: this.descrizione,
            potenza: this.potenza,
            chilometraggio: this.chilometri,
            annoProduzione: this.annoUscita,
            cambio: this.cambio,
            peso: this.peso,
            usata: this.usata ? 1 : 0,
            prezzo: this.prezzo,
            idMarca: marca.idMarca,
            idModello: modello.idModello,
            idColore: colore.idColore,
            idCarburante: this.carburante
          });

          response = await fetch(`${window.dreamdrive_cfg.api}/inserisciAuto`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `${token}`
            },
            body: formData.toString()
          });

          if (response.ok) {
            alert('Form inviato con successo!');
          } else {
            console.error('Errore nell\'inserimento dell\'auto:', response.statusText);
            this.errorMessage = 'Errore nell\'inserimento dell\'auto: ' + response.statusText;
          }
        }
      } catch (error) {
        console.error(`Errore nell'inserimento dell'auto:`, error);
        this.errorMessage = `Errore nell'inserimento dell'auto: ` + error.message;
      }
    },
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
          console.log(carburanti);
          this.carburanti = carburanti;
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