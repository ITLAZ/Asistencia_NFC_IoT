const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'b7nq9vuk5khbgml2fuci-mysql.services.clever-cloud.com',
    database: 'b7nq9vuk5khbgml2fuci',
    user: 'u4g9r0u8rshde3fp',
    password: 'jRHcgafaYZroFK6Yd9hX'
});
/*const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_nfc'
});*/

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
        WHERE Persona.id_persona = ? AND Materia.id_materia = ?;
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
            AND a.estado = 'presente'
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
            AND a.estado = 'ausente'
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
            AND a.estado = 'atraso'
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

function getAsistenciasPorEstudiante(materiaId, callback) {
    const query = `
    SELECT p.nombre, p.apellido, COUNT(a.id_asistencia) AS asistencias
    FROM Persona p
    JOIN Asistencia a ON p.id_persona = a.Persona_id_persona
    JOIN Clase c ON a.Clase_id_clase = c.id_clase
    WHERE c.Materia_id_materia = ?
    GROUP BY p.nombre, p.apellido;
    `;

    connection.query(query, [materiaId], (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}


function getTendenciaAsistencia(materiaId, callback) {
    const query = `
    SELECT a.fecha, COUNT(a.id_asistencia) AS asistencias
    FROM Asistencia a
    JOIN Clase c ON a.Clase_id_clase = c.id_clase
    WHERE c.Materia_id_materia = ?
    GROUP BY a.fecha
    ORDER BY a.fecha;
    `;

    connection.query(query, [materiaId], (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}

function getPorcentajeAsistencia(materiaId, callback) {
    const query = `
    SELECT a.estado, COUNT(a.id_asistencia) AS cantidad
    FROM Asistencia a
    JOIN Clase c ON a.Clase_id_clase = c.id_clase
    WHERE c.Materia_id_materia = ?
    GROUP BY a.estado;
    `;

    connection.query(query, [materiaId], (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}
function getAsistenciasPorMes(materiaId, callback) {
    const query = `
    SELECT DATE_FORMAT(a.fecha, '%Y-%m') AS mes, 
    SUM(CASE WHEN a.estado = 'presente' THEN 1 ELSE 0 END) AS presentes,
    SUM(CASE WHEN a.estado = 'ausente' THEN 1 ELSE 0 END) AS ausentes,
    SUM(CASE WHEN a.estado = 'atraso' THEN 1 ELSE 0 END) AS retrasos
FROM Asistencia a
JOIN Clase c ON a.Clase_id_clase = c.id_clase
WHERE c.Materia_id_materia = ?
GROUP BY mes
ORDER BY mes;
    `;

    connection.query(query, [materiaId], (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}

function getAsistenciasPorDiaApilado(materiaId, callback) {
    const query = `
    SELECT a.fecha,
    SUM(CASE WHEN a.estado = 'presente' THEN 1 ELSE 0 END) AS presentes,
    SUM(CASE WHEN a.estado = 'ausente' THEN 1 ELSE 0 END) AS ausentes,
    SUM(CASE WHEN a.estado = 'atraso' THEN 1 ELSE 0 END) AS retrasos
FROM Asistencia a
JOIN Clase c ON a.Clase_id_clase = c.id_clase
WHERE c.Materia_id_materia = ?
GROUP BY a.fecha
ORDER BY a.fecha;
    `;

    connection.query(query, [materiaId], (error, results) => {
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
    getEstudiante: getEstudiante,
    getAsistenciasPorEstudiante:getAsistenciasPorEstudiante,
    getTendenciaAsistencia:getTendenciaAsistencia,
    getPorcentajeAsistencia:getPorcentajeAsistencia,
    getAsistenciasPorMes:getAsistenciasPorMes,
    getAsistenciasPorDiaApilado:getAsistenciasPorDiaApilado
};