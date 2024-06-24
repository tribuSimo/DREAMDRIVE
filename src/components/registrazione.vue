<template>
  <div>
    <v-img class="mx-auto my-6" src="logo.jpg" width="150px" height="150px"></v-img>

    <v-card class="registrazione-card" elevation="8" max-width="448" rounded="lg">
      <v-card-title class="titolo"><strong>Registrati</strong></v-card-title>

      <v-card-text>
        <v-form @submit.prevent="registrazione">
          <v-text-field v-model="email" label="Email" outlined required :rules="emailRules"
            prepend-inner-icon="mdi-email-outline"></v-text-field>

          <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'" @click:append-inner="toggleVisibility" @focus="visible = true"
            @blur="visible = false" label="Password" outlined required :rules="passwordRules"
            prepend-inner-icon="mdi-lock-outline">
          </v-text-field>

          <v-text-field v-model="formattedDateNascita" label="Data di nascita" outlined required readonly
            prepend-inner-icon="mdi-calendar" @click="showDatePicker()"></v-text-field>

          <v-dialog v-model="datePickerDialog" :max-width="dialogMaxWidth">
            <v-card>
              <v-card-title class="headline primary--text">Seleziona una data</v-card-title>
              <v-card-text>
                <v-date-picker v-model="dataNascita" :max="maxDate" no-title scrollable @input="updateDialogMaxWidth"
                  @change="formatDateNascita"></v-date-picker>
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
        <v-alert title="Errore" v-if="errorMessage" color="error" closable>
          {{ errorMessage }}
        </v-alert>
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
      errorMessage: '',
      maxDate: moment().format('YYYY-MM-DD')
    };
  },
  computed: {
    formattedDateNascita() {
      return this.dataNascita ? moment(this.dataNascita).format('DD-MM-YYYY') : '';
    }
  },
  methods: {
    async registrazione() {
      try {
        const formattedDate = moment(this.dataNascita);

        if (!formattedDate.isValid()) {
          this.errorMessage = 'Formato data non valido';
          throw new Error('Formato data non valido');
        }
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
        } else {
          this.$router.push("/login");
        }

      } catch (error) {
        console.error('Errore la richiesta di registrazione: ', error);
        this.errorMessage = 'Errore durante la richiesta di registrazione: ' + error.message;
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
    },
    toggleVisibility() {
      this.visible = !this.visible;
    },
    formatDateNascita() {
      this.dataNascita = moment(this.dataNascita).format('YYYY-MM-DD');
      this.datePickerDialog = false;
    }
  }
};
</script>