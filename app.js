var mysql = require('mysql');
var express = require('express');
var cors = require('cors');
var path = require('path');
const estfunc = require('./web/scripts/estudiantedb')

var app = express();

app.use(
    express.urlencoded({
        extended: true
    }
));

app.use(express.json({
    type: "*/*"
}));

app.use('/', express.static(path.join(__dirname, 'web')));

app.use(cors());

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'asistencia_mockup',
    user: 'root',
    password: ''
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    console.log('Connected at DB');
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'web/index.html'));
});

app.get('/all', function(req, res) {
    connection.query('SELECT * FROM asistencia', function(err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    });
});

app.post('/add', function(req, res) {
    let datos = req.body;
    connection.query('INSERT INTO asistencia SET ?', datos, function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});


// Ruta para obtener estudiantes por materia
app.get('/estudiantes/:materiaId', (req, res) => {
    const materiaId = req.params.materiaId;

    estfunc.getEstudiantesByMateria(materiaId, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching students, ola' });
            return;
        }
        res.json(results);
    });
});

// Ruta para obtener estudiante en especifico
app.get('/estudiante/:estudianteId/est/:materiaId', (req, res) => {
    const estudianteId = req.params.estudianteId;
    const materiaId = req.params.materiaId;

    estfunc.getEstudiante(estudianteId, materiaId, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching students, ola' });
            return;
        }
        res.json(results);
    });
});


// Ruta para obtener asistencias, faltas y retrasos de un estudiante en una materia
app.get('/estudiante/:estudianteId/asistencias-faltas-retrasos/:materiaId', (req, res) => {
    const estudianteId = req.params.estudianteId;
    const materiaId = req.params.materiaId;

    estfunc.getAsistenciasFaltasRetrasos(estudianteId, materiaId, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching attendance, absences, and delays' });
            return;
        }
        res.json(results);
    });
});


app.get('/estudiante/:estudianteId/asistencias/:materiaId', (req, res) => {
    const estudianteId = req.params.estudianteId;
    const materiaId = req.params.materiaId;

    estfunc.getAsistencias(estudianteId, materiaId, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching attendance' });
            return;
        }
        res.json(results);
    });
});

app.get('/estudiante/:estudianteId/retrasos/:materiaId', (req, res) => {
    const estudianteId = req.params.estudianteId;
    const materiaId = req.params.materiaId;

    estfunc.getRetrasos(estudianteId, materiaId, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching delays' });
            return;
        }
        res.json(results);
    });
});


app.get('/estudiante/:estudianteId/faltas/:materiaId', (req, res) => {
    const estudianteId = req.params.estudianteId;
    const materiaId = req.params.materiaId;

    estfunc.getFaltas(estudianteId, materiaId, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching absences' });
            return;
        }
        res.json(results);
    });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Server running on port: ' + PORT);
    console.log('http://localhost:' + PORT);
});