const jwt = require('jsonwebtoken');

// Middleware per verificare se l'utente è autenticato
function verificaAutenticazione(req, res, next) {
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

        // Prosegui con la richiesta
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token di autenticazione non valido' });
    }
}

module.exports = verificaAutenticazione