let tg = window.Telegram.WebApp;
tg.expand();

let balance = 9;
let currentCasePrice = 0;
let currentCaseName = '';

const rewards = [
    { name: "1 ⭐", icon: "⭐", type: "stars", value: 1 },
    { name: "5 ⭐", icon: "⭐", type: "stars", value: 5 },
    { name: "30 ⭐", icon: "⭐", type: "stars", value: 30 },
    { name: "Love Potion", icon: "🧪", type: "nft", value: 100 },
    { name: "Bonded Ring", icon: "💍", type: "nft", value: 250 },
    { name: "Fresh Socks", icon: "🧦", type: "nft", value: 50 }
];

function updateBalanceDisplay() {
    document.getElementById('user-balance').innerText = balance;
    document.getElementById('profile-balance').innerText = balance;
}

function switchPage(pageId, element) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById('page-' + pageId).style.display = 'block';

    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
}

function openCaseModal(name, price, icon) {
    currentCaseName = name;
    currentCasePrice = price;
    
    document.getElementById('modal-case-title').innerText = name;
    document.getElementById('modal-case-price').innerText = price;
    document.getElementById('drop-item-icon').innerText = icon;
    document.getElementById('drop-result-text').innerText = "Нажмите кнопку, чтобы открыть!";
    document.getElementById('spin-btn').style.display = 'block';
    
    document.getElementById('case-modal').classList.add('show');
}

function closeCaseModal() {
    document.getElementById('case-modal').classList.remove('show');
}

function startOpening() {
    if (balance < currentCasePrice) {
        alert("Недостаточно звёзд на балансе!");
        return;
    }

    balance -= currentCasePrice;
    updateBalanceDisplay();

    let spinBtn = document.getElementById('spin-btn');
    spinBtn.style.display = 'none';

    let dropBox = document.getElementById('drop-animation-box');
    let resultText = document.getElementById('drop-result-text');
    let iconElem = document.getElementById('drop-item-icon');

    resultText.innerText = "Кейс открывается...";
    
    let counter = 0;
    let interval = setInterval(() => {
        let randomReward = rewards[Math.floor(Math.random() * rewards.length)];
        iconElem.innerText = randomReward.icon;
        counter++;

        if (counter > 10) {
            clearInterval(interval);
            let finalReward = rewards[Math.floor(Math.random() * rewards.length)];
            iconElem.innerText = finalReward.icon;
            resultText.innerHTML = `Вы выиграли: <b>${finalReward.name}</b>!`;
            
            if (finalReward.type === 'stars') {
                balance += finalReward.value;
                updateBalanceDisplay();
            }
        }
    }, 100);
}

function addBalance() {
    let starsToAdd = 100;

    if (tg.openInvoice) {
        fetch('https://stars-boom-backend-2yvy.onrender.com/create-invoice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stars: starsToAdd })
        })
        .then(res => res.json())
        .then(data => {
            if (data.invoice_link) {
                tg.openInvoice(data.invoice_link, (status) => {
                    if (status === 'paid') {
                        balance += starsToAdd;
                        updateBalanceDisplay();
                        alert("Оплата прошла успешно! Баланс пополнен.");
                    } else {
                        alert("Оплата была отменена.");
                    }
                });
            } else {
                alert("Ошибка создания счета: " + (data.error || 'Неизвестно'));
            }
        })
        .catch(err => {
            alert("Ошибка соединения с сервером оплаты.");
        });
    } else {
        balance += starsToAdd;
        updateBalanceDisplay();
        alert("Тестовое пополнение (вне Telegram)!");
    }
}

updateBalanceDisplay();
