// Данные игры
let score = { team1: 0, team2: 0 };
let timer = { minutes: 0, seconds: 0 };
let timerInterval;
let isRunning = false;

// Элементы DOM
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');

// Обновление отображения
function updateDisplay() {
    scoreElement.textContent = `${score.team1} : ${score.team2}`;
    timerElement.textContent = 
        `${timer.minutes.toString().padStart(2, '0')}:${timer.seconds.toString().padStart(2, '0')}`;
}

// Управление счётом
function updateScore(team, points) {
    if (team === 'team1') score.team1 += points;
    else if (team === 'team2') score.team2 += points;
    updateDisplay();
}

// Таймер
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            if (timer.seconds > 0) {
                timer.seconds--;
            } else if (timer.minutes > 0) {
                timer.minutes--;
                timer.seconds = 59;
            } else {
                clearInterval(timerInterval);
                isRunning = false;
            }
            updateDisplay();
        }, 1000);
    }
}

function resetTimer(minutes) {
    clearInterval(timerInterval);
    isRunning = false;
    timer.minutes = minutes;
    timer.seconds = 0;
    updateDisplay();
}

// Инициализация
updateDisplay();
