<template>
    <v-app>
      <navbar></navbar>
      <v-container>
        <v-form @submit.prevent="submitForm" v-model="valid">
          <v-text-field class="txtUtente" v-model="email" :rules="emailRules" label="Email" required></v-text-field>
  
          <v-text-field class="txtUtente" v-model="password" :rules="[v => !!v || 'Password obbligatoria']" label="Password" required readonly></v-text-field>
  
          <v-text-field v-model="dataNascita" label="Data di nascita" outlined required readonly prepend-inner-icon="mdi-calendar" @click="showDatePicker"></v-text-field>
  
          <v-dialog v-model="datePickerDialog" :max-width="dialogMaxWidth">
            <v-card>
              <v-card-title class="headline primary--text">Seleziona una data</v-card-title>
              <v-card-text>
                <v-date-picker v-model="dataNascita" no-title scrollable @input="updateDialogMaxWidth"></v-date-picker>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="primary" @click="datePickerDialog = false">Chiudi</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
  
          <v-btn :disabled="!valid" color="success" type="submit">
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
  import moment from 'moment';
  
  export default {
    components: {
      navbar,
      finePagina
    },
    data() {
      return {
        email: '',
        password: 'admin',
        dataNascita: null,
        emailRules: [
          v => !!v || 'Il campo Email è richiesto',
          v => /.+@.+\..+/.test(v) || "L'indirizzo email non è valido",
        ],
        datePickerDialog: false,
        dialogMaxWidth: 400,
        errorMessage: '',
        valid: true
      };
    },
    methods: {
      async submitForm() {
        try {
          const token = localStorage.getItem('token');
          const formattedDate = moment(this.dataNascita);
  
          if (!formattedDate.isValid()) {
            this.errorMessage = 'Formato data non valido';
            throw new Error('Formato data non valido');
          }
          const formattedDateString = formattedDate.format('YYYY-MM-DD');
  
          const response = await fetch(`${window.dreamdrive_cfg.api}/nuovoAdmin`, {
            method: 'POST',
            body: new URLSearchParams({
              email: this.email,
              password: this.password,
              dataNascita: formattedDateString,
            }).toString(),
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              'Authorization': `${token}`
            }
          });
  
          if (!response.ok) {
            const errorText = await response.text();
            this.errorMessage = errorText || 'Errore durante la registrazione dell\' admin';
            throw new Error(this.errorMessage);
          } else {
            this.$router.push("/login");
          }
        } catch (error) {
          console.error(`Errore durante la registrazione dell' admin`, error);
          this.errorMessage = `Errore durante la registrazione dell' admin: ${error.message}`;
        }
      },
      showDatePicker() {
        this.datePickerDialog = true;
      },
      updateDialogMaxWidth() {
        this.$nextTick(() => {
          const datePicker = this.$refs.datePicker.$el;
          if (datePicker) {
            this.dialogMaxWidth = datePicker.offsetWidth + 40;
          }
        });
      }
    }
  }
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
  
  .txtUtente {
    margin-top: 2vh;
    width: 35vw;
  }
  </style>
  