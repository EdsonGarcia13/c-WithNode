const express = require('express');
const { execFile } = require('child_process');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

const fetchData = (table, res) => {
    execFile('./database_connection', [table], (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Server Error');
        }
        res.type('application/json');
        res.send(stdout);
    });
};

app.get('/data/empleados', (req, res) => fetchData('empleados', res));
app.get('/data/centros', (req, res) => fetchData('centros', res));
app.get('/data/directivos', (req, res) => fetchData('directivos', res));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});