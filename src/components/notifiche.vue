<template>
    <v-app>
        <navbar></navbar>
        <v-container class="containerSearch">
            <v-row class="justify-center">
                <v-col cols="12" md="8">
                    <v-card class="pa-3">
                        <v-card-title>
                            <span class="headline">Notifiche</span>
                        </v-card-title>
                        <v-card-text>
                            <div v-for="notifica in messaggi" :key="notifica.idNotifica"
                                :class="['message-bubble', getNotificationClass(notifica.tipo)]">
                                <v-row>
                                    <v-col>
                                        <div class="message-content">
                                            <div class="message-icon">
                                                <v-icon>{{ getNotificationIcon(notifica.tipo) }}</v-icon>
                                            </div>
                                            <div class="message-text">{{ notifica.messaggio }}</div>
                                            <div class="message-time">{{ new Date(notifica.timestamp).toLocaleString()
                                                }}</div>
                                        </div>
                                    </v-col>
                                    <v-col class="col-auto" v-if="notifica.tipo === 'user'">
                                        <v-btn icon small @click="eliminaMessaggio(notifica.idNotifica)">
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
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
            this.caricaMessaggi(this.$route.params.idUtente);
        } else {
            router.push('/login');
        }
    },
    methods: {
        async caricaMessaggi(idUtente) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${window.dreamdrive_cfg.api}/notifiche/${idUtente}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    this.messaggi = await response.json();
                } else {
                    console.error('Errore nel caricamento del messaggio:', response.statusText);
                }
            } catch (error) {
                console.error('Errore nel caricamento del messaggio:', error);
            }
        },
        async eliminaMessaggio(idNotifica) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${window.dreamdrive_cfg.api}/eliminaNotifica/${idNotifica}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    this.messaggi = this.messaggi.filter(notifica => notifica.idNotifica !== idNotifica);
                } else {
                    console.error('Errore nella cancellazione della notifica:', response.statusText);
                }
            } catch (error) {
                console.error('Errore nella cancellazione della notifica:', error);
            }
        },
        getNotificationClass(tipo) {
            switch (tipo) {
                case 'conferma':
                    return 'conferma-appuntamento';
                case 'promemoria':
                    return 'promemoria-appuntamento';
                case 'disdetta':
                    return 'disdetta-appuntamento';
                case 'aggiornamenti':
                    return 'aggiornamenti-auto';
                default:
                    return '';
            }
        },
        getNotificationIcon(tipo) {
            switch (tipo) {
                case 'conferma':
                    return 'mdi-check-circle';
                case 'promemoria':
                    return 'mdi-bell';
                case 'disdetta':
                    return 'mdi-cancel';
                case 'aggiornamenti':
                    return 'mdi-car';
                default:
                    return 'mdi-information';
            }
        }
    }
};
</script>

<style scoped>
.containerSearch {
    width: 100%;
    margin: 20px auto;
    margin-top: 80px;
}

.message-bubble {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 20px;
    max-width: 70%;
    word-wrap: break-word;
}

.conferma-appuntamento {
    background-color: #d4edda;
    border-left: 5px solid #28a745;
}

.promemoria-appuntamento {
    background-color: #fff3cd;
    border-left: 5px solid #ffc107;
}

.disdetta-appuntamento {
    background-color: #f8d7da;
    border-left: 5px solid #dc3545;
}

.aggiornamenti-auto {
    background-color: #d1ecf1;
    border-left: 5px solid #17a2b8;
}

.message-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.message-icon {
    margin-right: 10px;
    align-self: flex-start;
}

.message-text {
    margin-bottom: 5px;
}

.message-time {
    font-size: 0.75rem;
    color: gray;
    text-align: right;
}
</style>