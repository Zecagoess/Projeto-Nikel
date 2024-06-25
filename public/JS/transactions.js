const myModal = new bootstrap.Modal("#transaction-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let data = {
    transactions: []
};
let saldo = 0;

document.getElementById("buttom-logout").addEventListener("click", logout);

function logout() {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");

    window.location.href = "index.html"
}

//CREATE TRANSACTION

document.getElementById("transaction-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const transactionType = document.querySelector('input[name="type-input"]:checked').value;



    const isCashOut = transactionType === "2";


    let newBalance = saldo;

    if (isCashOut) {
        newBalance -= value;
    } else {
        newBalance += value;
    }


    if (newBalance < 0) {

        if (confirm("Esta transação deixará seu saldo negativo. Deseja continuar?")) {
            saveTransaction();
        } else {
            return;
        }
    } else {
        saveTransaction();
    }


    function saveTransaction() {

        data.transactions.unshift({
            value: value, type: transactionType, description: description, date: date
        });
    }



    saveData(data);
    e.target.reset();
    myModal.hide();

    getTransactions();

    alert("Lançamento adicionado com sucesso.");

});

//CHECK LOGIN

checkLogged();

function checkLogged() {
    if (session) {
        sessionStorage.setItem("logged", session);
        logged = session;
    }

    if (!logged) {
        window.location.href = "index.html";
    }

    const dataUser = localStorage.getItem(logged);

    if (dataUser) {
        data = JSON.parse(dataUser);
    }

    getTransactions();

};

function saveData(data) {
    localStorage.setItem(data.login, JSON.stringify(data));
}


function getTransactions() {
    const transactions = data.transactions;
    let transactionsHtml = ``;

    if (transactions.length) {
        transactions.forEach((item) => {
            let type = "Entrada";
            if (item.type === "2") {
                type = "Saída";
            }

            transactionsHtml += `
            <tr >
            <th scope="row">${item.date}</th>
            <td>${item.value.toFixed(2)}</td>
            <td>${type}</td>
            <td>${item.description}</td>
        </tr>
            `

        })
    }

    document.getElementById("transactions-list").innerHTML = transactionsHtml;
}

function getTotal() {
    const transaction = data.transactions;
    let total = 0;

    transaction.forEach((item) => {
        if (item.type === "1") {
            total += item.value;
        } else {
            total -= item.value;
        }
    });

    return total;
}