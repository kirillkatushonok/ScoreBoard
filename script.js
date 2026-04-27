let gameData = {
    score: { team1: 0, team2: 0 },
    timer: { minutes: 0, seconds: 0, isRunning: false },
    interval: null
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
    updateDisplay();
    saveToLocalStorage();
}

function saveToLocalStorage() {
    localStorage.setItem('scoreboardData', JSON.stringify(gameData));
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('scoreboardData');
    if (savedData) {
        const loadedData = JSON.parse(savedData);
        gameData = { ...gameData, ...loadedData };
    }
    updateDisplay();
}

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    setInterval(loadFromLocalStorage, 1000); // Обновляем каждую секунду
});
