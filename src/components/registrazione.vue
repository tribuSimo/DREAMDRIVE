<template>
  <div>
    <v-img class="mx-auto my-6"
      src="logo.jpg" width="150px" height="150px"></v-img>

    <v-card class="mx-auto card" elevation="8" rounded="lg">
      <v-card-title class="title">
        <p class="font-weight-black">Registrazione</p>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="registrazione">
          <v-text-field v-model="email" label="Email" outlined required :rules="emailRules"
            prepend-inner-icon="mdi-email-outline"></v-text-field>

          <v-text-field v-model="password" label="Password" outlined required type="password" :rules="passwordRules"
            prepend-inner-icon="mdi-lock-outline"></v-text-field>

          <v-date-picker v-model="dataNascita" label="Data di nascita" outlined required elevation="4" class="my-6" width="340px"></v-date-picker>

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
        emailRules: [
          v => !!v || 'Il campo Email è richiesto',
          v => /.+@.+\..+/.test(v) || 'L\'indirizzo email non è valido',
        ],
        passwordRules: [
          v => !!v || 'Il campo Password è richiesto',
          v => (v && v.length >= 8) || 'La password deve contenere almeno 8 caratteri',
        ],
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
  
          const response = await fetch('http://localhost:3000/api/registrazione', {
            method: 'POST',
            body: new URLSearchParams({
              email: this.email,
              password: this.password,
              dataNascita: formattedDateString
            }).toString(),
            headers: {
              "Content-Type":"application/x-www-form-urlencoded"
            }
          });
          console.log(response);
          if (!response.ok) {
            throw new Error('Errore durante la registrazione');
          }else
            this.$router.push("/login");
  
        } catch (error) {
          // Gestione degli errori in caso di fallimento della richiesta
          console.error('Errore durante il login:', error);
        }
      },
    }
  };
  </script>