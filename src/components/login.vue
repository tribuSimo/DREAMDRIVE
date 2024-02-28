<template>
  <div>
    <v-img class="mx-auto my-6"
      src="logo.jpg" width="150px" height="150px"></v-img>

    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <v-card-title class="title">Benvenuto!</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field v-model="email" label="Email" outlined required :rules="emailRules"
            prepend-inner-icon="mdi-email-outline"></v-text-field>

          <v-text-field v-model="password" label="Password" outlined required type="password" :rules="passwordRules"
            prepend-inner-icon="mdi-lock-outline"></v-text-field>

          <v-btn type="submit" block color="blue" size="large" variant="tonal">Accedi</v-btn>

          <v-card-text class="text-center">
            <router-link class="text-blue text-decoration-none" to="/registrazione">Non hai un account? Registrati qui
              <v-icon icon="mdi-chevron-right"></v-icon></router-link>
          </v-card-text>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import router from '../router.js';
export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: '',
      emailRules: [
        v => !!v || 'Il campo Email è richiesto',
        v => /.+@.+\..+/.test(v) || "L'indirizzo email non è valido",
      ],
      passwordRules: [
        v => !!v || 'Il campo Password è richiesto',
        v => (v && v.length >= 8) || 'La password deve contenere almeno 8 caratteri',
      ],
    };
  },
  methods: {
    async login() {
      // Implementazione del login
      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          body: new URLSearchParams({
            email: this.email,
            password: this.password
          }).toString(),
          headers: {
            "Content-Type":"application/x-www-form-urlencoded"
          }
        });
        console.log(response);
        if (!response.ok) {
          throw new Error('Errore durante il login');
        }

        const token = await response.text(); // Assume che il token sia restituito come stringa dal server
        console.log(token);
        // Esempio di salvataggio del token nello storage locale
        localStorage.setItem('token', token);

        router.push("/dajeroma");
        //*IMPORTANTE* Devo reindirizzare il cliente con -> this.$router.push('/paginaCliente');
      } catch (error) {
        // Gestione degli errori in caso di fallimento della richiesta
        console.error('Errore durante il login:', error);
      }
    }
  }
};
</script>