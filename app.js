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
    host: 'b7nq9vuk5khbgml2fuci-mysql.services.clever-cloud.com',
    database: 'b7nq9vuk5khbgml2fuci',
    user: 'u4g9r0u8rshde3fp',
    password: 'jRHcgafaYZroFK6Yd9hX'
});

/*var connection = mysql.createConnection({
    host: 'localhost',
    database: 'db_nfc',
    user: 'root',
    password: ''
});*/

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

app.get('/asistencias/:materiaId/:fecha', (req, res) => {
    const materiaId = req.params.materiaId;
    const fecha = req.params.fecha; // Fecha específica en el formato 'YYYY-MM-DD'

    const query = `
        SELECT p.ci, p.nombre, p.apellido, p.correo, a.fecha, a.entrada, a.salida, a.estado
        FROM Asistencia a
        JOIN Persona p ON a.Persona_id_persona = p.id_persona
        JOIN Clase c ON a.Clase_id_clase = c.id_clase
        WHERE c.Materia_id_materia = ? AND a.fecha = ?
    `;

    connection.query(query, [materiaId, fecha], (err, results) => {
        if (err) {
            console.error('Error fetching attendance:', err);
            res.status(500).json({ error: 'Error fetching attendance' });
            return;
        }
        res.json(results);
    });
});

// Ruta para obtener asistencias de todos los estudiantes en una materia específica en una fecha específica, con opción de filtrar por estado
app.get('/asistencias/:materiaId/:fecha/:estado?', (req, res) => {
    const { materiaId, fecha, estado } = req.params;

    let query = `
        SELECT p.ci, p.nombre, p.apellido, p.correo, a.entrada, a.salida, a.estado
        FROM Asistencia a
        JOIN Persona p ON a.Persona_id_persona = p.id_persona
        JOIN Clase c ON a.Clase_id_clase = c.id_clase
        WHERE c.Materia_id_materia = ? AND a.fecha = ?`;

    let queryParams = [materiaId, fecha];

    if (estado) {
        query += ' AND a.estado = ?';
        queryParams.push(estado);
    }

    connection.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error fetching asistencias:', err);
            res.status(500).json({ error: 'Error fetching asistencias' });
            return;
        }
        res.json(results);
    });
});


app.get('/materias', (req, res) => {
    const query = 'SELECT id_materia, asignatura FROM Materia';
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching materias:', err);
            res.status(500).json({ error: 'Error fetching materias' });
            return;
        }
        res.json(results);
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

app.get('/dash/asistencia/estudiantes/:materiaId', (req, res) => {
    const materiaId = req.params.materiaId;
    estfunc.getAsistenciasPorEstudiante(materiaId, (err, results) => { // Reemplaza 1 con el ID de tu materia
        if (err) {
            res.status(500).json({ error: 'Error fetching data' });
            return;
        }

        const labels = results.map(row => `${row.nombre} ${row.apellido}`);
        const values = results.map(row => row.asistencias);
        res.json({ labels, values });
    });
});

app.get('/dash/asistencia/tendencia/:materiaId', (req, res) => {
    const materiaId = req.params.materiaId;
    estfunc.getTendenciaAsistencia(materiaId, (err, results) => { // Reemplaza 1 con el ID de tu materia
        if (err) {
            res.status(500).json({ error: 'Error fetching data' });
            return;
        }

        const labels = results.map(row => row.fecha);
        const values = results.map(row => row.asistencias);
        res.json({ labels, values });
    });
});

app.get('/dash/asistencia/porcentaje/:materiaId', (req, res) => {
    const materiaId = req.params.materiaId;
    estfunc.getPorcentajeAsistencia(materiaId, (err, results) => { // Reemplaza 1 con el ID de tu materia
        if (err) {
            res.status(500).json({ error: 'Error fetching data' });
            return;
        }

        const labels = results.map(row => row.estado);
        const values = results.map(row => row.cantidad);
        res.json({ labels, values });
    });
});

app.get('/dash/asistencia/mes/:materiaId', (req, res) => {
    const materiaId = req.params.materiaId;
    estfunc.getAsistenciasPorMes(materiaId, (err, results) => { // Reemplaza 1 con el ID de tu materia
        if (err) {
            res.status(500).json({ error: 'Error fetching data' });
            return;
        }

        const labels = results.map(row => row.mes);
        const presentes = results.map(row => row.presentes);
        const ausentes = results.map(row => row.ausentes);
        const retrasos = results.map(row => row.retrasos);
        res.json({ labels, presentes, ausentes, retrasos });
    });
});

app.get('/dash/asistencia/dia-apilado/:materiaId', (req, res) => {
    const materiaId = req.params.materiaId;
    estfunc.getAsistenciasPorDiaApilado(materiaId, (err, results) => { // Reemplaza 1 con el ID de tu materia
        if (err) {
            res.status(500).json({ error: 'Error fetching data' });
            return;
        }

        const labels = results.map(row => row.fecha);
        const presentes = results.map(row => row.presentes);
        const ausentes = results.map(row => row.ausentes);
        const retrasos = results.map(row => row.retrasos);
        res.json({ labels, presentes, ausentes, retrasos });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Server running on port: ' + PORT);
    console.log('http://localhost:' + PORT);
});