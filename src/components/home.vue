<!-- eslint-disable vue/no-unused-components -->
<template>
  <v-app>
    <navbar></navbar>
    <v-container class="containerSearch">
        <v-col v-for="index in 5" :key="index" class="text-left">
          <v-card outlined>
            <v-container>
              <v-row>
                <v-col>
                  <v-label>Etichetta {{ index }}</v-label>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-combobox class="cmbElement"
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
    <finePagina></finePagina>
  </v-app>
</template>

<script>
import navbar from './navbar.vue';
import finePagina from './footer.vue';
export default {
  components: {
    navbar,
    finePagina
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
  width: 400px;
  height: 100%;
  margin-left: 0px;
  margin-top: 50px;
  border-right: #333;
  float: right;
}

.containerMain{
  width: 100%;
  float: left ;
  margin-top: 0px;
  margin-left: 0px;
  position: absolute;

}

.cmbElement{
  width: 90%;
}
</style>
