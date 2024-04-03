<template>
  
     <v-app-bar app color="white" >
      <v-container class="nav-container">
        <v-row class="nav">
          <v-img src="logo.jpg" max-width="50" max-height="50" contain />
          <v-btn to="/home" class="nav-button">
            Auto
          </v-btn>
          <v-btn to="/nuove-uscite" class="nav-button">
            Nuove Uscite
          </v-btn>
          <v-btn to="/prenotazioni" class="nav-button">
            Prenotazioni
          </v-btn>
          <v-btn to="/notifiche" class="nav-button">
            Notifiche
          </v-btn>
          <v-btn @click="logout()" class="nav-button">
            Logout
          </v-btn>
          <div class="div-search">
            <v-text-field class="nav_v-text-field" append-inner-icon="mdi-magnify" placeholder="Cerca" outlined dense></v-text-field>
          </div>
            
        </v-row>
      </v-container>
    </v-app-bar> 
  
</template>
<script>
import router from '@/router';

export default {
  name: "App",
  data: () => ({
      items: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' },
      ],
    }),
    methods :{
      logout(){
        localStorage.clear();
        router.push("/login");
      }
    }
};
</script>
  
<style scoped>
body, #app {
  margin: 0;
  padding: 0;
}

.nav-button {
  text-align: left;
  margin-right: 10px;
  transition: background-color 1s;
}

.div-search {
  margin-top: 20px;
  display: flex;
  width: 400px;
}

.nav-button:hover {
  color: white;
  text-shadow: 1px 1px #000000;
  background-color: rgb(224, 160, 21);
}

.nav_v-text-field {
  width: 50px;
  padding-left: 30px;
}

.nav-container {
  padding: 0;
  
}

.nav {
  display: flex;
  align-items: center;
}

/* Imposta l'altezza della barra di navigazione */
.v-toolbar__content {
  min-height: 50px; /* Imposta l'altezza desiderata */
}

</style>
