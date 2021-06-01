var numEleList;
numEleList = document.querySelectorAll('.number');

window.addEventListener("load", function() {
    fetchAndCountNum('nhan-khau', 0);
    fetchAndCountNum('ho-khau', 1);
    fetchAndCountNum('khai-bao', 2);
    fetchAndCountNum('test-covid', 3);
    fetchAndCountNum(encodeURI('test-covid?ketQua=DƯƠNG+TÍNH'), 4);
    fetchAndCountNum('cach-ly', 5);
});

async function fetchAndCountNum(path, index) {
    return fetch('/api/' + path).then(res => res.json()).then(res => {
        let count = -1;
        let interval = setInterval(() => {
            if (count > res.result.length - 2) clearInterval(interval);
            count++;
            if (count < 10) count = '0' + count;
            numEleList[index].innerHTML = count;
            count = Number(count);
        }, 100)
        socket.on(path + ':change', (number) => {
            number += Number(numEleList[index].innerText);
            if (number < 10) number = '0' + number;
            numEleList[index].innerHTML = number;
        })
    });
}