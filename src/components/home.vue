<template>
    <v-app>
        <v-container fluid>
      <v-row>
        <!-- Primo container (colorato di rosso) -->
        <v-col cols="2" style="background-color: red;border-right: 1px solid black;height:500px;">
          <v-container fluid>
           qui faremo la ricerca con tutte le compo box
          </v-container>
        </v-col>

        <!-- Secondo container -->
        <v-col cols="6">
          <v-container fluid>
            <!-- Contenuto del secondo container -->
             <!-- Contenuto del primo container -->
            <p class="font-weight-black text-h2">
              ELITE MOTORS
            </p>
            <br />
            <v-row justify="center">
              <v-col cols="30">
                <v-card>
                  <v-img
                    src="/img/home/car_home.png"
                    cover
                  ></v-img>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>