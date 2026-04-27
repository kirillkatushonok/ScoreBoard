let gameData = {
    score: { team1: 0, team2: 0 },
    timer: { minutes: 0, seconds: 0, isRunning: false },
    interval: null,
    lastUpdate: Date.now()
};

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

function changeScore(team, delta) {
    gameData.score[team] += delta;
    if (gameData.score[team] < 0) gameData.score[team] = 0;
    gameData.lastUpdate = Date.now();
    updateDisplay();
    saveToLocalStorage();
}

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
            gameData.lastUpdate = Date.now();
            updateDisplay();
            saveToLocalStorage();
        }, 1000);
    }
}

function resetTimer(minutes) {
    clearInterval(gameData.interval);
    gameData.timer.isRunning = false;
    gameData.timer.minutes = minutes;
    gameData.timer.seconds = 0;
    gameData.lastUpdate = Date.now();
    updateDisplay();
    saveToLocalStorage();
}

function saveToLocalStorage() {
    try {
        localStorage.setItem('scoreboardData', JSON.stringify(gameData));
    } catch (e) {
        console.error('Ошибка сохранения в localStorage:', e);
    }
}

function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem('scoreboardData');
        if (savedData) {
            const loadedData = JSON.parse(savedData);
            // Обновляем только данные, сохраняем интервал таймера
            gameData = { ...gameData, ...loadedData };
            updateDisplay();
        }
    } catch (e) {
        console.error('Ошибка загрузки из localStorage:', e);
    }
}

// Принудительное обновление каждые 500 мс для Streamlabs
setInterval(() => {
    loadFromLocalStorage();
}, 500);

document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    loadFromLocalStorage();
});
