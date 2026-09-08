// Приложение с кейсами

const cases = [
    {
        id: 1,
        name: "Обычный кейс",
        icon: "📦",
        price: 100
    },
    {
        id: 2,
        name: "Редкий кейс",
        icon: "🎁",
        price: 500
    },
    {
        id: 3,
        name: "Золотой кейс",
        icon: "👑",
        price: 1000
    },
    {
        id: 4,
        name: "VIP кейс",
        icon: "💎",
        price: 2500
    }
];

let balance = 5000;
let selectedCase = null;

document.addEventListener("DOMContentLoaded", () => {
    renderApp();
});

function renderApp() {
    document.body.innerHTML = `
        <div class="app">

            <header class="header">
                <div class="logo">
                    🎁 <span>КЕЙСЫ</span>
                </div>

                <div class="balance" id="balance">
                    ₽ ${balance}
                </div>
            </header>

            <section class="hero">
                <h1>Открывай кейсы 🎉</h1>
                <p>
                    Выбирай кейс и попробуй получить награду!
                </p>
            </section>

            <div class="section-title">
                Кейсы
            </div>

            <section class="cases">
                ${cases.map(item => `
                    <article class="case">

                        <div class="case-icon">
                            ${item.icon}
                        </div>

                        <h3>
                            ${item.name}
                        </h3>

                        <div class="price">
                            ₽ ${item.price}
                        </div>

                        <button
                            class="btn"
                            onclick="openCase(${item.id})"
                        >
                            Открыть
                        </button>

                    </article>
                `).join("")}
            </section>

        </div>

        <div
            class="modal"
            id="modal"
        >
            <div class="modal-box">

                <button
                    class="close"
                    onclick="closeModal()"
                >
                    ×
                </button>

                <h2 id="modalTitle">
                    Кейс
                </h2>

                <p
                    id="modalText"
                    class="muted"
                ></p>

                <br>

                <button
                    class="btn"
                    id="confirmButton"
                    onclick="confirmCase()"
                >
                    Открыть
                </button>

            </div>
        </div>
    `;
}

function openCase(id) {

    selectedCase = cases.find(item => item.id === id);

    if (!selectedCase) {
        return;
    }

    document.getElementById("modalTitle").textContent =
        selectedCase.icon + " " + selectedCase.name;

    document.getElementById("modalText").textContent =
        `Стоимость открытия: ₽ ${selectedCase.price}`;

    document
        .getElementById("modal")
        .classList.add("show");
}

function closeModal() {

    document
        .getElementById("modal")
        .classList.remove("show");

   
