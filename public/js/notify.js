let toast = new bootstrap.Toast(document.getElementById('alertToast'), {
    delay: 3000
});
let toastContent = document.getElementById('toastContent');
function notify(message) {
    toastContent.innerHTML = message;
    toast.show();
    
}