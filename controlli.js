const jwt = require('jsonwebtoken');

// Middleware per verificare se l'utente è autenticato come cliente
function verificaCliente(req, res, next) {
    // Leggi il token di autenticazione dal localStorage del browser
    const token = req.header('Authorization') || req.query.token || req.body.token || req.cookies.token || req.headers['x-access-token'] || req.headers['authorization'];

    // Verifica se il token è presente
    if (!token) {
        return res.status(401).json({ message: 'Token di autenticazione non fornito' });
    }

    try {
        // Verifica il token utilizzando la chiave segreta
        const decoded = jwt.verify(token, 'secret');

        // Aggiungi le informazioni utente decodificate all'oggetto della richiesta
        req.user = decoded;

        // Verifica se l'utente è un cliente
        if (parseInt(decoded.role) >= 1) {
            // Prosegui con la richiesta
            next();
        } else {
            // Se l'utente non è un cliente, restituisci un errore
            return res.status(403).json({ message: 'Non sei autorizzato ad accedere a questa risorsa' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Token di autenticazione non valido' });
    }
}

// Middleware per verificare se l'utente è autenticato come amministratore
function verificaAdmin(req, res, next) {
    // Leggi il token di autenticazione dal localStorage del browser
    const token = req.header('Authorization') || req.query.token || req.body.token || req.cookies.token || req.headers['x-access-token'] || req.headers['authorization'];

    // Verifica se il token è presente
    if (!token) {
        return res.status(401).json({ message: 'Token di autenticazione non fornito' });
    }

    try {
        // Verifica il token utilizzando la chiave segreta
        const decoded = jwt.verify(token, 'secret');

        // Aggiungi le informazioni utente decodificate all'oggetto della richiesta
        req.user = decoded;

        // Verifica se l'utente è un amministratore
        if (parseInt(decoded.role) >= 2) {
            // Prosegui con la richiesta
            next();
        } else {
            // Se l'utente non è un amministratore, restituisci un errore
            return res.status(403).json({ message: 'Non sei autorizzato ad accedere a questa risorsa' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Token di autenticazione non valido' });
    }
}

// Middleware per verificare se l'utente è autenticato come super amministratore
function verificaSuperAdmin(req, res, next) {
    // Leggi il token di autenticazione dal localStorage del browser
    const token = req.header('Authorization') || req.query.token || req.body.token || req.cookies.token || req.headers['x-access-token'] || req.headers['authorization'];

    // Verifica se il token è presente
    if (!token) {
        return res.status(401).json({ message: 'Token di autenticazione non fornito' });
    }

    try {
        // Verifica il token utilizzando la chiave segreta
        const decoded = jwt.verify(token, 'secret');

        // Aggiungi le informazioni utente decodificate all'oggetto della richiesta
        req.user = decoded;

        // Verifica se l'utente è un super amministratore
        if (parseInt(decoded.role) === 3) {
            // Prosegui con la richiesta
            next();
        } else {
            // Se l'utente non è un super amministratore, restituisci un errore
            return res.status(403).json({ message: 'Non sei autorizzato ad accedere a questa risorsa' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Token di autenticazione non valido' });
    }
}

module.exports = { verificaCliente, verificaAdmin, verificaSuperAdmin };