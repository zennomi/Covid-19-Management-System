
fetch('/api/khai-bao/').then(res => res.json()).then(res => {
    let bieuHienData = {};
    res.result.forEach(cl => {
        cl.bieuHien.forEach(bh => {
            if (!bieuHienData[bh]) bieuHienData[bh] = 0;
            bieuHienData[bh]++;
        })
    })
    new Chart(
        document.getElementById('bieuHienChart'),
        {
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
    let benhNenData = {};
    res.result.forEach(cl => {
        cl.benhNen.forEach(bh => {
            if (!benhNenData[bh]) benhNenData[bh] = 0;
            benhNenData[bh]++;
        })
    })
    new Chart(
        document.getElementById('benhNenChart'),
        {
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
})


fetch('/api/cach-ly/').then(res => res.json()).then(res => {
    let noiCLData = {};
    let mucDoData = { 'F0': 0, 'F1': 0, 'F2': 0, 'F3': 0, 'F4': 0, 'F5': 0 };
    res.result.forEach(cl => {
        cl.noiCachLy = cl.noiCachLy.toUpperCase().trim();
        if (!noiCLData[cl.noiCachLy]) noiCLData[cl.noiCachLy] = 0;
        noiCLData[cl.noiCachLy]++;
        mucDoData[cl.mucDo]++;
    })
    new Chart(document.getElementById('noiCachLyChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(noiCLData),
                datasets: [{
                    label: 'Thống kê nơi cách ly',
                    data: Object.values(noiCLData),
                    backgroundColor: ["#db504a","#e3b505","#8896ab","#084c61","#4f6d7a","#56a3a6"],
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
    new Chart(document.getElementById('mucDoChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(mucDoData),
                datasets: [{
                    label: 'Thống kê các mức độ',
                    data: Object.values(mucDoData),
                    backgroundColor: ["#333333","#643173","#7d5ba6","#86a59c","#89ce94","#c1dbe3"],
                    borderColor: '#212529',
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
})