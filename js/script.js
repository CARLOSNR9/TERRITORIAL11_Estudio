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

const mostrarHistorialResumen = () => {
    // Función para obtener los intentos de un tema específico
    const obtenerIntentosPorTema = (temaKey) => {
        const intentosJSON = localStorage.getItem(temaKey);
        return intentosJSON ? JSON.parse(intentosJSON) : [];
    };

    // Función para renderizar el resumen de un tema
    const renderizarResumen = (elementoId, temaKey) => {
        const elemento = document.getElementById(elementoId);
        const intentos = obtenerIntentosPorTema(temaKey);

        if (intentos.length > 0) {
            const puntajes = intentos.map(intento => parseFloat(intento.puntaje));
            const mejorPuntaje = Math.max(...puntajes).toFixed(2);
            const puntajePromedio = (puntajes.reduce((sum, puntaje) => sum + puntaje, 0) / puntajes.length).toFixed(2);
            
            elemento.innerHTML = `
                <p><strong>Intentos realizados:</strong> ${intentos.length}</p>
                <p><strong>Mejor puntaje:</strong> ${mejorPuntaje}%</p>
                <p><strong>Puntaje promedio:</strong> ${puntajePromedio}%</p>
            `;
        } else {
            elemento.innerHTML = `<p>Aún no has hecho simulacros de este tema.</p>`;
        }
    };

    // Llamar a la función para cada tema
    renderizarResumen('historial-organizacion-territorial', 'simulacro_organizacion_territorial');
    renderizarResumen('historial-gestion-publica', 'simulacro_gestion_publica');
    renderizarResumen('historial-infraestructura-tic', 'simulacro_infraestructura_tic');
    renderizarResumen('historial-soporte-tecnico', 'simulacro_soporte_tecnico');
    renderizarResumen('historial-seguridad-informatica', 'simulacro_seguridad_informatica');
    renderizarResumen('historial-tecnologias-informacion-comunicaciones', 'simulacro_tecnologias_informacion_comunicaciones');
    renderizarResumen('historial-plan-estrategico-peti', 'simulacro_plan_estrategico_peti');
    renderizarResumen('historial-formulacion-proyectos-informaticos', 'simulacro_formulacion_proyectos_informaticos');
    renderizarResumen('historial-razonamiento-analitico', 'simulacro_razonamiento_analitico');
    renderizarResumen('historial-normatividad-tic', 'simulacro_normatividad_tic');
    renderizarResumen('historial-administracion-bienes', 'simulacro_administracion_bienes');
    renderizarResumen('historial-aporte-tecnico', 'simulacro_aporte_tecnico');
};

// Ejecutar la función al cargar la página
mostrarHistorialResumen();

// Ejecutar la función al cargar la página
mostrarHistorialResumen();