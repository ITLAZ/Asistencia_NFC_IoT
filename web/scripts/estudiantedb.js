const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_nfc'
});

connection.connect();

function getEstudiantesByMateria(materiaId, callback) {
    const query = `
        SELECT Persona.id_persona, Persona.ci, Persona.correo, Persona.nombre, Persona.apellido, Carrera.nombre AS carrera, Materia.asignatura, Materia.sigla, Materia.paralelo, Materia.id_materia
        FROM Persona
        INNER JOIN Materia_Persona ON Persona.id_persona = Materia_Persona.Persona_id_persona
        INNER JOIN Materia ON Materia_Persona.Materia_id_materia = Materia.id_materia
        INNER JOIN Carrera ON Materia_Persona.Carrera_id_carrera = Carrera.id_carrera
        WHERE Materia.id_materia = ?
    `;

    connection.query(query, [materiaId], (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}

function getEstudiante(estudianteId, materiaId, callback) {
    const query = `
        SELECT Persona.ci, Persona.correo, Persona.nombre, Persona.apellido, Carrera.nombre AS carrera
        FROM Persona
        INNER JOIN Materia_Persona ON Persona.id_persona = Materia_Persona.Persona_id_persona
        INNER JOIN Materia ON Materia_Persona.Materia_id_materia = Materia.id_materia
        INNER JOIN Carrera ON Materia_Persona.Carrera_id_carrera = Carrera.id_carrera
        WHERE Materia.id_materia = 1 AND Persona.id_persona = ?;
    `;

    connection.query(query, [estudianteId, materiaId], (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}


function getAsistenciasFaltasRetrasos(estudianteId, materiaId, callback) {
    // Query para obtener asistencias, faltas y retrasos del estudiante en la materia
    const query = `
        SELECT
            a.fecha,
            a.entrada,
            a.salida,
            a.estado
        FROM
            Asistencia a
        INNER JOIN
            Persona p ON a.Persona_id_persona = p.id_persona
        INNER JOIN
            Clase c ON a.Clase_id_clase = c.id_clase
        INNER JOIN
            Materia m ON c.Materia_id_materia = m.id_materia
        WHERE
            p.id_persona = ?
            AND m.id_materia = ?
        ORDER BY
            a.fecha;
    `;

    connection.query(query, [estudianteId, materiaId], (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}


function getAsistencias(estudianteId, materiaId, callback) {
    const query = `
        SELECT
            a.fecha,
            a.entrada,
            a.salida,
            a.estado
        FROM
            Asistencia a
        INNER JOIN
            Persona p ON a.Persona_id_persona = p.id_persona
        INNER JOIN
            Clase c ON a.Clase_id_clase = c.id_clase
        INNER JOIN
            Materia m ON c.Materia_id_materia = m.id_materia
        WHERE
            p.id_persona = ?
            AND m.id_materia = ?
            AND a.estado = 'Presente'
        ORDER BY
            a.fecha;
        
    `;

    connection.query(query, [estudianteId, materiaId], (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}


function getFaltas(estudianteId, materiaId, callback) {
    const query = `
        SELECT
            a.fecha,
            a.entrada,
            a.salida,
            a.estado
        FROM
            Asistencia a
        INNER JOIN
            Persona p ON a.Persona_id_persona = p.id_persona
        INNER JOIN
            Clase c ON a.Clase_id_clase = c.id_clase
        INNER JOIN
            Materia m ON c.Materia_id_materia = m.id_materia
        WHERE
            p.id_persona = ?
            AND m.id_materia = ?
            AND a.estado = 'Ausente'
        ORDER BY
            a.fecha;
        
    `;

    connection.query(query, [estudianteId, materiaId], (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}

function getRetrasos(estudianteId, materiaId, callback) {
    const query = `
        SELECT
            a.fecha,
            a.entrada,
            a.salida,
            a.estado
        FROM
            Asistencia a
        INNER JOIN
            Persona p ON a.Persona_id_persona = p.id_persona
        INNER JOIN
            Clase c ON a.Clase_id_clase = c.id_clase
        INNER JOIN
            Materia m ON c.Materia_id_materia = m.id_materia
        WHERE
            p.id_persona = ?
            AND m.id_materia = ?
            AND a.estado = 'Tarde'
        ORDER BY
            a.fecha;
        
    `;

    connection.query(query, [estudianteId, materiaId], (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}


module.exports = {
    getEstudiantesByMateria: getEstudiantesByMateria,
    getAsistenciasFaltasRetrasos: getAsistenciasFaltasRetrasos,
    getAsistencias: getAsistencias,
    getFaltas: getFaltas,
    getRetrasos: getRetrasos,
    getEstudiante: getEstudiante
};