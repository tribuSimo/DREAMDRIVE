<template>
    <v-app>
        <navbar></navbar>
        <v-container>
            <v-row v-if="auto.length > 0">
                <v-col cols="12">
                    <v-card outlined>
                        <v-card-title>{{ auto[0].marca }} {{ auto[0].modello }}</v-card-title>
                        <v-card-text>
                            <div>Potenza: {{ auto[0].potenza }} cv</div>
                            <div>Chilometraggio: {{ auto[0].chilometraggio }} km</div>
                            <div>Anno di produzione: {{ auto[0].annoProduzione }}</div>
                            <div>Usata: {{ auto[0].usata ? 'Sì' : 'No' }}</div>
                            <div>Prezzo: {{ auto[0].prezzo }} €</div>
                            <div>Carburante: {{ auto[0].carburante }}</div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col cols="12">
                    <p>Nessun dettaglio dell'auto disponibile.</p>
                </v-col>
            </v-row>
        </v-container>
        <finePagina></finePagina>
    </v-app>
</template>
  
  <script>
  import navbar from './navbar.vue';
  import finePagina from './footer.vue';
  import router from '@/router';
  
  export default {
    components: {
      navbar,
      finePagina
    },
    data() {
      return {
        auto: {}
      };
    },
    created() {
        if (localStorage.getItem('token')) {
            this.caricaAuto(this.$route.params.idAuto);
        } else {
            router.push('/login');
        }
    },
    methods: {
      async caricaAuto(idAuto) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:3000/api/auto/${idAuto}`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              'Authorization': `${token}`
            }
          });
          if (response.ok) {
            this.auto = await response.json();
            console.log('Dettagli dell\'auto:', this.auto);
          } else {
            console.error('Errore nel caricamento dei dettagli dell\'auto:', response.statusText);
          }
        } catch (error) {
          console.error('Errore nel caricamento dei dettagli dell\'auto:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    margin-top: 50px;
  }
  </style>
  