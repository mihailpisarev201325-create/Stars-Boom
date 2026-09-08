const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Временное хранилище пользователей.
// Позже подключим настоящую базу данных.
const users = new Map();

// Виртуальные кейсы
const cases = [
  {
    id: "basic",
    name: "Стартовый кейс",
    price: 10,
    emoji: "🎁",
    rewards: [
      { name: "5 монет", value: 5, weight: 50 },
      { name: "15 монет", value: 15, weight: 30 },
      { name: "50 монет", value: 50, weight: 15 },
      { name: "250 монет", value: 250, weight: 5 }
    ]
  },

  {
    id: "premium",
    name: "Премиум кейс",
    price: 50,
    emoji: "💎",
    rewards: [
      { name: "25 монет", value: 25, weight: 50 },
      { name: "80 монет", value: 80, weight: 30 },
      { name: "300 монет", value: 300, weight: 15 },
      { name: "1000 монет", value: 1000, weight: 5 }
    ]
  }
];

// Получение пользователя
function getUser(id) {
  if (!users.has(id)) {
    users.set(id, {
      id: id,
      balance: 0,
      inventory: [],
      history: []
    });
  }

  return users.get(id);
}

// Выбор награды по весам
function pickReward(rewards) {
  const total = rewards.reduce(
    (sum, reward) => sum + reward.weight,
    0
  );

  let random = Math.random() * total;

  for (const reward of rewards) {
    random -= reward.weight;

    if (random <= 0) {
      return reward;
    }
  }

  return rewards[rewards.length - 1];
}

// Проверка сервера
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "StarDrop API работает!"
  });
});

// Получить список кейсов
app.get("/api/cases", (req, res) => {
  res.json(cases);
});

// Получить профиль
app.get("/api/me", (req, res) => {
  const id = String(req.query.user_id || "demo");

  const user = getUser(id);

  res.json(user);
});

// Тестовое пополнение виртуального баланса
app.post("/api/demo-balance", (req, res) => {
  const id = String(req.body.user_id || "demo");
  const amount = Math.max(
    0,
    Number(req.body.amount || 0)
  );

  const user = getUser(id);

  user.balance += amount;

  user.history.unshift({
    type: "demo",
    amount: amount,
    at: new Date().toISOString()
  });

  res.json(user);
});

// Открытие кейса
app.post("/api/cases/open", (req, res) => {
  const id = String(req.body.user_id || "demo");
  const caseId = String(req.body.case_id || "");

  const selectedCase = cases.find(
    item => item.id === caseId
  );

  if (!selectedCase) {
    return res.status(404).json({
      error: "Кейс не найден"
    });
  }

  const user = getUser(id);

  if (user.balance < selectedCase.price) {
    return res.status(400).json({
      error: "Недостаточно виртуальных монет"
    });
  }

  // Списываем виртуальные монеты
  user.balance -= selectedCase.price;

  // Получаем виртуальную награду
  const reward = pickReward(selectedCase.rewards);

  // Добавляем предмет
  user.inventory.push({
    name: reward.name,
    value: reward.value,
    case: selectedCase.name,
    at: new Date().toISOString()
  });

  // Записываем историю
  user.history.unshift({
    type: "case",
    case: selectedCase.name,
    cost: selectedCase.price,
    reward: reward.name,
    at: new Date().toISOString()
  });

  res.json({
    balance: user.balance,
    reward: reward,
    inventory: user.inventory
  });
});

// Продажа виртуального предмета
app.post("/api/inventory/sell", (req, res) => {
  const id = String(req.body.user_id || "demo");
  const index = Number(req.body.index);

  const user = getUser(id);

  if (
    !Number.isInteger(index) ||
    !user.inventory[index]
  ) {
    return res.status(404).json({
      error: "Предмет не найден"
    });
  }

  const item = user.inventory.splice(index, 1)[0];

  user.balance += item.value;

  user.history.unshift({
    type: "sell",
    amount: item.value,
    item: item.name,
    at: new Date().toISOString()
  });

  res.json(user);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(
    `StarDrop API запущен на порту ${PORT}`
  );
});
