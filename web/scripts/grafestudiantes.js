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

    var ctxLine = document.getElementById('graficoEstadisticasLine').getContext('2d');
    new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [
                {
                    label: 'Presentes',
                    data: presentes,
                    borderColor: '#6ebd99',
                    fill: false
                },
                {
                    label: 'Ausentes',
                    data: ausentes,
                    borderColor: '#ee746e',
                    fill: false
                },
                {
                    label: 'Retrasos',
                    data: retrasos,
                    borderColor: '#ddaf6f',
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

    var totalAsistencias = presentes.reduce((a, b) => a + b, 0);
    var totalAusentes = ausentes.reduce((a, b) => a + b, 0);
    var totalRetrasos = retrasos.reduce((a, b) => a + b, 0);

    var ctxBar = document.getElementById('graficoEstadisticasBar').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Presentes', 'Ausentes', 'Retrasos'],
            datasets: [{
                label: 'Totales',
                data: [totalAsistencias, totalAusentes, totalRetrasos],
                backgroundColor: ['#92DBD8', '#92DBD8', '#92DBD8']
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    var ctxPie = document.getElementById('graficoEstadisticasPie').getContext('2d');
    new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: ['Presentes', 'Ausentes', 'Retrasos'],
            datasets: [{
                label: 'Distribución',
                data: [totalAsistencias, totalAusentes, totalRetrasos],
                backgroundColor: ['#6ebd99', '#ee746e', '#ddaf6f']
            }]
        },
        options: {
            responsive: true
        }
    });

    var ctxRadar = document.getElementById('graficoEstadisticasRadar').getContext('2d');
    new Chart(ctxRadar, {
        type: 'radar',
        data: {
            labels: ['Presentes', 'Ausentes', 'Retrasos'],
            datasets: [{
                label: 'Totales',
                data: [totalAsistencias, totalAusentes, totalRetrasos],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
            }]
        },
        options: {
            responsive: true
        }
    });
}
