
window.addEventListener("load", function(){
    let numEleList = document.querySelectorAll('.number');
    
    const fetchAndCountNum = async (url, index) => {
        return fetch(url).then(res => res.json()).then(res => {
            let count = -1;
            let interval = setInterval(() => {
                if (count > res.result.length-2) clearInterval(interval);
                count++;
                if (count<10) count = '0' + count;
                numEleList[index].innerHTML = count;
                count = Number(count);
                console.log(index, count, res.result.length);
            }, 100)
        });
    }
    
    fetchAndCountNum('/api/nhan-khau', 0);
    fetchAndCountNum('/api/ho-khau', 1);
    fetchAndCountNum('/api/khai-bao', 2);
    fetchAndCountNum('/api/test-covid', 3);
    fetchAndCountNum(encodeURI('/api/test-covid?ketQua=DƯƠNG+TÍNH'), 4);
    fetchAndCountNum('/api/cach-ly', 5);
});