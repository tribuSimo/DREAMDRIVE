<template>
    <v-app>
        <navbar></navbar>
        <v-container class="containerSearch">
            <div class="divNotifiche" v-html="html">

            </div>
        </v-container>
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
            messaggi: [],
        };
    },
    created() {
        if (localStorage.getItem('token')) {
            this.caricaMessaggi();
        } else {
            router.push('/login');
        }


    },
    methods: {
        async caricaMessaggi() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${window.dreamdrive_cfg.api}/notifiche/${idUtente}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        'Authorization': `${token}`
                    }
                });
                if (response.ok) {
                    this.messaggi = await response.json();
                    console.log(this.messaggi);
                } else {
                    console.error('Errore nel caricamento del messaggio:', response.statusText);
                }
            } catch (error) {
                console.error('Errore nel caricamento del messaggio:', error);
            }
        },

        async eliminaMessaggi() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${window.dreamdrive_cfg.api}/notifiche/${idUtente}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        'Authorization': `${token}`
                    }
                });
                if (response.ok) {
                    this.messaggi = await response.json();
                    console.log(this.messaggi);
                } else {
                    console.error('Errore nel caricamento del messaggio:', response.statusText);
                }
            } catch (error) {
                console.error('Errore nel caricamento del messaggio:', error);
            }
        },

    }
};
</script>

<style scoped>
.containerSearch {
    width: 100%;
    margin: 20px auto;
    margin-top: 80px;
}

.divNotifiche {
    margin: 10vh auto;
    width: 15vw;
    height: 20vh;
    border: 2px solid black;
    border-radius: 7%;
    margin-bottom: 20vw;
}
</style>
