<!-- eslint-disable vue/no-unused-components -->
<template>
  <v-app>
    <navbar></navbar>
    <v-container class="containerSearch">
        <v-col v-for="index in 5" :key="index" cols="12" class="text-left">
          <v-card outlined>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-label>Etichetta {{ index }}</v-label>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-combobox
                    v-model="selectedItem"
                    :items="items"
                    label="Seleziona un elemento"
                  ></v-combobox>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
    </v-container>
    <footer></footer> <!-- Includi il componente footer qui -->
  </v-app>
</template>

<script>
import navbar from './navbar.vue';
import footer from './footer.vue';
export default {
  components: {
    navbar,
    footer // Aggiungi il componente footer
  },
  data() {
    return {
      selectedItem: null,
      items: ['Elemento 1', 'Elemento 2', 'Elemento 3', 'Elemento 4', 'Elemento 5'],
    };
  },
};
</script>

<style scoped>
.containerSearch
{
  width: 25%;
  height: 800px;
  margin-left: 0px;
  margin-top: 80px;
  border-right: #333;
  float: right;
}

.containerMain{
  width: 75%;
  float: left ;
  margin-top: 0px;
  margin-left: 0px;
  position: absolute;

}
</style>
