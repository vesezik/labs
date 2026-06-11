const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Налаштування статичних файлів для папки "js" (де лежить main.js)
app.use('/js', express.static(path.join(__dirname, 'js')));

// Головна сторінка сайту
app.get('/', (req, res) => {
    res.send('<h1>Лабораторна робота №20</h1><p>Перейдіть на <a href="/calculator">/calculator</a> щоб відкрити додаток.</p>');
});

// Окремий роут для калькулятора відповідно до завдання
app.get('/calculator', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено! Переглянути лабораторну можна тут: http://localhost:${PORT}/calculator`);
});