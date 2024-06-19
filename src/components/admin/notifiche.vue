<template>
    <v-app>
        <navbar></navbar>
        <v-container class="containerSearch">
            <v-alert title="Errore" v-if="errorMessage" color="error" closable>
                {{ errorMessage }}
            </v-alert>
            <v-row class="justify-center" v-if="messaggi.length > 0">
                <v-col cols="12" md="8">
                    <v-card class="pa-3">
                        <v-card-title>
                            <span class="headline">Notifiche</span>
                        </v-card-title>
                        <v-card-text>
                            <div v-for="notifica in messaggi" :key="notifica.idNotifica"
                                :class="['message-bubble', getNotificationClass(notifica.tipo)]"
                                @click="showDeleteDialog(notifica)">
                                <v-row>
                                    <v-col>
                                        <div class="message-content">
                                            <div class="message-icon">
                                                <v-icon>{{ getNotificationIcon(notifica.tipo) }}</v-icon>
                                            </div>
                                            <div class="message-text">{{ notifica.messaggio }}</div>
                                            <div class="message-time">{{ new Date(notifica.dataOra).toLocaleString()
                                                }}</div>
                                        </div>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <div v-else class="no-data-message">
                <h3>Non ci sono notifiche al momento.</h3>
            </div>
        </v-container>
        <finePagina></finePagina>

        <!-- Aggiungi il dialog di conferma eliminazione -->
        <v-dialog v-model="dialog" max-width="500">
            <v-card>
                <v-card-title class="headline">Conferma eliminazione</v-card-title>
                <v-card-text>
                    Sei sicuro di voler eliminare questa notifica?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="dialog = false">Annulla</v-btn>
                    <v-btn color="error" text
                        @click="eliminaMessaggio(selectedNotifica.idNotifica); dialog = false">Conferma</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
    data() {
        return {
            messaggi: [],
            errorMessage: '',
            dialog: false,
            selectedNotifica: null,
        };
    },
    created() {
        if (localStorage.getItem('token') && localStorage.getItem('ruolo') && localStorage.getItem('ruolo') >= 2) {
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
                        'Authorization': `${token}`
                    }
                });
                if (response.ok) {
                    this.messaggi = await response.json();
                } else {
                    console.error('Errore nel caricamento del messaggio:', response.statusText);
                    this.errorMessage = "Errore nel caricamento del messaggio: " + response.statusText;
                }
            } catch (error) {
                console.error('Errore nel caricamento del messaggio:', error);
                this.errorMessage = "Errore nel caricamento del messaggio: " + error.message;
            }
        },
        showDeleteDialog(notifica) {
            this.selectedNotifica = notifica;
            this.dialog = true;
        },
        async eliminaMessaggio(idNotifica) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${window.dreamdrive_cfg.api}/eliminaNotifica/${idNotifica}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `${token}`
                    }
                });
                if (response.ok) {
                    this.messaggi = this.messaggi.filter(notifica => notifica.idNotifica !== idNotifica);
                } else {
                    console.error('Errore nella cancellazione della notifica:', response.statusText);
                    this.errorMessage = "Errore nella cancellazione del messaggio: " + response.statusText;
                }
            } catch (error) {
                console.error('Errore nella chiamata di cancellazione della notifica:', error);
                this.errorMessage = "Errore nella chiamata di cancellazione del messaggio: " + error.message;
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
    height: 100%;
    margin: 20px auto;
    margin-top: 80px;
}

.message-bubble {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 5px;
    border-radius: 20px;
    max-width: 55%;
    word-wrap: break-word;
    transition: transform 0.2s, background-color 0.2s;
    cursor: pointer;
}

.message-bubble:hover {
    transform: scale(1.05);
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

.conferma-appuntamento:hover {
    background-color: #c3e6cb;
}

.promemoria-appuntamento:hover {
    background-color: #ffeeba;
}

.disdetta-appuntamento:hover {
    background-color: #f5c6cb;
}

.aggiornamenti-auto:hover {
    background-color: #bee5eb;
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
.no-data-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  color: grey;
}
</style>