var mysql = require('mysql');
var express = require('express');
var cors = require('cors');
var path = require('path');

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Server running on port: ' + PORT);
    console.log('http://localhost:' + PORT);
});