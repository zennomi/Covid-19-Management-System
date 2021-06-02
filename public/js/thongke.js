async function fetchAndHandle(path, handle) {
    fetch(path).then(res => res.json()).then(res => {
        handle(res);
    })
}

fetchAndHandle('/api/khai-bao/', (res) => {
    let bieuHienData = {};
    res.result.forEach(cl => {
        cl.bieuHien.forEach(bh => {
            if (!bieuHienData[bh]) bieuHienData[bh] = 0;
            bieuHienData[bh]++;
        })
    })
    let benhNenData = {};
    res.result.forEach(cl => {
        cl.benhNen.forEach(bh => {
            if (!benhNenData[bh]) benhNenData[bh] = 0;
            benhNenData[bh]++;
        })
    })
    let delayed1, delayed2;
    var bieuHienChart = new Chart(
        document.getElementById('bieuHienChart'), {
            type: 'bar',
            data: {
                labels: Object.keys(bieuHienData),
                datasets: [{
                    label: 'Thống kê các biểu hiện',
                    data: Object.values(bieuHienData),
                    backgroundColor: '#999da3',
                    borderColor: '#212529',
                    borderRadius: 5,
                    borderWidth: 2
                }]
            },
            options: {
                animation: {
                    onComplete: () => {
                        delayed = true;
                    },
                    delay: (context) => {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default' && !delayed1) {
                            delay = context.dataIndex * 300 + context.datasetIndex * 100;
                        }
                        return delay;
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            // forces step size to be 50 units
                            stepSize: 1
                        }
                    }
                }
            },
        }
    );
    var benhNenChart = new Chart(
        document.getElementById('benhNenChart'), {
            type: 'bar',
            data: {
                labels: Object.keys(benhNenData),
                datasets: [{
                    label: 'Thống kê các bệnh nền',
                    data: Object.values(benhNenData),
                    backgroundColor: '#999da3',
                    borderColor: '#212529',
                    borderRadius: 5,
                    borderWidth: 2
                }]
            },
            options: {
                animation: {
                    onComplete: () => {
                        delayed = true;
                    },
                    delay: (context) => {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default' && !delayed2) {
                            delay = context.dataIndex * 300 + context.datasetIndex * 100;
                        }
                        return delay;
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            // forces step size to be 50 units
                            stepSize: 1
                        }
                    }
                }
            },
        }
    );
    socket.on('khai-bao:change', () => {
        fetchAndHandle('/api/khai-bao/', (res) => {
            bieuHienData = {};
            res.result.forEach(cl => {
                cl.bieuHien.forEach(bh => {
                    if (!bieuHienData[bh]) bieuHienData[bh] = 0;
                    bieuHienData[bh]++;
                })
            })
            benhNenData = {};
            res.result.forEach(cl => {
                cl.benhNen.forEach(bh => {
                    if (!benhNenData[bh]) benhNenData[bh] = 0;
                    benhNenData[bh]++;
                })
            })

            bieuHienChart.data.labels = Object.keys(bieuHienData);
            bieuHienChart.data.datasets[0] = {
                label: 'Thống kê các biểu hiện',
                data: Object.values(bieuHienData),
                backgroundColor: '#999da3',
                borderColor: '#212529',
                borderRadius: 5,
                borderWidth: 2
            };
            bieuHienChart.update();

            benhNenChart.data.labels = Object.keys(benhNenData);
            benhNenChart.data.datasets[0] = {
                label: 'Thống kê các biểu hiện',
                data: Object.values(benhNenData),
                backgroundColor: '#999da3',
                borderColor: '#212529',
                borderRadius: 5,
                borderWidth: 2
            };
            benhNenChart.update();
        })
    })
})

fetchAndHandle('/api/cach-ly/', (res) => {
    let noiCLData = {};
    let mucDoData = { 'F0': 0, 'F1': 0, 'F2': 0, 'F3': 0, 'F4': 0, 'F5': 0 };
    res.result.forEach(cl => {
        cl.noiCachLy = cl.noiCachLy.toUpperCase().trim();
        if (!noiCLData[cl.noiCachLy]) noiCLData[cl.noiCachLy] = 0;
        noiCLData[cl.noiCachLy]++;
        mucDoData[cl.mucDo]++;
    })
    var noiCachLyChart = new Chart(document.getElementById('noiCachLyChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(noiCLData),
            datasets: [{
                label: 'Thống kê nơi cách ly',
                data: Object.values(noiCLData),
                backgroundColor: ["#db504a", "#e3b505", "#8896ab", "#084c61", "#4f6d7a", "#56a3a6"],
                borderColor: '#fff',
                borderRadius: 5,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Nơi cách ly'
                }
            }
        },
    })
    var mucDoChart = new Chart(document.getElementById('mucDoChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(mucDoData),
            datasets: [{
                label: 'Thống kê các mức độ',
                data: Object.values(mucDoData),
                backgroundColor: ["#333333", "#643173", "#7d5ba6", "#86a59c", "#89ce94", "#c1dbe3"],
                borderColor: '#fff',
                borderRadius: 5,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Mức độ'
                }
            }
        },
    })
    socket.on('cach-ly:change', () => {
        fetchAndHandle('/api/cach-ly', (res) => {
            noiCLData = {};
            mucDoData = { 'F0': 0, 'F1': 0, 'F2': 0, 'F3': 0, 'F4': 0, 'F5': 0 };
            res.result.forEach(cl => {
                cl.noiCachLy = cl.noiCachLy.toUpperCase().trim();
                if (!noiCLData[cl.noiCachLy]) noiCLData[cl.noiCachLy] = 0;
                noiCLData[cl.noiCachLy]++;
                mucDoData[cl.mucDo]++;
            })
            mucDoChart.data.datasets[0].data = Object.values(mucDoData);
            mucDoChart.update();

            noiCachLyChart.data.labels = Object.keys(noiCLData);
            noiCachLyChart.data.datasets[0].data = Object.values(noiCLData);
            noiCachLyChart.update();
        })
    })
})