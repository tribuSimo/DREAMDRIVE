<template>
  <v-app>
    <v-app-bar app color="white">
      <v-container class="nav-container">
        <v-row class="nav">
          <v-img src="logo.jpg" max-width="50" max-height="50" contain />
          <v-btn to="/auto" class="nav-button">
            Auto
          </v-btn>
          <v-btn to="/nuove-uscite" class="nav-button">
            Nuove Uscite
          </v-btn>
          <v-btn to="/carrello" class="nav-button">
            Carrello
          </v-btn>
          <v-btn to="/novita" class="nav-button">
            Novità
          </v-btn>
          <div class="div-search">
            <v-img class="nav-img" src="search.png" max-width="20" max-height="20" contain />
            <!-- Ricerca a destra -->
            <v-text-field class="nav_v-text-field" placeholder="Cerca" outlined dense></v-text-field>
          </div>
            
        </v-row>
      </v-container>
    </v-app-bar>
  </v-app>
</template>
  
<style scoped>
body, #app {
  margin: 0;
  padding: 0;
}
.nav-button {
  text-align: left;
  margin-right: 10px;
  /* Aggiungi margine tra i pulsanti */
  transition: background-color 1s;
  /* Transizione di 1 secondo */
}
.div-search{
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

.nav {
  display: flex;
  align-items: center;
  height: 100%;
}

.nav-img {
  margin-top: 15px;
}</style>