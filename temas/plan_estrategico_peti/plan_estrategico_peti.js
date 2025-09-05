document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('iniciar-simulacro');
    const simulacroContainer = document.getElementById('simulacro-container');
    const resultadosContainer = document.getElementById('resultados-finales');

    let preguntas = [];
    let preguntasSeleccionadas = [];
    let preguntaActualIndex = 0;
    let respuestasCorrectas = 0;

    // Función para obtener las preguntas del archivo JSON
    const obtenerPreguntas = async () => {
        try {
            const response = await fetch('preguntas_plan_estrategico_peti.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo de preguntas.');
            }
            preguntas = await response.json();
            iniciarSimulacro();
        } catch (error) {
            console.error(error);
            simulacroContainer.innerHTML = '<p>Lo siento, no se pudieron cargar las preguntas del simulacro. Por favor, asegúrate de que el archivo JSON existe y tiene el formato correcto.</p>';
        }
    };

    // Función para seleccionar 20 preguntas aleatorias del banco
    const seleccionarPreguntasAleatorias = () => {
        if (preguntas.length < 20) {
            console.warn("No hay suficientes preguntas en el banco. Se usarán todas las disponibles.");
            return preguntas;
        }

        const preguntasCopiadas = [...preguntas];
        const seleccionadas = [];
        for (let i = 0; i < 20; i++) {
            const randomIndex = Math.floor(Math.random() * preguntasCopiadas.length);
            seleccionadas.push(preguntasCopiadas.splice(randomIndex, 1)[0]);
        }
        return seleccionadas;
    };

    // Función principal para iniciar el simulacro
    const iniciarSimulacro = () => {
        preguntasSeleccionadas = seleccionarPreguntasAleatorias();
        preguntaActualIndex = 0;
        respuestasCorrectas = 0;

        startButton.classList.add('hidden');
        resultadosContainer.classList.add('hidden');
        simulacroContainer.classList.remove('hidden');

        mostrarPregunta();
    };

    // Función para mostrar una pregunta
    const mostrarPregunta = () => {
        if (preguntaActualIndex >= preguntasSeleccionadas.length) {
            finalizarSimulacro();
            return;
        }

        const pregunta = preguntasSeleccionadas[preguntaActualIndex];
        const preguntaHTML = `
            <div class="pregunta-card">
                <h3>Pregunta ${preguntaActualIndex + 1} de ${preguntasSeleccionadas.length}</h3>
                <div class="caso"><strong>Caso:</strong> ${pregunta.caso}</div>
                <div class="enunciado"><strong>Enunciado:</strong> ${pregunta.enunciado}</div>
                <ul class="opciones-lista">
                    ${pregunta.opciones.map((opcion, index) => 
                        `<li class="opcion-item" data-opcion="${String.fromCharCode(65 + index)}">${opcion}</li>`
                    ).join('')}
                </ul>
                <div id="retroalimentacion" class="hidden"></div>
            </div>
        `;
        simulacroContainer.innerHTML = preguntaHTML;
        
        // Agregar los event listeners a las opciones
        document.querySelectorAll('.opcion-item').forEach(opcion => {
            opcion.addEventListener('click', manejarRespuesta);
        });
    };

    // Función para manejar la respuesta del usuario
    const manejarRespuesta = (event) => {
        const opcionSeleccionada = event.target.getAttribute('data-opcion');
        const pregunta = preguntasSeleccionadas[preguntaActualIndex];
        const esCorrecta = (opcionSeleccionada === pregunta.respuesta_correcta);
        
        const retroalimentacionDiv = document.getElementById('retroalimentacion');
        retroalimentacionDiv.classList.remove('hidden');

        // Deshabilitar los clics en las opciones
        document.querySelectorAll('.opcion-item').forEach(opcion => {
            opcion.style.pointerEvents = 'none';
        });

        if (esCorrecta) {
            respuestasCorrectas++;
            retroalimentacionDiv.innerHTML = `
                <p class="correcta">¡Correcto! Respuesta: ${pregunta.respuesta_correcta}</p>
                <p class="explicacion">${pregunta.explicacion}</p>
                <button id="siguiente-pregunta">Siguiente Pregunta</button>
            `;
        } else {
            retroalimentacionDiv.innerHTML = `
                <p class="incorrecta">Fallaste. La respuesta correcta era: ${pregunta.respuesta_correcta}</p>
                <p class="explicacion">${pregunta.explicacion}</p>
                <button id="siguiente-pregunta">Siguiente Pregunta</button>
            `;
        }

        // Agregar el evento al nuevo botón
        document.getElementById('siguiente-pregunta').addEventListener('click', () => {
            preguntaActualIndex++;
            mostrarPregunta();
        });
    };

    // Función para finalizar el simulacro y mostrar resultados
    const finalizarSimulacro = () => {
        const totalPreguntas = preguntasSeleccionadas.length;
        const puntaje = (respuestasCorrectas / totalPreguntas) * 100;
        const puntajeRedondeado = puntaje.toFixed(2);

        // Guardar el intento en localStorage
        guardarIntento(puntajeRedondeado);
        
        const intentosGuardados = obtenerIntentos();
        const listaIntentosHTML = intentosGuardados.map(intento => `<li>Intento: ${intento.numero}, Puntaje: ${intento.puntaje}% (${intento.fecha})</li>`).join('');

        resultadosContainer.classList.remove('hidden');
        resultadosContainer.innerHTML = `
            <h3>Simulacro Finalizado</h3>
            <p><strong>Total de preguntas:</strong> ${totalPreguntas}</p>
            <p><strong>Respuestas correctas:</strong> ${respuestasCorrectas}</p>
            <p><strong>Tu puntaje es:</strong> ${puntajeRedondeado}%</p>
            <p class="nota">Recuerda: El puntaje mínimo para pasar la prueba funcional es de 65.00 puntos.</p>
            <br>
            <h3>Historial de Intentos</h3>
            <ul>
                ${listaIntentosHTML}
            </ul>
            <button onclick="window.location.reload()">Volver a intentarlo</button>
        `;
        simulacroContainer.classList.add('hidden');
    };

    // Funciones para localStorage
    const guardarIntento = (puntaje) => {
        const intentos = obtenerIntentos();
        const nuevoIntento = {
            numero: intentos.length + 1,
            puntaje: puntaje,
            fecha: new Date().toLocaleString()
        };
        intentos.push(nuevoIntento);
        localStorage.setItem('simulacro_plan_estrategico_peti', JSON.stringify(intentos));
    };

    const obtenerIntentos = () => {
        const intentosJSON = localStorage.getItem('simulacro_plan_estrategico_peti');
        return intentosJSON ? JSON.parse(intentosJSON) : [];
    };

    // Agregar el event listener al botón de inicio
    startButton.addEventListener('click', obtenerPreguntas);
});