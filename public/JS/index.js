const myModal = new bootstrap.Modal("#register-modal");
let logged = sessionStorage.getItem("logged")
const session = localStorage.getItem("session")

checkLogged();



//LOGIN
document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;
    const checkSession = document.getElementById("session-check").checked;

    const accountFinded = getAccount(email);

    if (!accountFinded) {
        alert("Opps! Verifique o usuário ou a senha.")
        return;
    }

    if (accountFinded) {
        if (accountFinded.password != password) {
            alert("Opps! Verifique o usuário ou a senha.")
            return;

        }

        saveSession(email, checkSession);

        window.location.href = "home.html";
    }

});






//CREATE ACCOUNT
document.getElementById("create-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email-create-input").value;
    const password = document.getElementById("password-create-input").value;
    const confirmPassword = document.getElementById("password-confirm-input").value;

    if (email.length < 5) {
        alert("E-mail de formato inválido");
        return;
    }

    if (password.length < 6) {
        alert("Senha dever ter no mínimo 6 dígitos");
        return;
    }

    if (confirmPassword !== password) {
        alert("Senhas diferentes");
        return;
    }

    const user = {
        login: email,
        password: password,
        transactions: []
    }

    saveAccount(user);

    myModal.hide();

    alert("Conta criada com sucesso!");
});



//UTILS

function checkLogged() {
    if (session) {
        sessionStorage.setItem("logged", session);
        logged = session;

    }

    if (logged) {
        saveSession(logged, session);

        window.location.href = "home.html";
    }
}


function saveAccount(data) {
    localStorage.setItem(data.login, JSON.stringify(data));
}

function getAccount(key) {
    const account = localStorage.getItem(key);

    if (account) {
        return JSON.parse(account);
    }

    return "";
}

function saveSession(data, saveSession) {
    if (saveSession) {
        localStorage.setItem("session", data);
    }

    sessionStorage.setItem("logged", data);

}