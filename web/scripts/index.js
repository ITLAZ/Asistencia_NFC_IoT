const tabla = document.getElementById('asistencias');
document.addEventListener('DOMContentLoaded', (event) => {

    if (tabla) {
        function getData() {
            fetch('http://localhost:3000/all', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                let output = '';
                data.forEach(function(datos) {
                    output += `
                    <tr>
                        <td>${datos.id}</td>
                        <td>${datos.dni}</td>
                        <td>${datos.nombre}</td>
                        <td>${datos.apellido}</td>
                        <td>${datos.hora_de_llegada}</td>
                        <td>${datos.estado}</td>
                    </tr>
                    `;
                });
                tabla.innerHTML = output;
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        }

        // Llama a getData cada 5 segundos (5000 milisegundos)
        getData();
        setInterval(getData, 5000); // Actualiza cada 5 segundos
    } else {
        console.error('No element with id "asistencias" found.');
    }
});

const buttonPuntual = document.getElementById('puntual');
const buttonTarde = document.getElementById('tarde');

if (buttonPuntual) {
    buttonPuntual.addEventListener('click', () => {
        const randomData = generateRandomData('presente'); // Generar un dato aleatorio con estado puntual
        fetch('http://localhost:3000/add', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(randomData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Aquí puedes manejar la respuesta del servidor después de hacer el POST
            console.log(data);
            getData(); // Actualiza los datos después de añadir un nuevo registro
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    });
} else {
    console.error('No element with id "puntual" found.');
}

if (buttonTarde) {
    buttonTarde.addEventListener('click', () => {
        const randomData = generateRandomData('atraso'); // Generar un dato aleatorio con estado tarde
        fetch('http://localhost:3000/add', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(randomData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Aquí puedes manejar la respuesta del servidor después de hacer el POST
            console.log(data);
            getData(); // Actualiza los datos después de añadir un nuevo registro
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    });
} else {
    console.error('No element with id "tarde" found.');
}

function generateRandomData(state) {
    const names = ['Juan', 'Maria', 'Luis', 'Ana', 'Pedro'];
    const surnames = ['Perez', 'Gomez', 'Fernandez', 'Lopez', 'Martinez'];
    const dni = `${Math.floor(10000000 + Math.random() * 90000000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const nombre = names[Math.floor(Math.random() * names.length)];
    const apellido = surnames[Math.floor(Math.random() * surnames.length)];
    let hora_de_llegada;

    if (state === 'puntual') {
        hora_de_llegada = generateRandomTime('07:15:00', '07:30:00'); // Generar hora antes de las 07:30
    } else {
        hora_de_llegada = generateRandomTime('07:30:01', '08:00:00'); // Generar hora después de las 07:30
    }

    const estado = state;

    return {
        dni,
        nombre,
        apellido,
        hora_de_llegada,
        estado
    };
}

function generateRandomTime(start, end) {
    const startTime = new Date(`1970-01-01T${start}Z`).getTime();
    const endTime = new Date(`1970-01-01T${end}Z`).getTime();
    const randomTime = new Date(startTime + Math.random() * (endTime - startTime));
    return randomTime.toISOString().substr(11, 8);
}

const searchInput = document.getElementById('search');

if (searchInput) {
    let searchValue = '';

    searchInput.addEventListener('input', () => {
        searchValue = searchInput.value.trim().toLowerCase();
        updateTable();
    });

    function updateTable() {
        const rows = tabla.getElementsByTagName('tr');

        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            let found = false;

            for (let j = 0; j < cells.length; j++) {
                const cellValue = cells[j].textContent.toLowerCase();

                if (cellValue.includes(searchValue)) {
                    found = true;
                    break;
                }
            }

            if (found) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
}