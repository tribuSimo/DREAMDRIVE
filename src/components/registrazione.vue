<template>
  <div>
    <v-alert v-if="errorMessage" type="error" dismissible @input="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>
    <v-img class="mx-auto my-6" src="logo.jpg" width="150px" height="150px"></v-img>

    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <v-card-title class="title">Registrazione</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="registrazione">
          <v-text-field v-model="email" label="Email" outlined required :rules="emailRules"
            prepend-inner-icon="mdi-email-outline"></v-text-field>

          <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'" @click:append-inner="toggleVisibility" @focus="visible = true"
            @blur="visible = false" label="Password" outlined required :rules="passwordRules"
            prepend-inner-icon="mdi-lock-outline">
          </v-text-field>

          <v-text-field v-model="dataNascita" label="Data di nascita" outlined required readonly
            prepend-inner-icon="mdi-calendar" @click="showDatePicker()"></v-text-field>

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

          <v-btn type="submit" block color="primary" size="large" variant="tonal">Registrati</v-btn>

          <v-card-text class="text-center">
            <router-link class="text-blue text-decoration-none" to="/login">Hai già un account? Accedi qui
              <v-icon icon="mdi-chevron-right"></v-icon>
            </router-link>
          </v-card-text>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import '../assets/style/style.css';
import moment from 'moment';
export default {
  name: 'registrazione',
  data() {
    return {
      email: '',
      password: '',
      dataNascita: null,
      visible: false,
      emailRules: [
        v => !!v || 'Il campo Email è richiesto',
        v => /.+@.+\..+/.test(v) || 'L\'indirizzo email non è valido',
      ],
      passwordRules: [
        v => !!v || 'Il campo Password è richiesto',
        v => (v && v.length >= 8) || 'La password deve contenere almeno 8 caratteri',
      ],
      datePickerDialog: false,
      dialogMaxWidth: 400,
      errorMessage: ''
    };
  },
  methods: {
    async registrazione() {
      // Implementazione del login
      try {
        const formattedDate = moment(this.dataNascita);

        if (!formattedDate.isValid())
          throw new Error('Formato data non valido');

        const formattedDateString = formattedDate.format('YYYY-MM-DD');

        const response = await fetch(`${window.dreamdrive_cfg.api}/registrazione`, {
          method: 'POST',
          body: new URLSearchParams({
            email: this.email,
            password: this.password,
            dataNascita: formattedDateString
          }).toString(),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
        if (!response.ok) {
          this.errorMessage = 'Errore durante la registrazione';
          throw new Error('Errore durante la registrazione');
        } else
          this.$router.push("/login");

      } catch (error) {
        // Gestione degli errori in caso di fallimento della richiesta
        console.error('Errore la richiesta di registrazione:', error);
        this.errorMessage = 'Errore durante la richiesta di registrazione ' + error.message;
      }
    },
    showDatePicker() {
      this.datePickerDialog = true;
    },
    updateDialogMaxWidth() {
      // Aggiorna la larghezza massima della dialog in base alla larghezza del date picker
      this.$nextTick(() => {
        const datePicker = this.$refs.datePicker.$el;
        if (datePicker) {
          this.dialogMaxWidth = datePicker.offsetWidth + 40; // Aggiungi una spaziatura di 20px su ciascun lato
        }
      });
    },
    toggleVisibility() {
      this.visible = !this.visible;
    },
  }
};
</script>