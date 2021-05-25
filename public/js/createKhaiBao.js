let input = document.getElementById('soCCCDInput');
let submitBtn = document.getElementById('submitBtn');

input.addEventListener('blur', (e) => {
    fetch('/api/nhan-khau?soCCCD='+input.value)
    .then(res => res.json())
    .then(res => {
        if (res.nhanKhau) {
            notify(`Tìm thấy nhân khẩu có số CMT/CCCD là ${input.value}.`);
            let nhanKhau = res.nhanKhau;
            document.querySelector('input[name="hoVaTen"]').value = nhanKhau.hoVaTen;
            document.querySelector('input[name="namSinh"]').value = (new Date(nhanKhau.namSinh)).toISOString().slice(0,10);
            document.querySelector('input[name="diaChi"]').value = nhanKhau.diaChi;
            document.querySelector('input[name="maHoKhau"]').value = nhanKhau.maHoKhau;
            submitBtn.disabled = false;
        } else {
            notify(`Không tìm thấy nhân khẩu có số CMT/CCCD là ${input.value}.`);
            submitBtn.disabled = true;
        }
    });
})