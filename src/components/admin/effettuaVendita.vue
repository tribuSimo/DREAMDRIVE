<template>
    <v-app>
        <navbar></navbar>
        <v-container>

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