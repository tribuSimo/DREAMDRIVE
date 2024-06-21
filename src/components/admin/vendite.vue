<template>
    <v-app>
      <navbar></navbar>
      <v-container class="containerSearch">
        
      </v-container>
      <finePagina></finePagina>
    </v-app>
  </template>
  <script>
  import navbar from './navbar.vue';
  import finePagina from '../footer.vue';
  import router from '@/router';
  
  export default {
    components: {
      navbar,
      finePagina
    },
    created() {
      let n = 1;
      let n2 = 2;
      if(n > n2)
        router.push('/login');
      
    },
  }

  </script>


<style scoped>
  .containerSearch {
    width: 100%;
    margin-top: 10vh;
  }


</style>