<template>
  <div class="containerRegistrati">
    <v-card class="registrazione-card" elevation="4">
      <v-card-title class="title">Registrazione</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="registrazione">
          <v-text-field v-model="email" label="Email" outlined required></v-text-field>
          <v-text-field v-model="password" label="Password" outlined required type="password"></v-text-field>
          <v-date-picker
            v-model="dataNascita"
            label="Data di nascita"
            required
          ></v-date-picker>
          <v-btn type="submit" color="primary" class="register-btn">Registrati</v-btn>
          <router-link to="/login">Hai già un account? Accedi qui</router-link>
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
        dataNascita: null
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