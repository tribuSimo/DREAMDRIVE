<template>
    <v-app>
    <navbar></navbar>
    <v-container class="container">

    </v-container>
    <finePagina></finePagina>
  </v-app>
  </template>
  

<script>

    import navbar from './navbar.vue';
    import finePagina from '../footer.vue';
  

  export default {
    components: {
      navbar,
      finePagina
    },
}
  </script>
  
  <style scoped>
  
  .container{
    height: 80%;
  }
  </style>