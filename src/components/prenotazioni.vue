<template>
    <v-app>
      <navbar></navbar>
      
      <v-table height="300px">
        <thead>
          <tr>
            <th class="text-left">
             Nome auto
            </th>
            <th class="text-left">
             Data
            </th>
             <th class="text-left">
             Orario
            </th>
             <th class="text-left">
             Stato
            </th>
          </tr>
        </thead>
      <tbody>
      <tr
        v-for="item in dati"
        :key="item.name"
      >
        <td>{{ item.nome }}</td>
        <td>{{ item.data }}</td>
        <td>{{ item.orario }}</td>
        <td>{{ item.stato }}</td>
      </tr>
    </tbody>
  </v-table>
  
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
      dati: {} // Aggiungi un array vuoto per contenere i dati della tabella
    };
  },
  created() {
    if (localStorage.getItem('token'))
      this.caricaAuto(this.$route.params.idUtente);
    else
      router.push('/login');
  },
  methods: {
  async caricaPrenotazioni(idUtente) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/GetPrenotazioni/${idUtente}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': `${token}`
        }
      });
      if (response.ok) {
        this.dati = await response.json();
        console.log('Dettagli prenotazioni:', this.dati);
      } else {
        console.error('Errore nel caricamento delle prenotazioni:', response.statusText);
      }
    } catch (error) {
      console.error('Errore nel caricamento delle prenotazioni:', error);
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
  