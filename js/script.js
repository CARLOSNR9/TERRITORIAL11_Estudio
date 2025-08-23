document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer-display');
    const timerStatus = document.getElementById('timer-status');
    const totalPomodoros = 4;
    let pomodoroCount = 0;
    let isWorking = true;
    let timer;

    function startTimer(duration, statusText) {
        let timerSeconds = duration * 60;
        timerStatus.textContent = statusText;
        
        // Limpiar el temporizador si ya existe
        if (timer) clearInterval(timer);

        timer = setInterval(() => {
            let minutes = Math.floor(timerSeconds / 60);
            let seconds = timerSeconds % 60;
            
            // Formatear el tiempo con dos dígitos
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            
            timerDisplay.textContent = `${minutes}:${seconds}`;

            if (timerSeconds <= 0) {
                clearInterval(timer);
                nextPhase();
            }

            timerSeconds--;
        }, 1000);
    }

    function nextPhase() {
        if (isWorking) {
            pomodoroCount++;
            alert(`¡Se acabó el tiempo! Te has ganado un descanso de 5 minutos.`);
            isWorking = false;
            startTimer(5, 'Descansando...');
        } else {
            alert('¡De vuelta al trabajo! Vuelve a estudiar.');
            isWorking = true;
            if (pomodoroCount % totalPomodoros === 0) {
                // Si se completaron 4 pomodoros, un descanso largo
                alert(`¡Felicidades! Has completado ${totalPomodoros} pomodoros. Tómate un largo descanso de 15 minutos.`);
                startTimer(15, 'Descanso largo...');
            } else {
                // Descanso corto
                startTimer(25, 'Estudiando...');
            }
        }
    }

    // Iniciar el ciclo Pomodoro cuando la página se carga
    startTimer(25, 'Estudiando...');
});