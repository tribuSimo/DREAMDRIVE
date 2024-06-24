<template>
    <v-app>
        <navbar></navbar>
        <v-container class="container">
            <v-form ref="form">
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="acquirente.nome" label="Nome"
                            :rules="[v => !!v || 'Nome richiesto']"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="acquirente.cognome" label="Cognome"
                            :rules="[v => !!v || 'Cognome richiesto']"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="acquirente.codiceFiscale" label="Codice Fiscale"
                            :rules="[v => !!v || 'Codice Fiscale richiesto', v => /^[A-Za-z0-9]{16}$/.test(v) || 'Codice Fiscale non valido']">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="acquirente.telefono" label="Numero di Telefono"
                            :rules="[v => !!v || 'Numero di Telefono richiesto', v => /^[\d\s+-]{7,20}$/.test(v) || 'Numero di Telefono non valido']">
                        </v-text-field>
                    </v-col>

                </v-row>
                <v-row v-if="auto">
                    <v-col cols="12">
                        <v-card outlined>
                            <v-card-title>{{ auto[0].marca }} {{ auto[0].modello }}</v-card-title>
                            <v-card-text>
                                <div>Targa: {{ auto[0].targa }}</div>
                                <div>Descrizione: {{ auto[0].descrizione }}</div>
                                <div>Potenza: {{ auto[0].potenza }} cv</div>
                                <div>Chilometraggio: {{ auto[0].chilometraggio }} km</div>
                                <div>Anno di produzione: {{ auto[0].annoProduzione }}</div>
                                <div>Cambio: {{ auto[0].cambio }}</div>
                                <div>Peso: {{ auto[0].peso }} kg</div>
                                <div>Usata: {{ auto[0].usata ? 'Sì' : 'No' }}</div>
                                <div>Prezzo: {{ auto[0].prezzo }} €</div>
                                <div>Marca: {{ auto[0].marca }}</div>
                                <div>Modello: {{ auto[0].modello }}</div>
                                <div>Carburante: {{ auto[0].carburante }}</div>
                                <div>Colore: {{ auto[0].colore }}</div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-btn @click="effettuaVendita" class="btnVendi" block>Vendi</v-btn>
            </v-form>
            <v-alert v-if="errorMessage" color="error" dismissible>
                {{ errorMessage }}
            </v-alert>
        </v-container>
        <finePagina></finePagina>
    </v-app>
</template>

<script>
import navbar from './navbar.vue';
import finePagina from '../footer.vue';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default {
    components: {
        navbar,
        finePagina
    },
    data() {
        return {
            acquirente: {
                nome: '',
                cognome: '',
                codiceFiscale: '',
                telefono: ''
            },
            auto: null,
            errorMessage: '',
            idAdmin: null
        };
    },
    created() {
        this.prendiID();
        this.caricaAuto(this.$route.params.idAuto);
    },
    methods: {
        async prendiID() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${window.dreamdrive_cfg.api}/getUserID`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        'Authorization': `${token}`
                    }
                });
                if (response.ok) {
                    let data = await response.json();
                    this.idAdmin = data.userId;
                } else {
                    this.errorMessage = 'Errore nel caricamento di idUtente: ' + response.statusText;
                }
            } catch (error) {
                this.errorMessage = 'Errore nella richiesta per idUtente: ' + error.message;
            }
        },
        async caricaAuto(idAuto) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${window.dreamdrive_cfg.api}/auto/${idAuto}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        'Authorization': `${token}`
                    }
                });
                if (response.ok) {
                    this.auto = await response.json();
                } else {
                    this.errorMessage = 'Errore nel caricamento dei dettagli dell\'auto: ' + response.statusText;
                }
            } catch (error) {
                this.errorMessage = 'Errore nel caricamento dei dettagli dell\'auto: ' + error.message;
            }
        },
        async effettuaVendita() {
            if (!this.$refs.form.validate()) return;

            try {
                const token = localStorage.getItem('token');
                // Genera il PDF
                this.generaPDF();

                // Aggiungi i dati nella tabella vendite
                const params = new URLSearchParams({
                    idAuto: this.auto[0].idAuto,
                    idAdmin: this.idAdmin,
                    nome: this.acquirente.nome,
                    cognome: this.acquirente.cognome,
                    codiceFiscale: this.acquirente.codiceFiscale,
                    telefono: this.acquirente.telefono,
                });

                const response = await fetch(`${window.dreamdrive_cfg.api}/effettuaVendita`, {
                    method: 'POST',
                    body: params,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        'Authorization': `${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Errore durante l\'inserimento della vendita');
                } else {
                    await this.aggiornaDisponibilitaAuto(this.auto[0].idAuto);
                    alert("Vendita effettuata con successo");
                }
            } catch (error) {
                this.errorMessage = 'Errore durante l\'effettuazione della vendita: ' + error.message;
            }
        },
        async aggiornaDisponibilitaAuto(idAuto) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${window.dreamdrive_cfg.api}/aggiornaDisponibilitaAuto/${idAuto}`, {
                    method: 'PUT', // Metodo PUT per l'aggiornamento
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        'Authorization': `${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Errore durante l\'aggiornamento della disponibilità dell\'auto');
                }
            } catch (error) {
                this.errorMessage = 'Errore durante l\'aggiornamento della disponibilità dell\'auto: ' + error.message;
            }
        },
        generaPDF() {
            const doc = new jsPDF();
            doc.text('Dettagli Vendita Auto', 14, 16);
            doc.autoTable({
                head: [['Campo', 'Valore']],
                body: [
                    ['Nome acquirente', this.acquirente.nome],
                    ['Cognome acquirente', this.acquirente.cognome],
                    ['Codice Fiscale', this.acquirente.codiceFiscale],
                    ['Telefono', this.acquirente.telefono],
                    ['Marca', this.auto[0].marca],
                    ['Modello', this.auto[0].modello],
                    ['Targa', this.auto[0].targa],
                    ['Descrizione', this.auto[0].descrizione],
                    ['Potenza', `${this.auto[0].potenza} cv`],
                    ['Chilometraggio', `${this.auto[0].chilometraggio} km`],
                    ['Cambio', this.auto[0].cambio],
                    ['Anno di produzione', this.auto[0].annoProduzione],
                    ['Peso', `${this.auto[0].peso} kg`],
                    ['Usata', this.auto[0].usata ? 'Sì' : 'No'],
                    ['Carburante', this.auto[0].carburante],
                    ['Colore', this.auto[0].colore],
                    ['Prezzo', `${this.auto[0].prezzo} €`]
                ],
                startY: 20,
                styles: { fontSize: 10 }
            });
            doc.save('Dettagli_Vendita.pdf');
        }
    }
};
</script>

<style scoped>
.container {
    margin-top: 73px;
    margin-bottom: 20px;
}

.btnVendi {
    margin-top: 20px;
    background-color: #ffa500;
    color: white;
    width: 100%;
    max-width: 200px;
}
</style>