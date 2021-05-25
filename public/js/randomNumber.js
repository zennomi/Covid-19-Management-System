
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
    fetchAndCountNum('/api/khai-bao', 2);
    fetchAndCountNum('/api/test-covid', 3);
    fetchAndCountNum('/api/cach-ly', 5);
});