<template>
  <div class="container">
    <v-card class="login-card" elevation="4">
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field v-model="email" label="Email" outlined required></v-text-field>
          <v-text-field v-model="password" label="Password" outlined required type="password"></v-text-field>
          <v-btn type="submit" color="primary">Login</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import '../assets/style/style.css';
export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      // Implementazione del login
      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          body: {
            email: this.email,
            password: this.password
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

        //*IMPORTANTE* Devo reindirizzare il cliente con -> this.$router.push('/paginaCliente');
      } catch (error) {
        // Gestione degli errori in caso di fallimento della richiesta
        console.error('Errore durante il login:', error);
      }
    }
  }
};
</script>