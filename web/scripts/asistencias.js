document.addEventListener('DOMContentLoaded', function () {
    const materiaSelect = document.getElementById('materia');
    const fechaInput = document.getElementById('fecha');
    const estadoSelect = document.getElementById('estado');

    function fetchMaterias() {
        fetch('/materias')
            .then(response => response.json())
            .then(data => {
                data.forEach(materia => {
                    const option = document.createElement('option');
                    option.value = materia.id_materia;
                    option.text = materia.asignatura;
                    materiaSelect.appendChild(option);
                });

                // Seleccionar la primera materia por defecto y cargar asistencias
                if (data.length > 0) {
                    materiaSelect.value = data[1].id_materia;
                    getAsistencias();
                }
            })
            .catch(error => console.error('Error fetching materias:', error));
    }

    // Función para obtener asistencias y mostrarlas en la tabla
    function getAsistencias() {
        const materiaId = materiaSelect.value;
        const fecha = fechaInput.value;
        const estado = estadoSelect.value;

        if (!materiaId || !fecha) {
            alert('Seleccione una materia y una fecha');
            return;
        }

        let url = `/asistencias/${materiaId}/${fecha}`;
        if (estado) {
            url += `/${estado}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const asistenciasTbody = document.getElementById('asistencias');
                asistenciasTbody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos
                data.forEach(asistencia => {
                    const row = document.createElement('tr');

                    const ciCell = document.createElement('td');
                    ciCell.textContent = asistencia.ci;
                    row.appendChild(ciCell);

                    const nameCell = document.createElement('td');
                    nameCell.textContent = `${asistencia.nombre} ${asistencia.apellido}`;
                    row.appendChild(nameCell);

                    const emailCell = document.createElement('td');
                    emailCell.textContent = asistencia.correo;
                    row.appendChild(emailCell);

                    const entryCell = document.createElement('td');
                    entryCell.textContent = asistencia.entrada;
                    row.appendChild(entryCell);

                    const exitCell = document.createElement('td');
                    exitCell.textContent = asistencia.salida;
                    row.appendChild(exitCell);

                    const statusCell = document.createElement('td');
                    statusCell.textContent = asistencia.estado;
                    row.appendChild(statusCell);

                    asistenciasTbody.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching asistencias:', error));
    }

    // Event listeners para los filtros
    materiaSelect.addEventListener('change', getAsistencias);
    fechaInput.addEventListener('change', getAsistencias);
    estadoSelect.addEventListener('change', getAsistencias);

    // Cargar materias y datos iniciales
    fetchMaterias();
});
