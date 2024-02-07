<template>
    <div class="container">
    <v-card class="login-card" elevation="4">
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="email"
            label="Email"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            outlined
            required
            type="password"
          ></v-text-field>
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
    login() {
      // Implementazione del login
      console.log('Email:', this.email);
      console.log('Password:', this.password);
    }
  }
};
</script>