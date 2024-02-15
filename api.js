const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// Aggiungi il middleware per il parsing dei dati da form-data
app.use(express.urlencoded({ extended: true }));

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'concessionario'
});

app.get('/api/utenti', (req, res) => {
    pool.query('SELECT * FROM utenti', (error, results) => {
      if (error) throw error;
      res.send(results); // Utilizza send invece di json
    });
});

app.get('/api/utenti/:id', (req, res) => {
    const id = req.params.id; // Accedi alla chiave 'id' di req.params
    pool.query('SELECT * FROM utenti WHERE id = ?', id, (error, results) => {
      if (error) throw error;
      res.send(results); // Utilizza send invece di json
    });
});

app.post('/api/utenti', (req, res) => {
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
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send('Credenziali non valide');
        }

        // Genera un token di autenticazione
        const token = jwt.sign({ id: user.id, email: user.email, role: user.idRuolo }, 'secret', { expiresIn: '1y' });
        
        // Restituisci il token di autenticazione al client
        res.send(token);
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

app.listen(port, () => {
    console.log(`Server in esecuzione sulla porta ${port}`);
});