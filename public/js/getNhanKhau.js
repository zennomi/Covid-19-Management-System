var input = document.getElementById('soCCCDInput');
let submitBtn = document.getElementById('submitBtn');

input.addEventListener('blur', (e) => {
    fetch('/api/nhan-khau/' + input.value)
        .then(res => res.json())
        .then(res => {
            if (res.nhanKhau) {
                notify(`Tìm thấy nhân khẩu có số CMT/CCCD là ${input.value}.`);
                let nhanKhau = res.nhanKhau;
                document.querySelector('input[name="hoVaTen"]').value = nhanKhau.hoVaTen;
                document.querySelector('input[name="namSinh"]').value = (new Date(nhanKhau.namSinh)).toISOString().slice(0, 10);
                submitBtn.disabled = false;
            } else {
                notify(`Không tìm thấy nhân khẩu có số CMT/CCCD là ${input.value}. Vui lòng nhập lại.`);
                submitBtn.disabled = true;
            }
        });
})