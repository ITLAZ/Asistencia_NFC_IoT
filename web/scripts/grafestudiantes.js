function formatearFecha(fecha) {
    var date = new Date(fecha);
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

function generarGraficoEstadisticas(asistencias) {
    var fechas = [];
    var presentes = [];
    var ausentes = [];
    var retrasos = [];

    asistencias.forEach(a => {
        fechas.push(formatearFecha(a.fecha));
        presentes.push(a.estado === 'Presente' ? 1 : 0);
        ausentes.push(a.estado === 'Ausente' ? 1 : 0);
        retrasos.push(a.estado === 'Tarde' ? 1 : 0);
    });

    var ctx = document.getElementById('graficoEstadisticas').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [
                {
                    label: 'Presentes',
                    data: presentes,
                    borderColor: 'green',
                    fill: false
                },
                {
                    label: 'Ausentes',
                    data: ausentes,
                    borderColor: 'red',
                    fill: false
                },
                {
                    label: 'Retrasos',
                    data: retrasos,
                    borderColor: 'orange',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'category',
                    labels: fechas
                }
            }
        }
    });
}
