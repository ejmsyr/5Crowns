
document.getElementById('login-btn').addEventListener('click', function () {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (password==="1"&&username!="") {
        window.location.href = 'game.html';

    } else {
        window.close();
    }
});

