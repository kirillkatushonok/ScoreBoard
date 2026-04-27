// Общие данные
let gameData = {
    score: { team1: 0, team2: 0 },
    timer: { minutes: 0, seconds: 0, isRunning: false },
    interval: null
};

// Функции обновления
function updateDisplay() {
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');

    if (scoreElement) {
        scoreElement.textContent = `${gameData.score.team1} : ${gameData.score.team2}`;
    }
    if (timerElement) {
        timerElement.textContent =
            `${gameData.timer.minutes.toString().padStart(2, '0')}:${gameData.timer.seconds.toString().padStart(2, '0')}`;
    }
}

// Управление счётом
function changeScore(team, delta) {
    gameData.score[team] += delta;
    if (gameData.score[team] < 0) gameData.score[team] = 0;
    updateDisplay();
    saveToServer();
}

// Таймер
function startTimer() {
    if (!gameData.timer.isRunning) {
        gameData.timer.isRunning = true;
        gameData.interval = setInterval(() => {
            if (gameData.timer.seconds > 0) {
                gameData.timer.seconds--;
            } else if (gameData.timer.minutes > 0) {
                gameData.timer.minutes--;
                gameData.timer.seconds = 59;
            } else {
                clearInterval(gameData.interval);
                gameData.timer.isRunning = false;
            }
            updateDisplay();
            saveToServer();
        }, 1000);
    }
}

function resetTimer(minutes) {
    clearInterval(gameData.interval);
    gameData.timer.isRunning = false;
    gameData.timer.minutes = minutes;
    gameData.timer.seconds = 0;
    updateDisplay();
    saveToServer();
}

// Сохранение данных
async function saveToServer() {
    try {
        await fetch('save.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData)
        });
    } catch (error) {
        console.error('Ошибка сохранения:', error);
    }
}

// Загрузка данных
async function loadFromServer() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Не удалось загрузить данные');
        const data = await response.json();
        gameData = { ...gameData, ...data };
        updateDisplay();
    } catch (error) {
        console.warn('Используем локальные данные:', error);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    loadFromServer();
    setInterval(loadFromServer, 2000); // Обновляем каждые 2 секунды
});
