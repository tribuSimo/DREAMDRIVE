<template>
  <v-footer id="footer" class="bg-black text-white text-center d-flex flex-column">
    <div>
      <v-btn v-for="icon in icons" :key="icon" :icon="icon" class="mx-4" variant="text"></v-btn>
    </div>

    <div class="pt-2">
      Copyright
    </div>

    <v-divider></v-divider>

    <div>
      {{ new Date().getFullYear() }} — <strong>DreamDrive</strong>
    </div>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    icons: [
      'mdi-facebook',
      'mdi-twitter',
      'mdi-linkedin',
      'mdi-instagram',
    ],
  }),
}
</script>
<style>
#footer{
  background-color: #294c80 !important;
  color: #ffffff !important;
}
</style>