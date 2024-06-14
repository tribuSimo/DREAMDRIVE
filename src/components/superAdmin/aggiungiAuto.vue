<template>
    <v-app>
       <navbar></navbar>
  <v-container>
    <div class="container">
        <v-form ref="form" v-model="valid">
      <v-text-field class="txtAuto"
        v-model="auto.marca"
        :rules="[v => !!v || 'Marca è obbligatoria']"
        label="Marca"
        required
      ></v-text-field>

      <v-text-field class="txtAuto"
        v-model="auto.modello"
        :rules="[v => !!v || 'Modello è obbligatorio']"
        label="Modello"
        required
      ></v-text-field>

      <v-file-input class="txtAuto"
        v-model="auto.immagine"
        :rules="[v => !!v || 'Immagine è obbligatoria']"
        label="Immagine"
        accept="image/*"
        required
      ></v-file-input>

      <v-text-field class="txtAuto"
        v-model="auto.chilometri"
        :rules="[v => !!v || 'Chilometri è obbligatorio']"
        label="Chilometri"
        type="number"
        required
      ></v-text-field>

      <v-text-field class="txtAuto"
        v-model="auto.annoUscita"
        :rules="[v => !!v || 'Anno di Uscita è obbligatorio']"
        label="Anno di Uscita"
        type="number"
        :min="1886"
        :max="new Date().getFullYear()"
        required
      ></v-text-field>

      <v-select class="txtAuto"
        v-model="auto.carburante"
        :items="carburanti"
        :rules="[v => !!v || 'Carburante è obbligatorio']"
        label="Carburante"
        required
      ></v-select>

      <v-text-field class="txtAuto"
        v-model="auto.potenza"
        :rules="[v => !!v || 'Potenza è obbligatoria']"
        label="Potenza (in CV)"
        type="number"
        required
      ></v-text-field>

      <v-btn :disabled="!valid" color="success" @click="submitForm">
        Invia
      </v-btn>
    </v-form>
    </div>
    
  </v-container>
  <finePagina></finePagina>
 </v-app>
</template>

<script>

import navbar from './navbar.vue';
import finePagina from '../footer.vue'
export default {
    components: {
    navbar,
    finePagina
  },
  data() {
    return {
      valid: false,
     
      auto: {
        marca: '',
        modello: '',
        immagine: null,
        chilometri: '',
        annoUscita: '',
        carburante: '',
        carburanti: ['Benzina', 'Diesel', 'Elettrico', 'Ibrido', 'GPL', 'Metano'],
        potenza: ''
      }
    };
  },
  methods: {
    submitForm() {
      if (this.$refs.form.validate()) {
        alert('Form inviato con successo!');
        // Qui puoi aggiungere la logica per inviare i dati al server
      }
    }
  }
};
</script>

<style scoped>
.v-container {
  max-width: 600px;
  margin: 0 auto;
  padding-top: 50px;
}

.txtAuto{
    width:40vw;
    padding-top: 1vh;
}

.container{
    padding-top: 10px;
    margin: 15px auto;
    padding-bottom: 2vh;
}

</style>