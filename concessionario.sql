-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Giu 23, 2024 alle 18:14
-- Versione del server: 10.4.28-MariaDB
-- Versione PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `concessionario`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `auto`
--

CREATE TABLE `auto` (
  `idAuto` int(11) NOT NULL,
  `targa` varchar(7) NOT NULL,
  `descrizione` varchar(255) NOT NULL,
  `potenza` int(11) NOT NULL,
  `chilometraggio` int(11) NOT NULL,
  `annoProduzione` int(11) NOT NULL,
  `cambio` varchar(20) NOT NULL,
  `peso` float NOT NULL,
  `usata` bit(1) DEFAULT b'0',
  `prezzo` float NOT NULL,
  `disponibile` bit(1) NOT NULL DEFAULT b'1',
  `dataAcquisto` date NOT NULL DEFAULT current_timestamp(),
  `idMarca` int(11) NOT NULL,
  `idCarburante` int(11) NOT NULL,
  `idModello` int(11) NOT NULL,
  `idColore` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `auto`
--

INSERT INTO `auto` (`idAuto`, `targa`, `descrizione`, `potenza`, `chilometraggio`, `annoProduzione`, `cambio`, `peso`, `usata`, `prezzo`, `disponibile`, `dataAcquisto`, `idMarca`, `idCarburante`, `idModello`, `idColore`) VALUES
(1, 'AB123CD', 'Toyota Corolla in ottime condizioni', 150, 50000, 2018, 'Manuale', 1200, b'0', 10000, b'1', '2024-05-11', 1, 1, 1, 1),
(2, 'EF456GH', 'Volkswagen Golf usata in buone condizioni', 140, 60000, 2017, 'Automatico', 1300, b'1', 20000, b'1', '2024-03-27', 2, 2, 2, 2),
(3, 'IJ789KL', 'Ford Focus in ottime condizioni', 160, 40000, 2019, 'Manuale', 1250, b'0', 30000, b'1', '2024-03-27', 3, 3, 3, 3),
(4, 'MN012OP', 'Honda Civic usata, leggeri segni di usura', 155, 55000, 2016, 'Manuale', 1180, b'1', 17000, b'1', '2024-03-27', 4, 1, 4, 4),
(5, 'QR345ST', 'Chevrolet Cruze usata, buone condizioni generali', 130, 70000, 2015, 'Manuale', 1250, b'1', 18500, b'1', '2024-03-27', 5, 1, 5, 5),
(6, 'UV678WX', 'Nissan Altima nuova di zecca', 150, 30000, 2020, 'Automatico', 1350, b'0', 21000, b'1', '2024-03-27', 6, 2, 6, 6),
(7, 'YZ901AB', 'BMW Serie 3, quasi nuova', 170, 25000, 2021, 'Automatico', 1400, b'0', 25000, b'1', '2024-03-27', 7, 1, 7, 7),
(8, 'CD234EF', 'Mercedes-Benz Classe C usata, ottime condizioni', 160, 45000, 2019, 'Automatico', 1300, b'1', 30000, b'1', '2024-03-27', 8, 2, 8, 8),
(9, 'GH567IJ', 'Audi A4 usata, leggeri segni di usura', 140, 80000, 2014, 'Manuale', 1200, b'1', 20000, b'1', '2024-03-27', 9, 1, 9, 9),
(10, 'KL890MN', 'Fiat 500 usata, ideale per la città', 120, 60000, 2016, 'Manuale', 1100, b'1', 15000, b'1', '2024-03-27', 10, 2, 10, 10);

-- --------------------------------------------------------

--
-- Struttura della tabella `carburanti`
--

CREATE TABLE `carburanti` (
  `idCarburante` int(11) NOT NULL,
  `carburante` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `carburanti`
--

INSERT INTO `carburanti` (`idCarburante`, `carburante`) VALUES
(1, 'Benzina'),
(2, 'Diesel'),
(3, 'Metano'),
(4, 'GPL (Gas di Petrolio Liquefatto)'),
(5, 'Elettrico'),
(6, 'Ibrido (Benzina/Elettrico)'),
(7, 'Idrogeno');

-- --------------------------------------------------------

--
-- Struttura della tabella `colori`
--

CREATE TABLE `colori` (
  `idColore` int(11) NOT NULL,
  `colore` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `colori`
--

INSERT INTO `colori` (`idColore`, `colore`) VALUES
(1, 'Bianco perlato'),
(2, 'Nero metallizzato'),
(3, 'Rosso fuoco'),
(4, 'Blu scuro metallizzato'),
(5, 'Grigio antracite'),
(6, 'Argento metallizzato'),
(7, 'Verde smeraldo'),
(8, 'Giallo sportivo'),
(9, 'Arancione metallizzato'),
(10, 'Bronzo');

-- --------------------------------------------------------

--
-- Struttura della tabella `immagini`
--

CREATE TABLE `immagini` (
  `idImmagine` int(11) NOT NULL,
  `immagine` varchar(255) NOT NULL,
  `idAuto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `immagini`
--

INSERT INTO `immagini` (`idImmagine`, `immagine`, `idAuto`) VALUES
(1, 'toyotaCorolla1.jpg', 1),
(2, 'toyotaCorolla2.jpg', 1),
(3, 'volkswagenGolf1.jpg', 2),
(4, 'volkswagenGolf2.jpg', 2),
(5, 'volkswagenGolf3.jpg', 2),
(6, 'toyotaCorolla3.jpg', 1),
(7, 'fordFocus1.jpg', 3),
(8, 'fordFocus2.jpg', 3),
(9, 'fordFocus3.jpg', 3);

-- --------------------------------------------------------

--
-- Struttura della tabella `magazzini`
--

CREATE TABLE `magazzini` (
  `idMagazzino` int(11) NOT NULL,
  `citta` varchar(50) NOT NULL,
  `via` varchar(100) NOT NULL,
  `capienza` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `magazzini`
--

INSERT INTO `magazzini` (`idMagazzino`, `citta`, `via`, `capienza`) VALUES
(1, 'Roma', 'Via Roma 123', 1000),
(2, 'Milano', 'Via Milano 456', 800),
(3, 'Napoli', 'Via Napoli 789', 1200),
(4, 'Torino', 'Via Torino 012', 600),
(5, 'Firenze', 'Via Firenze 345', 1500);

-- --------------------------------------------------------

--
-- Struttura della tabella `marche`
--

CREATE TABLE `marche` (
  `idMarca` int(11) NOT NULL,
  `marca` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `marche`
--

INSERT INTO `marche` (`idMarca`, `marca`) VALUES
(1, 'Toyota'),
(2, 'Volkswagen'),
(3, 'Ford'),
(4, 'Honda'),
(5, 'Chevrolet'),
(6, 'Nissan'),
(7, 'BMW'),
(8, 'Mercedes-Benz'),
(9, 'Audi'),
(10, 'Fiat');

-- --------------------------------------------------------

--
-- Struttura della tabella `modelli`
--

CREATE TABLE `modelli` (
  `idModello` int(11) NOT NULL,
  `modello` varchar(100) NOT NULL,
  `idMarca` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `modelli`
--

INSERT INTO `modelli` (`idModello`, `modello`, `idMarca`) VALUES
(1, 'Corolla', 1),
(2, 'Golf', 2),
(3, 'Focus', 3),
(4, 'Civic', 4),
(5, 'Cruze', 5),
(6, 'Altima', 6),
(7, '3 Series', 7),
(8, 'C-Class', 8),
(9, 'A4', 9),
(10, '500', 10);

-- --------------------------------------------------------

--
-- Struttura della tabella `notifiche`
--

CREATE TABLE `notifiche` (
  `idNotifica` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `messaggio` varchar(255) NOT NULL,
  `dataOra` datetime NOT NULL DEFAULT current_timestamp(),
  `idUtente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `notifiche`
--

INSERT INTO `notifiche` (`idNotifica`, `tipo`, `messaggio`, `dataOra`, `idUtente`) VALUES
(1, 'conferma', 'Il tuo appuntamento è stato confermato.', '2024-05-31 08:46:31', 2);

-- --------------------------------------------------------

--
-- Struttura della tabella `prenotazioni`
--

CREATE TABLE `prenotazioni` (
  `idPrenotazione` int(11) NOT NULL,
  `idUtente` int(11) NOT NULL,
  `idAuto` int(11) DEFAULT NULL,
  `data_ora` datetime NOT NULL,
  `stato` enum('Effettuata','In attesa','Accettata') NOT NULL DEFAULT 'In attesa',
  `dettagliPrenotazione` varchar(255) DEFAULT NULL,
  `dataOraCreazione` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `prenotazioni`
--

INSERT INTO `prenotazioni` (`idPrenotazione`, `idUtente`, `idAuto`, `data_ora`, `stato`, `dettagliPrenotazione`, `dataOraCreazione`) VALUES
(3, 2, 1, '2024-05-15 12:00:00', 'Accettata', NULL, '2024-05-12 20:08:21'),
(4, 2, 3, '2024-05-31 15:00:00', 'In attesa', NULL, '2024-05-15 08:45:32');

-- --------------------------------------------------------

--
-- Struttura della tabella `ruoli`
--

CREATE TABLE `ruoli` (
  `idRuolo` int(11) NOT NULL,
  `ruolo` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `ruoli`
--

INSERT INTO `ruoli` (`idRuolo`, `ruolo`) VALUES
(1, 'cliente'),
(2, 'admin'),
(3, 'superadmin');

-- --------------------------------------------------------

--
-- Struttura della tabella `utenti`
--

CREATE TABLE `utenti` (
  `idUtente` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(72) NOT NULL,
  `dataNascita` date NOT NULL,
  `dataRegistrazione` timestamp NOT NULL DEFAULT current_timestamp(),
  `idRuolo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `utenti`
--

INSERT INTO `utenti` (`idUtente`, `email`, `password`, `dataNascita`, `dataRegistrazione`, `idRuolo`) VALUES
(1, 'tribusimo@gmail.com', '$2b$10$yOjBgKYT3bACUWaVLjWkLeteBjDk2zv4KSHwasJzeYB4dFcLxRWCu', '2005-07-04', '2024-03-04 08:27:19', 1),
(2, 'ciao@gmail.com', '$2b$10$UJKP3bHVWxepLqPfRpkoy.FOjVHsWzLEpXVh8Y1aOKn4lwdzBmcxe', '2024-03-12', '2024-03-25 08:13:30', 2),
(4, 'superAdmin@gmail.com', '$2b$10$6JUYnb8YyU.bShFNgXv4ze4UAPeKi4oAvRYS7KthHH6M9tQPnYwdq', '2005-06-12', '2024-06-14 16:54:23', 3),
(5, 'emabrate05@gmail.com', '$2b$10$.sbHyzjnYEyghdyuyjujeuE6IjdgHujmlXGlaED4KwegqP.vAmPg.', '2024-06-10', '2024-06-22 20:37:13', 2),
(6, 'admin@gmail.com', '$2b$10$.oEJKRJ4uOYUHz6hZsBIP.1YGmG91erclDKAMJ56LUpig4TH1R0WC', '2024-06-03', '2024-06-22 20:40:58', 2),
(7, 'pietro.mellano12@gmail.com', '$2b$10$h/Nc/G3v84AI4os5/Rk7ge8v8yFqEkACMdfkUmR3lmEPMVq0iRKju', '2024-06-02', '2024-06-22 20:48:54', 2);

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `auto`
--
ALTER TABLE `auto`
  ADD PRIMARY KEY (`idAuto`),
  ADD KEY `idMarca` (`idMarca`),
  ADD KEY `idCarburante` (`idCarburante`),
  ADD KEY `idModello` (`idModello`),
  ADD KEY `idColore` (`idColore`);

--
-- Indici per le tabelle `carburanti`
--
ALTER TABLE `carburanti`
  ADD PRIMARY KEY (`idCarburante`);

--
-- Indici per le tabelle `colori`
--
ALTER TABLE `colori`
  ADD PRIMARY KEY (`idColore`);

--
-- Indici per le tabelle `immagini`
--
ALTER TABLE `immagini`
  ADD PRIMARY KEY (`idImmagine`),
  ADD KEY `fk_immagine_id` (`idAuto`);

--
-- Indici per le tabelle `magazzini`
--
ALTER TABLE `magazzini`
  ADD PRIMARY KEY (`idMagazzino`);

--
-- Indici per le tabelle `marche`
--
ALTER TABLE `marche`
  ADD PRIMARY KEY (`idMarca`);

--
-- Indici per le tabelle `modelli`
--
ALTER TABLE `modelli`
  ADD PRIMARY KEY (`idModello`),
  ADD KEY `fk_marca_id` (`idMarca`);

--
-- Indici per le tabelle `notifiche`
--
ALTER TABLE `notifiche`
  ADD PRIMARY KEY (`idNotifica`),
  ADD KEY `idUtente` (`idUtente`);

--
-- Indici per le tabelle `prenotazioni`
--
ALTER TABLE `prenotazioni`
  ADD PRIMARY KEY (`idPrenotazione`),
  ADD KEY `idUtente` (`idUtente`),
  ADD KEY `fk_idAuto` (`idAuto`);

--
-- Indici per le tabelle `ruoli`
--
ALTER TABLE `ruoli`
  ADD PRIMARY KEY (`idRuolo`);

--
-- Indici per le tabelle `utenti`
--
ALTER TABLE `utenti`
  ADD PRIMARY KEY (`idUtente`),
  ADD KEY `fk_ruolo` (`idRuolo`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `auto`
--
ALTER TABLE `auto`
  MODIFY `idAuto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT per la tabella `carburanti`
--
ALTER TABLE `carburanti`
  MODIFY `idCarburante` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT per la tabella `colori`
--
ALTER TABLE `colori`
  MODIFY `idColore` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT per la tabella `immagini`
--
ALTER TABLE `immagini`
  MODIFY `idImmagine` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT per la tabella `magazzini`
--
ALTER TABLE `magazzini`
  MODIFY `idMagazzino` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT per la tabella `marche`
--
ALTER TABLE `marche`
  MODIFY `idMarca` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT per la tabella `modelli`
--
ALTER TABLE `modelli`
  MODIFY `idModello` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT per la tabella `notifiche`
--
ALTER TABLE `notifiche`
  MODIFY `idNotifica` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT per la tabella `prenotazioni`
--
ALTER TABLE `prenotazioni`
  MODIFY `idPrenotazione` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `ruoli`
--
ALTER TABLE `ruoli`
  MODIFY `idRuolo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT per la tabella `utenti`
--
ALTER TABLE `utenti`
  MODIFY `idUtente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `auto`
--
ALTER TABLE `auto`
  ADD CONSTRAINT `auto_ibfk_1` FOREIGN KEY (`idMarca`) REFERENCES `marche` (`idMarca`),
  ADD CONSTRAINT `auto_ibfk_2` FOREIGN KEY (`idCarburante`) REFERENCES `carburanti` (`idCarburante`),
  ADD CONSTRAINT `auto_ibfk_3` FOREIGN KEY (`idModello`) REFERENCES `modelli` (`idModello`),
  ADD CONSTRAINT `auto_ibfk_4` FOREIGN KEY (`idColore`) REFERENCES `colori` (`idColore`);

--
-- Limiti per la tabella `immagini`
--
ALTER TABLE `immagini`
  ADD CONSTRAINT `fk_immagine_id` FOREIGN KEY (`idAuto`) REFERENCES `auto` (`idAuto`);

--
-- Limiti per la tabella `modelli`
--
ALTER TABLE `modelli`
  ADD CONSTRAINT `fk_marca_id` FOREIGN KEY (`idMarca`) REFERENCES `marche` (`idMarca`);

--
-- Limiti per la tabella `notifiche`
--
ALTER TABLE `notifiche`
  ADD CONSTRAINT `notifiche_ibfk_1` FOREIGN KEY (`idUtente`) REFERENCES `utenti` (`idUtente`);

--
-- Limiti per la tabella `prenotazioni`
--
ALTER TABLE `prenotazioni`
  ADD CONSTRAINT `fk_idAuto` FOREIGN KEY (`idAuto`) REFERENCES `auto` (`idAuto`),
  ADD CONSTRAINT `prenotazioni_ibfk_1` FOREIGN KEY (`idUtente`) REFERENCES `utenti` (`idUtente`);

--
-- Limiti per la tabella `utenti`
--
ALTER TABLE `utenti`
  ADD CONSTRAINT `fk_ruolo` FOREIGN KEY (`idRuolo`) REFERENCES `ruoli` (`idRuolo`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
