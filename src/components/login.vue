<template>
  <div>
    <v-img class="mx-auto my-6" src="logo.jpg" width="150px" height="150px"></v-img>

    <v-card class="loginCard" elevation="8" max-width="448" rounded="lg">
      <v-card-title>
        <p class="font-weight-black">Login</p>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field v-model="email" label="Email" outlined required :rules="emailRules"
            prepend-inner-icon="mdi-email-outline"></v-text-field>

          <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'" @click:append-inner="toggleVisibility" @focus="visible = true"
            @blur="visible = false" label="Password" outlined required :rules="passwordRules"
            prepend-inner-icon="mdi-lock-outline">
          </v-text-field>

          <v-btn type="submit" block color="blue" size="large" variant="tonal">Accedi</v-btn>

          <v-card-text class="text-center">
            <router-link class="text-blue text-decoration-none" to="/registrazione">Non hai un account? Registrati qui
              <v-icon icon="mdi-chevron-right"></v-icon></router-link>
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
import router from '../router.js';
export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: '',
      visible: false,
      emailRules: [
        v => !!v || 'Il campo Email è richiesto',
        v => /.+@.+\..+/.test(v) || "L'indirizzo email non è valido",
      ],
      passwordRules: [
        v => !!v || 'Il campo Password è richiesto',
        v => (v && v.length >= 8) || 'La password deve contenere almeno 8 caratteri',
      ],
      errorMessage: ''
    };
  },
  methods: {
    async login() {
      // Implementazione del login
      try {
        const response = await fetch(`${window.dreamdrive_cfg.api}/login`, {
          method: 'POST',
          body: new URLSearchParams({
            email: this.email,
            password: this.password
          }).toString(),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
        if (!response.ok) {
          this.errorMessage = 'Errore durante il login';
          throw new Error('Errore durante il login');
        }

        const token = await response.text(); // Assume che il token sia restituito come stringa dal server
        const ruolo = await this.verificaRuolo(token)
        localStorage.setItem('ruolo', ruolo.role);
        // Esempio di salvataggio del token nello storage locale
        localStorage.setItem('token', token);
        // Reindirizza solo dopo aver ottenuto correttamente il ruolo
        if (parseInt(ruolo.role) === 1)
          router.push("/home");
        else if (parseInt(ruolo.role) === 2)
          router.push("/admin/dashboard");
        else if (parseInt(ruolo.role) === 0)
          this.errorMessage = 'Errore nella verifica del ruolo';
        
      } catch (error) {
        // Gestione degli errori in caso di fallimento della richiesta
        console.error('Errore durante il login:', error);
        this.errorMessage = 'Errore durante il login' + error.message;
      }
    },

    toggleVisibility() {
      this.visible = !this.visible;
    },
    async verificaRuolo(token) {
      try {
        const response = await fetch(`${window.dreamdrive_cfg.api}/verificaRuolo`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': `${token}`
          }
        });
        if (response.ok) {
          let ruolo = await response.json(); // Attendere la risoluzione del testo della risposta
          return ruolo;
        } else
          return 0;
      } catch (error) {
        console.error('Errore durante la verifica del ruolo:', error);
        this.errorMessage = 'Errore durante la verifica del ruolo' + error.message;
      }
    }

  }
};
</script>