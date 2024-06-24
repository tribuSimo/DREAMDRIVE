const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;
const { verificaCliente, verificaAdmin, verificaSuperAdmin } = require('./controlli');


// Aggiungi il middleware per il parsing dei dati da form-data
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*'
}));

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'concessionario'
});
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dreamdrive.concessionario@gmail.com',
        pass: 'o gu d o ghi u t r z z e e h'
    }
}); //mail:o gu d o ghi u t r z z e e h

app.get('api/prendiMarcaModello', verificaSuperAdmin, (req, res) => {
    pool.query('SELECT marche.marca, modelli.modello FROM ' +
        ' auto, marche, modelli' +
        ' where marche.idMarca = auto.idMarca AND modelli.idModello = auto.idModello ' +
        'AND modelli.idMarca = marche.idMarca', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send(`Errore durante il recupero dei dati `);
            }
            res.send('Recupero dei dati completato con successo');
        })
})

app.post('/api/nuovoAdmin', verificaSuperAdmin, (req, res) => {
    const { email, password, dataNascita } = req.body;

    pool.query('SELECT * FROM utenti WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Errore durante la registrazione');
        }

        if (results.length > 0) {
            return res.status(400).send('Email già utilizzata');
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            pool.query('INSERT INTO utenti (email, password, dataNascita, idRuolo) VALUES (?, ?, ?, ?)',
                [email, hashedPassword, dataNascita, 2],
                (error, results) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).send('Errore durante la registrazione');
                    }

                    res.send('Admin aggiunto con successo');
                });
        } catch (hashError) {
            console.error(hashError);
            return res.status(500).send('Errore durante la registrazione');
        }
    });
});

app.delete('/api/eliminaAdmin/:idUtente', verificaSuperAdmin, (req, res) => {
    const idUtente = req.params.idUtente;
    // Verifica se l'id della prenotazione è stato fornito
    if (!idUtente) {
        return res.status(400).send('ID utente non fornito');
    }

    // Query per eliminare la prenotazione dal database
    const query = 'DELETE FROM utenti WHERE idUtente = ?';
    pool.query(query, [idUtente], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Errore durante la cancellazione di admin');
        }

        // Verifica se la prenotazione è stata eliminata correttamente
        if (results.affectedRows === 0) {
            return res.status(404).send('Admin non trovato');
        }
        res.send('Admin eliminato con successo');
    });
});

app.post('/api/inserisciAuto', verificaSuperAdmin, (req, res) => {
    const { targa, descrizione, potenza, chilometraggio, annoProduzione, cambio, peso, usata, prezzo, idMarca, idModello, idColore, idCarburante } = req.body;
    console.log(idMarca);
    pool.query('INSERT INTO auto (targa, descrizione, potenza, chilometraggio, annoProduzione, cambio, peso, usata, prezzo,'
        + ' idMarca, idModello, idColore, idCarburante) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [targa, descrizione, potenza, chilometraggio, annoProduzione, cambio, peso, usata, prezzo, idMarca, idModello, idColore, idCarburante], // idRuolo 1 corrisponde al ruolo 'cliente'
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send(`Errore durante l'inserimento dell'auto `);
            }
            res.send('Inserimento completato con successo');
        });
})

app.post('/api/inserisciMarca', verificaSuperAdmin, (req, res) => {
    const { marca } = req.body;
    pool.query('INSERT INTO marche (marca) VALUES(?)', [marca],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send(`Errore durante l'inserimento della marca `);
            }
            res.send('Inserimento marca completato con successo');
        });
})

app.post('/api/inserisciModello', verificaSuperAdmin, (req, res) => {
    const { modello, idMarca } = req.body;
    pool.query('INSERT INTO modelli (modello, idMarca) VALUES(?,?)', [modello, idMarca], // idRuolo 1 corrisponde al ruolo 'cliente'
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send(`Errore durante l'inserimento del modello `);
            }
            res.send('Inserimento modello completato con successo');
        });
})
app.post('/api/inserisciColore', verificaSuperAdmin, (req, res) => {
    const { colore } = req.body;
    pool.query('INSERT INTO colori (colore) VALUES(?)', [colore],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send(`Errore durante l'inserimento del colore `);
            }
            res.send('Inserimento colore completato con successo');
        });
})

app.post('/api/effettuaVendita', verificaAdmin, (req, res) => {
    const { idAuto, idAdmin, nome, cognome, codiceFiscale, telefono } = req.body;
    pool.query('INSERT INTO vendite (nome, cognome, codiceFiscale, telefono, idAdmin, idAuto) VALUES(?,?,?,?,?,?)',
        [nome, cognome, codiceFiscale, telefono, idAdmin, idAuto],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send(`Errore durante l'inserimento della vendita`);
            }
            res.send('Vendita completata con successo');
        });
})

app.get('/api/getVendite/:idUtente', verificaAdmin, (req, res) => {
    const idAdmin = req.params.idUtente;
    let q = 'SELECT marche.marca, modelli.modello, vendite.* FROM auto,marche,modelli,vendite WHERE vendite.idAuto = auto.idAuto'
    + ' AND marche.idMarca = modelli.idMarca AND auto.idMarca = marche.idMarca AND auto.idModello = modelli.idModello AND idAdmin = ?';
    pool.query(q, [idAdmin], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
})

app.get('/api/auto', (req, res) => {
    let queryParams = [];
    let q = 'SELECT auto.idAuto, auto.targa, auto.descrizione, auto.potenza, auto.chilometraggio,'
    q += 'auto.annoProduzione, auto.cambio, auto.peso, auto.usata, auto.prezzo, marche.marca, carburanti.carburante,'
    q += 'modelli.modello, colori.colore, GROUP_CONCAT(immagini.immagine) AS immagini '
    q += 'FROM auto '
    q += 'INNER JOIN marche ON auto.idMarca = marche.idMarca '
    q += 'INNER JOIN carburanti ON auto.idCarburante = carburanti.idCarburante '
    q += 'INNER JOIN modelli ON auto.idModello = modelli.idModello '
    q += 'INNER JOIN colori ON auto.idColore = colori.idColore '
    q += 'LEFT JOIN immagini ON auto.idAuto = immagini.idAuto '
    q += 'WHERE auto.disponibile = 1 ';

    // Aggiungi filtri dinamicamente
    if (req.query.usata === 'true') {
        q += 'AND auto.usata = 1 ';
    }
    if (req.query.marca) {
        q += 'AND marche.marca = ? ';
        queryParams.push(req.query.marca);
    }
    if (req.query.cerca) {
        q += 'AND modelli.modello = ? '
        queryParams.push(req.query.cerca);
    }
    q += ' group by auto.idAuto ';
    // Controlla se è presente il parametro di query sortBy e aggiorna la query di conseguenza
    if (req.query.sortBy === 'Prezzo') {
        q += 'ORDER BY auto.prezzo ';
    } else if (req.query.sortBy === 'Chilometraggio') {
        q += 'ORDER BY auto.chilometraggio ';
    } else if (req.query.sortBy === 'Anno produzione') {
        q += 'ORDER BY auto.annoProduzione ';
    } else {
        q += 'ORDER BY auto.idAuto ';
    }

    pool.query(q, queryParams, (error, results) => {
        if (error) throw error;
        console.log(results);
        res.send(results);
    });
});

app.get('/api/nuoveAuto', verificaCliente, (req, res) => {
    let q = 'SELECT auto.idAuto, auto.targa, auto.descrizione, auto.potenza, auto.chilometraggio,'
    q += 'auto.annoProduzione, auto.cambio, auto.peso, auto.usata, auto.prezzo, marche.marca, carburanti.carburante,'
    q += 'modelli.modello, colori.colore, GROUP_CONCAT(immagini.immagine) AS immagini '
    q += 'FROM auto '
    q += 'INNER JOIN marche ON auto.idMarca = marche.idMarca '
    q += 'INNER JOIN carburanti ON auto.idCarburante = carburanti.idCarburante '
    q += 'INNER JOIN modelli ON auto.idModello = modelli.idModello '
    q += 'INNER JOIN colori ON auto.idColore = colori.idColore '
    q += 'LEFT JOIN immagini ON auto.idAuto = immagini.idAuto '
    q += 'WHERE auto.disponibile = 1 AND YEAR(auto.dataAcquisto) = YEAR(CURRENT_DATE()) AND MONTH(auto.dataAcquisto) >= MONTH(CURRENT_DATE())-1 '

    if (req.query.usata === 'true') {
        q += 'AND auto.usata = 1 ';
    }

    if (req.query.marca) {
        q += 'AND marche.marca = ? ';
    }
    q += 'group by auto.idAuto ';
    // Controlla se è presente il parametro di query sortBy e aggiorna la query di conseguenza
    if (req.query.sortBy === 'Prezzo') {
        q += 'ORDER BY auto.prezzo';
    } else if (req.query.sortBy === 'Chilometraggio') {
        q += 'ORDER BY auto.chilometraggio';
    } else if (req.query.sortBy === 'Anno produzione') {
        q += 'ORDER BY auto.annoProduzione';
    } else {
        q += 'ORDER BY auto.idAuto';
    }

    pool.query(q, [req.query.marca], (error, results) => {
        if (error) {
            console.error('Errore nel caricamento delle auto:', error);
            res.status(500).send('Errore interno del server');
        } else {
            console.log(results);
            res.send(results);
        }
    });
})

app.get('/api/autoUsate', verificaCliente, (req, res) => {
    let q = 'SELECT auto.idAuto, auto.targa, auto.descrizione, auto.potenza, auto.chilometraggio,'
    q += 'auto.annoProduzione, auto.cambio, auto.peso, auto.usata, auto.prezzo, marche.marca, carburanti.carburante,'
    q += 'modelli.modello, colori.colore, GROUP_CONCAT(immagini.immagine) AS immagini '
    q += 'FROM auto '
    q += 'INNER JOIN marche ON auto.idMarca = marche.idMarca '
    q += 'INNER JOIN carburanti ON auto.idCarburante = carburanti.idCarburante '
    q += 'INNER JOIN modelli ON auto.idModello = modelli.idModello '
    q += 'INNER JOIN colori ON auto.idColore = colori.idColore '
    q += 'LEFT JOIN immagini ON auto.idAuto = immagini.idAuto '
    q += 'WHERE auto.disponibile = 1 AND auto.usata = 1 ' // Aggiunta la clausola per visualizzare solo le auto usate
    q += 'GROUP BY auto.idAuto ';

    // Controlla se è presente il parametro di query sortBy e aggiorna la query di conseguenza
    if (req.query.sortBy === 'Prezzo') {
        q += 'ORDER BY auto.prezzo'; // Ordina per prezzo
    } else if (req.query.sortBy === 'Chilometraggio') {
        q += 'ORDER BY auto.chilometraggio'; // Ordina per chilometraggio
    } else if (req.query.sortBy === 'Anno produzione') {
        q += 'ORDER BY auto.annoProduzione';
    } else {
        q += 'ORDER BY auto.idAuto';
    }    // Aggiungi altri controlli per altri campi di ordinamento se necessario

    pool.query(q, (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});

app.get('/api/auto/:idAuto', verificaCliente, (req, res) => {
    const idAuto = req.params.idAuto;
    let q = 'SELECT auto.idAuto, auto.targa, auto.descrizione, auto.potenza, auto.chilometraggio, '
    q += 'auto.annoProduzione, auto.cambio, auto.peso, auto.usata, auto.prezzo, marche.marca, carburanti.carburante, '
    q += 'modelli.modello, colori.colore, GROUP_CONCAT(immagini.immagine) AS immagini '
    q += 'FROM auto '
    q += 'INNER JOIN marche ON auto.idMarca = marche.idMarca '
    q += 'INNER JOIN carburanti ON auto.idCarburante = carburanti.idCarburante '
    q += 'INNER JOIN modelli ON auto.idModello = modelli.idModello '
    q += 'INNER JOIN colori ON auto.idColore = colori.idColore '
    q += 'LEFT JOIN immagini ON auto.idAuto = immagini.idAuto '
    q += 'WHERE auto.idAuto = ? AND auto.disponibile = 1';  // Utilizziamo un placeholder per l'id dell'auto
    pool.query(q, [idAuto], (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});

app.get('/api/autoMarca/:marca', verificaCliente, (req, res) => {
    const marca = req.params.marca;
    let q = 'SELECT auto.idAuto, auto.targa, auto.descrizione, auto.potenza, auto.chilometraggio, '
    q += 'auto.annoProduzione, auto.cambio, auto.peso, auto.usata, auto.prezzo, marche.marca, carburanti.carburante, '
    q += 'modelli.modello, colori.colore, GROUP_CONCAT(immagini.immagine) AS immagini '
    q += 'FROM auto '
    q += 'INNER JOIN marche ON auto.idMarca = marche.idMarca '
    q += 'INNER JOIN carburanti ON auto.idCarburante = carburanti.idCarburante '
    q += 'INNER JOIN modelli ON auto.idModello = modelli.idModello '
    q += 'INNER JOIN colori ON auto.idColore = colori.idColore '
    q += 'LEFT JOIN immagini ON auto.idAuto = immagini.idAuto '
    q += 'WHERE marche.marca = ? AND auto.disponibile = 1';

    pool.query(q, [marca], (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});

app.put('/api/aggiornaDisponibilitaAuto/:idAuto', verificaAdmin, (req,res) => {
    const idAuto = req.params.idAuto;
    const query = `UPDATE auto SET disponibile = 0 WHERE idAuto = ?`
    pool.query(query, [idAuto], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Errore durante la modifica della disponibilita');
        }
        // Invia i risultati delle prenotazioni come risposta
        res.json(results);
    });
})

app.get('/api/marche', (req, res) => {
    let q = 'SELECT * FROM marche';
    pool.query(q, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});
// Verifica esistenza della marca
app.get('/api/marche/:marca', verificaSuperAdmin, (req, res) => {
    const { marca } = req.params;
    console.log(marca);
    pool.query('SELECT * FROM marche WHERE marca = ? LIMIT 1',
        [marca],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send(`Errore durante la verifica della marca`);
            }
            if (results.length > 0) {
                res.json(results[0]); // Restituisce le informazioni sulla marca
            } else {
                res.json(`Marca non trovata`);
            }
        });
});

app.get('/api/colori/:colore', verificaSuperAdmin, (req, res) => {
    const { colore } = req.params;
    pool.query('SELECT * FROM colori WHERE colore = ? LIMIT 1',
        [colore],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send(`Errore durante la verifica della marca`);
            }
            if (results.length > 0) {
                res.json(results[0]); // Restituisce le informazioni sulla marca
            } else {
                res.json(`Colore non trovato`);
            }
        });
});

app.get('/api/modelli/:modello', verificaSuperAdmin, (req, res) => {
    const { modello } = req.params;
    pool.query('SELECT * FROM modelli WHERE modello = ? LIMIT 1', [modello], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send(`Errore durante la verifica del modello`);
        }
        if (results.length > 0) {
            res.json(results[0]); // Restituisce le informazioni sul modello
        } else {
            res.json(`Modello non trovato`);
        }
    });

});

app.get('/api/carburanti', verificaSuperAdmin, (req, res) => {
    let q = 'SELECT * FROM carburanti';
    pool.query(q, (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});

app.get('api/admin/:idUtente', verificaSuperAdmin, (req, res) => {
    const idUtente = req.params.idUtente;
    pool.query('SELECT * FROM utenti WHERE idUtente = ? and idRuolo = 2', idUtente,
        (error, results) => {
            if (error) throw error;
            res.send(results);
        });

})

app.get('/api/utenti', verificaAdmin, (req, res) => {
    pool.query('SELECT * FROM utenti', (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});

app.get('/api/utenti/:idRuolo', verificaSuperAdmin, (req, res) => {
    const idRuolo = req.params.idRuolo; // Accedi alla chiave 'id' di req.params
    pool.query('SELECT * FROM utenti WHERE idRuolo = ?', [idRuolo], (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});

app.get('/api/notifiche/:idUtente', verificaCliente, (req, res) => {
    const idUtente = req.params.idUtente;
    //le notifiche avranno i seguenti tipi: conferma appuntamento, promemoria appuntamento, disdetta appuntamento, aggiornamenti auto
    const query = 'SELECT * FROM notifiche WHERE idUtente = ?';
    pool.query(query, [idUtente], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Errore durante il recupero delle notifiche');
        }
        res.send(results);
    });
});

app.post('/api/prenotazione', verificaCliente, (req, res) => {
    const { idAuto, idUtente, dataOra } = req.body;

    // Verifica se tutti i campi necessari sono stati forniti
    if (!idAuto || !idUtente || !dataOra) {
        return res.status(400).send('Tutti i campi sono obbligatori');
    }
    console.log(dataOra);
    // Query per inserire i dati nella tabella delle prenotazioni
    const query = 'INSERT INTO prenotazioni (idAuto, idUtente, data_ora, stato) VALUES (?, ?, ?, ?)';
    pool.query(query, [idAuto, idUtente, dataOra, "In attesa"], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Errore durante la prenotazione');
        }
        notifica('Nuova prenotazione', 'Un utente ha effettuato una prenotazione', 2);//inserisco il tipo di notifica e il messaggio di tale notifica 
        //e il tipo di utente che la deve ricevere
        res.send('Prenotazione effettuata con successo');
    });
});

function notificaUtente(tipo, messaggio, email) {
    const query = 'SELECT * FROM utenti WHERE email = ?';
    pool.query(query, [email], (error, results) => {
        if (error) {
            console.error('Errore durante il recupero degli utenti:', error);
            return;
        }

        // Invia notifica a ciascun utente del ruolo specificato
        results.forEach(utente => {
            inviaNotifica(utente.idUtente, tipo, messaggio, utente.email);
        });
    });
}
function notifica(tipo, messaggio, idRuolo) {
    const query = 'SELECT * FROM utenti WHERE idRuolo = ?';
    pool.query(query, [idRuolo], (error, results) => {
        if (error) {
            console.error('Errore durante il recupero degli utenti:', error);
            return;
        }

        // Invia notifica a ciascun utente del ruolo specificato
        results.forEach(utente => {
            inviaNotifica(utente.idUtente, tipo, messaggio, utente.email, idRuolo);
        });
    });
}
function inviaNotifica(idUtente, tipo, messaggio, email, idRuolo) {
    const query = 'INSERT INTO notifiche (idUtente, tipo, messaggio) VALUES (?, ?, ?)';
    pool.query(query, [idUtente, tipo, messaggio], (error, results) => {
        if (error) {
            console.error('Errore durante l\'inserimento della notifica nel database:', error);
            return;
        }
        //implementa l'invio della mail qui
        if (idRuolo < 2) {
            const mailOptions = {
                from: 'dreamdrive.concessionario@gmail.com', // Sostituisci con la tua email
                to: email,
                subject: 'Nuova Notifica da dreamdrive',
                text: messaggio
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Errore durante l\'invio dell\'email:', error);
                } else {
                    console.log('Email inviata: ' + info.response);
                }
            });
        }

    });
}

app.delete('/api/eliminaNotifica/:idNotifica', verificaCliente, (req, res) => {
    const idNotifica = req.params.idNotifica;
    const query = 'DELETE FROM notifiche WHERE idNotifica = ?';
    pool.query(query, [idNotifica], (error) => {
        if (error) {
            console.error('Errore durante la cancellazione della notifica dal database:', error);
            res.status(500).send('Errore del server');
            return;
        }
        res.send('Cancellazione effettuata con successo');
    });
});

app.get('/api/GetPrenotazioni/:idUtente', verificaCliente, (req, res) => {
    const idUtente = req.params.idUtente;
    // Query per ottenere i dati delle prenotazioni per l'utente specificato
    const query = `
        SELECT idPrenotazione, marca, modello, data_ora, stato 
        FROM prenotazioni
        INNER JOIN auto ON prenotazioni.idAuto = auto.idAuto
        INNER JOIN modelli ON auto.idModello = modelli.idModello
        INNER JOIN marche ON auto.idMarca = marche.idMarca
        WHERE prenotazioni.idUtente = ?`;
    pool.query(query, [idUtente], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Errore durante il recupero delle prenotazioni');
        }
        // Invia i risultati delle prenotazioni come risposta
        res.json(results);
    });
});

app.put('/api/accettaPrenotazioni/:idPrenotazione', verificaAdmin, (req, res) => {
    const idPrenotazione = req.params.idPrenotazione;
    const { email } = req.body;


    const query = `UPDATE prenotazioni SET stato = 'Accettata' WHERE idPrenotazione = ?`
    pool.query(query, [idPrenotazione], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Errore durante la modifica della prenotazione');
        }
        // Invia i risultati delle prenotazioni come risposta
        notificaUtente('conferma', 'Il tuo appuntamento è stato confermato', email);
        res.json(results);
    });
})

app.get('/api/getPrenotazioniAttesa', verificaAdmin, (req, res) => {
    const query = `
        SELECT idPrenotazione, marca, modello, data_ora, email, dettagliPrenotazione
        FROM prenotazioni
        INNER JOIN auto ON prenotazioni.idAuto = auto.idAuto
        INNER JOIN modelli ON auto.idModello = modelli.idModello
        INNER JOIN marche ON auto.idMarca = marche.idMarca
        INNER JOIN utenti ON prenotazioni.idUtente = utenti.idUtente
        WHERE stato = 'In attesa'`;
    pool.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Errore durante il recupero delle prenotazioni');
        }
        // Invia i risultati delle prenotazioni come risposta
        res.json(results);
    });
});
app.get('/api/getPrenotazioni', verificaAdmin, (req, res) => {
    const query = `
        SELECT idPrenotazione, marca, modello, data_ora, email, dettagliPrenotazione
        FROM prenotazioni
        INNER JOIN auto ON prenotazioni.idAuto = auto.idAuto
        INNER JOIN modelli ON auto.idModello = modelli.idModello
        INNER JOIN marche ON auto.idMarca = marche.idMarca
        INNER JOIN utenti ON prenotazioni.idUtente = utenti.idUtente
        WHERE stato = 'Accettata'`;
    pool.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Errore durante il recupero delle prenotazioni');
        }
        // Invia i risultati delle prenotazioni come risposta
        res.json(results);
    });
});

app.delete('/api/disdiciPrenotazione/:idPrenotazione', verificaCliente, (req, res) => {
    const idPrenotazione = req.params.idPrenotazione;
    const { email } = req.body;

    // Verifica se l'id della prenotazione è stato fornito
    if (!idPrenotazione) {
        return res.status(400).send('ID prenotazione non fornito');
    }

    // Query per eliminare la prenotazione dal database
    const query = 'DELETE FROM prenotazioni WHERE idPrenotazione = ?';
    pool.query(query, [idPrenotazione], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Errore durante la disdetta della prenotazione');
        }

        // Verifica se la prenotazione è stata eliminata correttamente
        if (results.affectedRows === 0) {
            return res.status(404).send('Prenotazione non trovata');
        }
        notificaUtente('disdetta', 'Il tuo appuntamento è stato disdetto', email);
        res.send('Prenotazione disdetta con successo');
    });
});

app.post('/api/utenti', verificaAdmin, (req, res) => {
    const { email, password, dataNascita } = req.body;
    if (!email || !password || !dataNascita) {
        return res.status(400).send('Tutti i campi sono obbligatori');
    }
    pool.query('INSERT INTO Utenti (email, password, dataNascita) VALUES (?, ?, ?)', [email, password, dataNascita], (error, results) => {
        if (error) {
            return res.status(500).send('Errore durante l\'inserimento dell\'utente');
        }
        res.send('Utente aggiunto con successo');
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Query per cercare l'utente nel database
    pool.query('SELECT * FROM utenti WHERE email = ?', [email], async (error, results) => {
        if (error) {

            console.error(error);
            return res.status(500).send('Errore durante l\'autenticazione');
        }

        if (results.length === 0) {
            return res.status(401).send('Credenziali non valide');
        }

        const user = results[0];
        // Verifica la password
        await bcrypt.compare(password, user.password, (err, same) => {
            console.log(same);
            if (err)
                return res.status(401).send('Errore nel recuperare la password');
            else if (same) {
                // Genera un token di autenticazione
                const token = jwt.sign({ email: user.email, role: user.idRuolo }, 'secret', { expiresIn: '1y' });
                // Restituisci il token di autenticazione al client
                res.send(token);
            } else {
                res.status(401).send('Credenziali non valide');
            }
        });
    });
});

app.post('/api/registrazione', (req, res) => {
    const { email, password, dataNascita } = req.body;

    // Query per verificare se l'email esiste già nel database
    pool.query('SELECT * FROM utenti WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Errore durante la registrazione');
        }

        // Se l'email esiste già, restituisci un errore
        if (results.length > 0) {
            return res.status(400).send('Email già utilizzata');
        }

        // Hash della password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Query per inserire il nuovo utente nel database
        pool.query('INSERT INTO utenti (email, password, dataNascita, idRuolo) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, dataNascita, 1], // idRuolo 1 corrisponde al ruolo 'cliente'
            (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send('Errore durante la registrazione');
                }

                res.send('Registrazione completata con successo');
            });
    });
});

app.get('/api/verificaRuolo', async (req, res) => {
    const token = req.header('Authorization');

    // Verifica se il token è presente
    if (!token) {
        return res.status(401).json({ message: 'Token di autenticazione non fornito' });
    }

    try {
        // Verifica il token utilizzando la chiave segreta
        const decoded = jwt.verify(token, 'secret');
        // Aggiungi le informazioni utente decodificate all'oggetto della richiesta
        req.user = decoded;
        // Restituisci il ruolo utente
        res.json({ role: decoded.role });
    } catch (error) {
        // In caso di errore nella verifica del token
        return res.status(401).json({ message: 'Token di autenticazione non valido' });
    }
});

app.get('/api/getUserID', verificaCliente, (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send('Token non fornito');
    }

    // Verifica e decodifica il token
    jwt.verify(token, 'secret', (err, decodedToken) => {
        if (err) {
            console.error(err);
            return res.status(401).send('Token non valido');
        }

        // Estrae l'email dell'utente dal token decodificato
        const email = decodedToken.email;

        // Cerca l'ID dell'utente in base all'email
        pool.query('SELECT idUtente FROM utenti WHERE email = ?', [email], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Errore durante la ricerca dell\'ID dell\'utente');
            }

            // Se l'utente non è stato trovato, restituisci uno stato 404
            if (results.length === 0) {
                return res.status(404).send('Utente non trovato');
            }

            // Estrae l'ID dell'utente dai risultati della query e lo restituisce come risposta
            const userId = results[0].idUtente;
            res.send({ userId });
        });
    });
});


app.listen(port, () => {
    console.log(`Server in esecuzione sulla porta ${port}`);
});