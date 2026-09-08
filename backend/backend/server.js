const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Раздаем статические файлы (HTML, CSS, JS) из текущей папки
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
