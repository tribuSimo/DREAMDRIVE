const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

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

app.get('/api/auto', verificaCliente, (req, res) => {
    let q = 'SELECT auto.idAuto, auto.targa, auto.descrizione, auto.potenza, auto.chilometraggio,'
    q += 'auto.annoProduzione, auto.cambio, auto.peso, auto.usata, auto.prezzo, marche.marca, carburanti.carburante,'
    q += 'modelli.modello, colori.colore, GROUP_CONCAT(immagini.immagine) AS immagini '
    q += 'FROM auto '
    q += 'INNER JOIN marche ON auto.idMarca = marche.idMarca '
    q += 'INNER JOIN carburanti ON auto.idCarburante = carburanti.idCarburante '
    q += 'INNER JOIN modelli ON auto.idModello = modelli.idModello '
    q += 'INNER JOIN colori ON auto.idColore = colori.idColore '
    q += 'LEFT JOIN immagini ON auto.idAuto = immagini.idAuto '
    q += 'WHERE AUTO.disponibile = 1 '
    q += 'group by auto.idAuto '; 

    // Controlla se è presente il parametro di query sortBy e aggiorna la query di conseguenza
    if (req.query.sortBy === 'Prezzo') {
        q += 'ORDER BY auto.prezzo'; // Ordina per prezzo
    } else if (req.query.sortBy === 'Chilometraggio') {
        q += 'ORDER BY auto.chilometraggio'; // Ordina per chilometraggio
    }else if(req.query.sortBy === 'Anno produzione'){
        q += 'ORDER BY auto.annoProduzione';
    }else{
        q += 'ORDER BY auto.idAuto';
    }    // Aggiungi altri controlli per altri campi di ordinamento se necessario

    pool.query(q, (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});
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
        if(error) throw error;
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
        if(error) throw error;
        res.send(results);
    });
});

app.get('/api/marche', (req, res) => {
    let q = 'SELECT * FROM marche';
    pool.query(q, (error, results) => {
        if(error) throw error;
        res.send(results);
    });
})

app.get('/api/utenti',verificaAdmin, (req, res) => {
    pool.query('SELECT * FROM utenti', (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});

app.get('/api/utenti/:id', verificaAdmin, (req, res) => {
    const id = req.params.id; // Accedi alla chiave 'id' di req.params
    pool.query('SELECT * FROM utenti WHERE id = ?', id, (error, results) => {
        if (error) throw error;
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
        res.send('Prenotazione effettuata con successo');
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

app.delete('/api/disdiciPrenotazione/:idPrenotazione', verificaCliente, (req, res) => {
    const idPrenotazione = req.params.idPrenotazione;

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
    console.log(email, password);

    // Query per cercare l'utente nel database
    pool.query('SELECT * FROM utenti WHERE email = ?', [email], async (error, results) => {
        console.log("Funziona query")
        if (error) {
            
            console.error(error);
            return res.status(500).send('Errore durante l\'autenticazione');
        }

        if (results.length === 0) {
            return res.status(401).send('Credenziali non valide');
        }

        const user = results[0];
        console.log(user.password);
        // Verifica la password
        await bcrypt.compare(password, user.password, (err, same) => {
            console.log(same);
            if(err)
                return res.status(401).send('Errore nel recuperare la password');
            else if(same) {
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

app.post('/api/prenotazione', verificaCliente, (req, res) => {
    const { idAuto, orario, dataGG } = req.body;

    // Verifica se tutti i campi necessari sono stati forniti
    if (!idAuto || !orario || !dataGG) {
        return res.status(400).send('Tutti i campi sono obbligatori');
    }

    // Query per inserire i dati nella tabella delle prenotazioni
    const query = 'INSERT INTO prenotazioni (idAuto, orario, dataGG) VALUES (?, ?, ?)';
    pool.query(query, [idAuto, orario, dataGG], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Errore durante la prenotazione');
        }
        res.send('Prenotazione effettuata con successo');
    });
});
