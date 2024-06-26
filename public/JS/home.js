const myModal = new bootstrap.Modal("#transaction-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let data = {
    transactions: []
};




checkLogged();
getCashIn();
getCashOut();
getTotal();

//LOGOUT

document.getElementById("buttom-logout").addEventListener("click", logout);
document.getElementById("transactions-button").addEventListener("click", function () {
    window.location.href = "transactions.html"
});



//CREATE TRANSACTION

document.getElementById("transaction-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const transactionType = document.querySelector('input[name="type-input"]:checked').value;
    const currentBalance = getTotal();
    let newBalance = currentBalance;

    const isCashOut = transactionType === "2";


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

    getCashIn();
    getCashOut();
    getTotal();


    alert("Lançamento adicionado com sucesso.");

});


//UTILS

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

};

function logout() {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");

    window.location.href = "index.html"


}

function getCashIn() {
    const transactions = data.transactions;

    const cashIn = transactions.filter((item) => item.type === "1");

    if (cashIn.length) {
        let cashInHtml = ``;
        let limit = 0;

        if (cashIn.length > 5) {
            limit = 5;
        } else {
            limit = cashIn.length;
        }

        for (let i = 0; i < limit; i++) {
            cashInHtml += `<div class="row mb-4">
        <div class="col-12">
            <h3 class="fs-2">R$ ${cashIn[i].value.toFixed(2)}</h3>
            <div class="container p-0">
                <div class="row">
                    <div class="col-12 col-md-8">
                        <p>${cashIn[i].description}</p>
                    </div>
                    <div class="col-12 col-md-3 d-flex justify-content-end">
                        ${cashIn[i].date}
                    </div>
                </div>
            </div>
        </div>
    </div>`

        }

        document.getElementById("cash-in-list").innerHTML = cashInHtml;

    };
}

function getCashOut() {
    const transactions = data.transactions;

    const cashOut = transactions.filter((item) => item.type === "2");

    if (cashOut.length) {
        let cashOutHtml = ``;
        let limit = 0;

        if (cashOut.length > 5) {
            limit = 5;
        } else {
            limit = cashOut.length;
        }

        for (let i = 0; i < limit; i++) {
            cashOutHtml += `<div class="row mb-4">
        <div class="col-12">
            <h3 class="fs-2">R$ ${cashOut[i].value.toFixed(2)}</h3>
            <div class="container p-0">
                <div class="row">
                    <div class="col-12 col-md-8">
                        <p>${cashOut[i].description}</p>
                    </div>
                    <div class="col-12 col-md-3 d-flex justify-content-end">
                        ${cashOut[i].date}
                    </div>
                </div>
            </div>
        </div>
    </div>`

        }

        document.getElementById("cash-out-list").innerHTML = cashOutHtml;

    };
}

function saveData(data) {
    localStorage.setItem(data.login, JSON.stringify(data));
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

    document.getElementById("total").innerHTML = `R$ ${total.toFixed(2)}`
    return total;
}

