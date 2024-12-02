const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');

const app = express();
const port = 3000;

// MariaDB pool
const pool = mariadb.createPool({
    host: '192.168.1.44',
    user: 'Admin',
    password: 'qwaszxqw',
    database: 'Crowns',
    connectionLimit: 5
});

// Middleware
app.use(bodyParser.json());

// Route to get players
app.get('/api/players', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM players');
        res.json(rows);
        conn.end();
    } catch (err) {
        res.status(500).send(err.toString());
    }
});

// Route to add a player
app.post('/api/players', async (req, res) => {
    const { name } = req.body;
    try {
        const conn = await pool.getConnection();
        const result = await conn.query('INSERT INTO players (name) VALUES (?)', [name]);
        res.json({ id: result.insertId });
        conn.end();
    } catch (err) {
        res.status(500).send(err.toString());
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
