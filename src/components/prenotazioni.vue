<template>
    <v-app>
      <navbar></navbar>
      
      <div class="container">
        <!-- Testo "Riepilogo" posizionato in alto a destra -->
        <h1 class="riepilogo_title">RIEPILOGO</h1>
        <h3 class="riepilogo_marcaModello">{{ auto[0].marca }} {{ auto[0].modello }}</h3>
        <h3 class="riepilogo_potenza" >Potenza: {{ auto[0].potenza }} cv</h3>
        <h3 class="riepilogo_chilometraggio">Chilometraggio: {{ auto[0].chilometraggio }} km</h3>
        <h3 class="riepilogo_anno">Anno di produzione: {{ auto[0].annoProduzione }}</h3>
        <!-- Altri dettagli dell'auto -->
      </div>
  
      <!-- Div a destra con testo h1 e bottone -->
      <div class="right-div">
        <h1 class="riepilogo_Prezzo">Prezzo: {{ auto[0].prezzo }} €</h1>
        <v-btn class="btnPrenota rounded-xl">Prenota Incontro</v-btn>
      </div>
  
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
      if (localStorage.getItem('token'))
        this.caricaAuto(this.$route.params.idAuto);
      else
        router.push('/login');
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
      },
    }
  };
  </script>
  
  <style scoped>
  /* Stile per posizionare il testo "Riepilogo" in alto a destra */
  .riepilogo_title {
    font-size: 40px;
    font-weight: bold;
    position: absolute;
    top: 150px; /* Regola l'altezza dal top */
    left: 10%; /* Regola la distanza dal bordo destro */
  }

  /* Stile per posizionare gli altri dettagli dell'auto in alto a sinistra */
  .riepilogo_marcaModello {
    position: absolute;
    top: 220px; /* Regola l'altezza dal top */
    left: 10%; /* Regola la distanza dal bordo sinistro */
  }
  
  .riepilogo_potenza {
    position: absolute;
    top: 260px; /* Regola l'altezza dal top */
    left: 10%; /* Regola la distanza dal bordo sinistro */
  }
  
  .riepilogo_chilometraggio {
    position: absolute;
    top: 300px; /* Regola l'altezza dal top */
    left: 10%; /* Regola la distanza dal bordo sinistro */
  }
  
  .riepilogo_anno {
    position: absolute;
    top: 340px; /* Regola l'altezza dal top */
    left: 10%; /* Regola la distanza dal bordo sinistro */
  }
  
  /* Stile per posizionare il nuovo div a destra */
  .right-div {
    position: absolute;
    top: 150px; /* Regola l'altezza dal top */
    right: 10%; /* Regola la distanza dal bordo destro */
    width: 30%; /* Regola la larghezza del div */
    padding: 20px; /* Opzionale: spazio interno per il div */
  }
  /* Stile per il prezzo con bordo sfocato */
.riepilogo_Prezzo {
  border: 2px solid #0d6efd; /* Bordo sfocato */
  border-radius: 10px;
  padding: 10px; /* Spazio interno */
  backdrop-filter: blur(5px); /* Effetto di sfocatura */
  -webkit-backdrop-filter: blur(5px); /* Effetto di sfocatura per browser Webkit */
}

.btnPrenota{
    margin-top: 20px;
    background-color: #0d6efd;
    color: white;
    width: 200px;
}

  </style>
  