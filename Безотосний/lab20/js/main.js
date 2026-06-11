// 1. СТВОРЕННЯ СТИЛІВ СТОРІНКИ ТА КОНТЕЙНЕРА ЧЕРЕЗ JAVASCRIPT
const bodyStyle = document.body.style;
bodyStyle.backgroundColor = '#000000';
bodyStyle.margin = '0';
bodyStyle.padding = '0';
bodyStyle.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
bodyStyle.display = 'flex';
bodyStyle.justifyContent = 'center';
bodyStyle.alignItems = 'center';
bodyStyle.minHeight = '100vh';
bodyStyle.overflow = 'hidden';
bodyStyle.userSelect = 'none';

// Головний контейнер калькулятора
const calculator = document.createElement('div');
const calcStyle = calculator.style;
calcStyle.backgroundColor = '#000000';
calcStyle.display = 'flex';
calcStyle.flexDirection = 'column';
calcStyle.justifyContent = 'flex-end';
calcStyle.padding = '20px';
calcStyle.boxSizing = 'border-box';
document.body.appendChild(calculator);

// 2. СТВОРЕННЯ ЕКРАНА ВИВОДУ
const display = document.createElement('div');
display.innerText = '0';
const dispStyle = display.style;
dispStyle.color = '#ffffff';
dispStyle.textAlign = 'right';
dispStyle.fontWeight = '300';
dispStyle.padding = '0 10px 10px 10px';
dispStyle.overflow = 'hidden';
dispStyle.textOverflow = 'ellipsis';
dispStyle.whiteSpace = 'nowrap';
calculator.appendChild(display);

// 3. СТВОРЕННЯ СІТКИ КНОПОК
const keyboard = document.createElement('div');
const keyStyle = keyboard.style;
keyStyle.display = 'grid';
keyStyle.gridTemplateColumns = 'repeat(4, 1fr)';
calculator.appendChild(keyboard);

// Структура кнопок калькулятора iOS
const buttons = [
    { text: 'AC', type: 'top' }, { text: '+/-', type: 'top' }, { text: '%', type: 'top' }, { text: '÷', type: 'op' },
    { text: '7', type: 'num' },  { text: '8', type: 'num' },   { text: '9', type: 'num' }, { text: '×', type: 'op' },
    { text: '4', type: 'num' },  { text: '5', type: 'num' },   { text: '6', type: 'num' }, { text: '-', type: 'op' },
    { text: '1', type: 'num' },  { text: '2', type: 'num' },   { text: '3', type: 'num' }, { text: '+', type: 'op' },
    { text: '0', type: 'num', zero: true }, { text: '.', type: 'num' }, { text: '=', type: 'op' }
];

const createdButtons = [];

buttons.forEach(btn => {
    const button = document.createElement('div');
    button.innerText = btn.text;
    
    const bStyle = button.style;
    bStyle.display = 'flex';
    bStyle.justifyContent = 'center';
    bStyle.alignItems = 'center';
    bStyle.fontWeight = 'normal';
    bStyle.cursor = 'pointer';
    bStyle.transition = 'filter 0.1s ease';

    // Задання кольорів відповідно до типу кнопки
    if (btn.type === 'top') {
        bStyle.backgroundColor = '#a5a5a5';
        bStyle.color = '#000000';
    } else if (btn.type === 'op') {
        bStyle.backgroundColor = '#fe9e09';
        bStyle.color = '#ffffff';
    } else {
        bStyle.backgroundColor = '#333333';
        bStyle.color = '#ffffff';
    }

    // Особливість для кнопки "0" (займає 2 колонки)
    if (btn.zero) {
        bStyle.gridColumn = 'span 2';
        bStyle.justifyContent = 'flex-start';
    }

    // Ефект натискання
    button.addEventListener('mousedown', () => bStyle.filter = 'brightness(1.3)');
    button.addEventListener('mouseup', () => bStyle.filter = 'none');
    button.addEventListener('mouseleave', () => bStyle.filter = 'none');
    
    // Додаємо обробник кліку (логіка калькулятора)
    button.addEventListener('click', () => handleInput(btn.text));

    keyboard.appendChild(button);
    createdButtons.push({ element: button, info: btn });
});

// 4. ФУНКЦІЯ АДАПТИВНОСТІ ЧЕРЕЗ JAVASCRIPT
function applyAdaptiveLayout() {
    const width = window.innerWidth;
    let size, gap, fontDisplay, fontButton, padZero;

    if (width <= 480) { 
        // Смартфон (ширина до 480px)
        size = Math.min(width / 4.8, 80);
        gap = 12;
        fontDisplay = '60px';
        fontButton = '28px';
        padZero = '26px';
        calcStyle.width = '100%';
        calcStyle.height = '100vh';
    } else if (width <= 1024) { 
        // Планшет (ширина від 481px до 1024px)
        size = 90;
        gap = 16;
        fontDisplay = '80px';
        fontButton = '34px';
        padZero = '32px';
        calcStyle.width = '420px';
        calcStyle.height = 'auto';
        calcStyle.borderRadius = '30px';
    } else { 
        // Ноутбук / Десктоп (ширина більше 1024px)
        size = 75;
        gap = 14;
        fontDisplay = '70px';
        fontButton = '26px';
        padZero = '28px';
        calcStyle.width = '360px';
        calcStyle.height = 'auto';
        calcStyle.borderRadius = '24px';
    }

    // Застосування вирахуваних розмірів до елементів
    dispStyle.fontSize = fontDisplay;
    keyStyle.gap = `${gap}px`;

    createdButtons.forEach(btn => {
        const s = btn.element.style;
        s.fontSize = fontButton;
        s.height = `${size}px`;
        s.borderRadius = `${size / 2}px`;
        
        if (btn.info.zero) {
            s.width = `${(size * 2) + gap}px`;
            s.paddingLeft = padZero;
            s.boxSizing = 'border-box';
        } else {
            s.width = `${size}px`;
        }
    });
}

// Слідкуємо за зміною розміру екрана
window.addEventListener('resize', applyAdaptiveLayout);
applyAdaptiveLayout(); // Перший запуск

// 5. ЛОГІКА ОБЧИСЛЕНЬ КАЛЬКУЛЯТОРА
let currentOperand = '0';
let previousOperand = '';
let operation = null;
let resetOnNextInput = false;

function handleInput(value) {
    if (!isNaN(value) || value === '.') {
        appendNumber(value);
    } else if (value === 'AC') {
        clearAll();
    } else if (value === '+/-') {
        changeSign();
    } else if (value === '%') {
        percentage();
    } else if (value === '=') {
        compute();
        operation = null;
    } else {
        chooseOperation(value);
    }
    updateDisplay();
}

function appendNumber(number) {
    if (resetOnNextInput) {
        currentOperand = '';
        resetOnNextInput = false;
    }
    if (number === '.' && currentOperand.includes('.')) return;
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number.toString();
    } else {
        currentOperand = currentOperand.toString() + number.toString();
    }
}

function chooseOperation(op) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
        compute();
    }
    operation = op;
    previousOperand = currentOperand;
    resetOnNextInput = true;
}

function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+': computation = prev + current; break;
        case '-': computation = prev - current; break;
        case '×': computation = prev * current; break;
        case '÷': 
            computation = current === 0 ? 'Error' : prev / current; 
            break;
        default: return;
    }
    
    // Округлення для красивого виводу дробових чисел
    if (typeof computation === 'number') {
        computation = Math.round(computation * 1e9) / 1e9;
    }
    
    currentOperand = computation.toString();
    previousOperand = '';
}

function changeSign() {
    if (currentOperand === 'Error' || currentOperand === '0') return;
    currentOperand = (parseFloat(currentOperand) * -1).toString();
}

function percentage() {
    if (currentOperand === 'Error') return;
    currentOperand = (parseFloat(currentOperand) / 100).toString();
}

function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = null;
    resetOnNextInput = false;
}

function updateDisplay() {
    // Заміна крапки на кому для відповідності інтерфейсу iOS
    let formatted = currentOperand.replace('.', ',');
    
    // Якщо число занадто велике, переводимо в експоненціальний вид
    if (formatted.length > 9 && !formatted.includes(',')) {
        formatted = parseFloat(currentOperand).toExponential(4);
    }
    display.innerText = formatted;
}