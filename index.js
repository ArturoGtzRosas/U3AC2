const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const jsonParser = bodyParser.json();

const db = new sqlite3.Database('./base.sqlite3', (err) => {
    if (err) {
        console.error(err.message);
    }
    db.run(`CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        todo TEXT NOT NULL,
        created_at INTEGER
    )`);
});

// --- ENDPOINTS ---

// INSERTAR TAREA
app.post('/insert', jsonParser, function (req, res) {
    const { todo } = req.body;
    if (!todo) {
        return res.status(400).send({ error: 'Falta información necesaria' });
    }
    const stmt = db.prepare('INSERT INTO todos (todo, created_at) VALUES (?, CURRENT_TIMESTAMP)');
    stmt.run(todo, function(err) {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).json({ id: this.lastID, message: 'Insert was successful' });
    });
    stmt.finalize();
});

// LISTAR TAREAS (Agregado para cumplir con el requisito)
app.get('/todos', function (req, res) {
    db.all('SELECT * FROM todos', [], (err, rows) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(rows);
    });
});

app.get('/', function (req, res) {
    res.status(200).json({ 'status': 'ok' });
});

app.post('/login', jsonParser, function (req, res) {
    res.status(200).json({ 'status': 'ok' });
});

// --- INICIO DEL SERVIDOR ---
if (require.main === module) {
    // La variable port configurada según el estándar de Render
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Aplicación corriendo en http://localhost:${port}`);
    });
}

module.exports = { app: app, db };