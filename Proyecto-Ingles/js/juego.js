/* ============================================================
   juego.js
   El juego: modos, preguntas, respuestas, puntos, pausa/guardado y pantalla final.
   ============================================================ */

  /* ============================================================
     PASO 2: variables generales del juego
     ============================================================ */
  let modoActual = null;
  let preguntas = [];        // lista de preguntas ya armadas para esta ronda
  let preguntaActual = 0;
  let puntos = 0;
  let racha = 0;
  let mejorRacha = 0;
  let respondiendo = false;
  let intentos = 0;            // fallos en la pregunta actual (máximo 3 para la ayuda)
  let pronunciacionOk = false; // modo completo, paso 3: ¿ya lo dijo bien?

  const inputRespuesta = document.getElementById("respuestaInput");
  const mensaje = document.getElementById("mensaje");

  function leerMejorRacha(modo) {
    try {
      return parseInt(localStorage.getItem("mejorRacha_" + modo) || "0", 10);
    } catch (e) {
      return 0;
    }
  }

  function guardarMejorRacha(modo, valor) {
    try { localStorage.setItem("mejorRacha_" + modo, String(valor)); }
    catch (e) { /* si el navegador no deja guardar, no pasa nada grave */ }
  }

  /* ============================================================
     PASO 3: generar las preguntas según el modo elegido
     ============================================================ */

  // Modo "escribir" y "elegir": una pregunta por cada uno de los 16 verbos
  function generarPreguntasDeVerbo() {
    return mezclar(verbos.map((_, idx) => idx)).map(idx => ({
      verboIdx: idx,
      img: verbos[idx].img,
      respuestaCorrecta: verbos[idx].nombre,
    }));
  }

  // Modo "conjugar": 12 preguntas al azar (verbo + pronombre + tiempo)
  function generarPreguntasDeConjugacion() {
    const tiempos = ["pasado", "presente", "futuro"];
    const lista = [];
    const verbosDeLaRonda = mezclar(verbos.map((_, idx) => idx)).slice(0, 12);
    for (let i = 0; i < 12; i++) {
      const verboIdx = verbosDeLaRonda[i];
      const pronombreIdx = Math.floor(Math.random() * pronombres.length);
      const tiempo = elegirAlAzar(tiempos);
      const verbo = verbos[verboIdx];

      let respuestaCorrecta;
      if (tiempo === "pasado") respuestaCorrecta = verbo.past;
      else if (tiempo === "futuro") respuestaCorrecta = verbo.fut;
      else respuestaCorrecta = esTercera[pronombreIdx] ? verbo.pres3 : verbo.pres;

      const etiquetaTiempo = { pasado: "Past", presente: "Present", futuro: "Future" }[tiempo];

      lista.push({
        verboIdx,
        img: verbo.img,
        pronombre: pronombres[pronombreIdx],
        etiquetaTiempo,
        respuestaCorrecta,
      });
    }
    return lista;
  }

  // Modo "oraciones": 12 preguntas al azar, armamos fichas con distractores
  function generarPreguntasDeOraciones() {
    const tiempos = ["pasado", "presente", "futuro"];
    const lista = [];
    const verbosDeLaRonda = mezclar(verbos.map((_, idx) => idx)).slice(0, 12);
    for (let i = 0; i < 12; i++) {
      const verboIdx = verbosDeLaRonda[i];
      const pronombreIdx = Math.floor(Math.random() * pronombres.length);
      const tiempo = elegirAlAzar(tiempos);
      const verbo = verbos[verboIdx];
      const pronombre = pronombrePorVerbo[verbo.nombre];

      let tokensCorrectos;
      if (tiempo === "pasado") {
        tokensCorrectos = [pronombre, verbo.past];
      } else if (tiempo === "futuro") {
        tokensCorrectos = [pronombre, "will", verbo.pres];
      } else {
       tokensCorrectos = [pronombre, ["He", "She", "It"].includes(pronombre) ? verbo.pres3 : verbo.pres];
      }

      // Armamos una bolsa de palabras distractoras que no se repitan
      // con las que ya son parte de la oración correcta
      const posiblesDistractores = [
        ...pronombresUnicos.filter(p => p !== pronombre),
        verbo.past, verbo.pres, verbo.pres3, "will",
      ].filter(palabra => !tokensCorrectos.includes(palabra));

      const distractores = mezclar(posiblesDistractores).slice(0, 3);
      const fichas = mezclar([...tokensCorrectos, ...distractores]);

      lista.push({
        verboIdx,
        img: verbo.img,
        tokensCorrectos,
        fichas,
        etiquetaTiempo: { pasado: "Past", presente: "Present", futuro: "Future" }[tiempo],
      });
    }
    return lista;
  }

  /* ============================================================
     PASO 4: arrancar un modo de juego
     ============================================================ */
  function iniciarModo(modo) {
    const user = localStorage.getItem('userActual');
    const estadoGuardado = JSON.parse(localStorage.getItem('estado_juego_' + user));

    // 1. Verificar si hay partida guardada en ESTE modo
    if (estadoGuardado && estadoGuardado.modo === modo) {
      mostrarConfirm(
        '️ Partida guardada encontrada',
        `Tienes una partida guardada en este modo:<br><br>
         📍 Pregunta: <b>${estadoGuardado.preguntaActual + 1}</b><br>
         ⭐ Puntos: <b>${estadoGuardado.puntos}</b><br>
         🔥 Racha: <b>${estadoGuardado.racha}</b><br><br>
         ¿Deseas continuar donde lo dejaste?`,
        () => {
          // Acción si acepta (continuar)
          modoActual = estadoGuardado.modo;
          preguntaActual = estadoGuardado.preguntaActual;
          puntos = estadoGuardado.puntos;
          racha = estadoGuardado.racha;
          preguntas = estadoGuardado.preguntas;
          if (modo === "completo") pasoCompleto = estadoGuardado.pasoCompleto || 1;
          mostrarInterfazJuego();
          mostrarPregunta();
        },
        () => {
          // Acción si cancela (empezar de cero)
          localStorage.removeItem('estado_juego_' + user);
          iniciarModoNormal(modo);
        }
      );
      return;
    }

    // 2. Si no hay partida guardada, iniciar normal
    iniciarModoNormal(modo);
  }

  function iniciarModoNormal(modo) {
    modoActual = modo;
    mejorRacha = leerMejorRacha(modo);
    puntos = 0;
    racha = 0;
    preguntaActual = 0;

    if (modo === "escribir" || modo === "elegir" || modo === "escuchar" || modo === "hablar" || modo === "completo") {
      preguntas = generarPreguntasDeVerbo();
    } else if (modo === "conjugar") {
      preguntas = generarPreguntasDeConjugacion();
    } else if (modo === "oraciones") {
      preguntas = generarPreguntasDeOraciones();
    }

    mostrarInterfazJuego();
    mostrarPregunta();
  }

  function mostrarInterfazJuego() {
    document.getElementById("pantallaMenu").classList.add("oculto");
    document.getElementById("juegoFinal").classList.add("oculto");
    document.getElementById("juegoEnCurso").classList.remove("oculto");
    document.getElementById("app").classList.add("oculto");
    document.getElementById("btnHistorial").classList.add("oculto"); // el historial solo se ve en el menú inicial

    document.getElementById("zonaTexto").classList.toggle("oculto", !(modoActual === "escribir" || modoActual === "conjugar" || modoActual === "escuchar" || modoActual === "completo"));
    document.getElementById("zonaAudio").classList.toggle("oculto", modoActual !== "escuchar");
    document.getElementById("zonaHablar").classList.toggle("oculto", modoActual !== "hablar");
    document.querySelector(".carrusel").classList.toggle("solo-audio", modoActual === "escuchar");
    document.getElementById("zonaPaso").classList.add("oculto");
    document.getElementById("zonaOpciones").classList.toggle("oculto", modoActual !== "elegir");
    document.getElementById("zonaOraciones").classList.toggle("oculto", modoActual !== "oraciones");
    document.getElementById("consigna").classList.toggle("oculto", modoActual !== "conjugar" && modoActual !== "oraciones");
  }
     
  

  function volverAlMenu() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    document.getElementById("juegoEnCurso").classList.add("oculto");
    document.getElementById("juegoFinal").classList.add("oculto");
    document.getElementById("pantallaMenu").classList.remove("oculto");
    document.getElementById("app").classList.remove("oculto");
    document.getElementById("btnHistorial").classList.remove("oculto");
  }

  /* ============================================================
     PASO 5: mostrar la pregunta actual (con su carrusel de imágenes)
     ============================================================ */
  function mostrarPregunta() {
    const q = preguntas[preguntaActual];
    pintarColores(q.verboIdx);

    const img = document.getElementById("imagenActual");
    img.src = q.img;
    img.classList.remove("entrando");
    void img.offsetWidth;
    img.classList.add("entrando");

    // Imagen anterior / siguiente, de fondo (en vez de botones)
    const anteriorQ = preguntas[(preguntaActual - 1 + preguntas.length) % preguntas.length];
    const siguienteQ = preguntas[(preguntaActual + 1) % preguntas.length];
    document.getElementById("imagenAnterior").src = anteriorQ.img;
    document.getElementById("imagenSiguiente").src = siguienteQ.img;

    document.getElementById("chipPregunta").textContent =
      "Question " + (preguntaActual + 1) + "/" + preguntas.length;
    document.getElementById("chipPuntos").textContent = "⭐ " + puntos + " points";
    document.getElementById("chipRacha").textContent = "🔥 Streak: " + racha;

    mensaje.textContent = "";
    respondiendo = false;
    intentos = 0;

    if (modoActual === "escribir") {
      inputRespuesta.placeholder = "Write the verb in English...";
      prepararZonaTexto();
    } else if (modoActual === "conjugar") {
      document.getElementById("consigna").textContent = q.pronombre + " — " + q.etiquetaTiempo;
      inputRespuesta.placeholder = "Write the correct form...";
      prepararZonaTexto();
    } else if (modoActual === "elegir") {
      prepararZonaOpciones(q);
    } else if (modoActual === "oraciones") {
      document.getElementById("consigna").textContent = q.etiquetaTiempo;
      prepararZonaOraciones(q);
    } else if (modoActual === "escuchar") {
      document.querySelector(".carrusel").classList.remove("revelada");
      inputRespuesta.placeholder = "Write what you heard...";
      prepararZonaTexto();
      // Esperamos un ratito para que cargue la tarjeta y reproducimos el verbo
      setTimeout(() => decirEnVozAlta(q.respuestaCorrecta, 0.9), 400);
    } else if (modoActual === "hablar") {
      prepararZonaHablar();
    } else if (modoActual === "completo") {
      irAPaso(1);
    }
  }

  function prepararZonaTexto() {
    inputRespuesta.value = "";
    inputRespuesta.classList.remove("correcta", "incorrecta");
    inputRespuesta.disabled = false;
    inputRespuesta.focus();
  }

  /* ============================================================
     PASO 6a: modo "escribir" y "conjugar" -> se escribe la respuesta
     ============================================================ */
  function verificarTexto() {
    if (respondiendo) return;
    respondiendo = true;

    const q = preguntas[preguntaActual];
    const escrito = inputRespuesta.value.trim().toLowerCase();
    const esCorrecto = escrito === q.respuestaCorrecta.toLowerCase();

    // Si se equivoca, se queda en la misma pregunta y puede intentar otra vez
    if (!esCorrecto) {
      inputRespuesta.classList.add("incorrecta");
      setTimeout(() => inputRespuesta.classList.remove("incorrecta"), 700);
      manejarFallo(q.respuestaCorrecta);
      respondiendo = false;
      inputRespuesta.select();
      return;
    }

    inputRespuesta.disabled = true;
    marcarResultado(esCorrecto, q.respuestaCorrecta);
    inputRespuesta.classList.add(esCorrecto ? "correcta" : "incorrecta");

    if (modoActual === "completo") setTimeout(() => irAPaso(2), 1500);
    else avanzar();
  }

  document.getElementById("btnVerificarTexto").addEventListener("click", verificarTexto);
  inputRespuesta.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") verificarTexto();
  });

  /* ============================================================
     PASO 6b: modo "elegir" -> se elige entre 4 opciones
     ============================================================ */
  function prepararZonaOpciones(q) {
    const otros = mezclar(
      verbos.map((_, idx) => idx).filter(idx => idx !== q.verboIdx)
    ).slice(0, 3).map(idx => verbos[idx].nombre);

    const opciones = mezclar([q.respuestaCorrecta, ...otros]);

    const contenedor = document.getElementById("zonaOpciones");
    contenedor.innerHTML = "";
    opciones.forEach(nombreOpcion => {
      const btn = document.createElement("button");
      btn.className = "opcion";
      btn.textContent = nombreOpcion;
      btn.addEventListener("click", () => verificarOpcion(nombreOpcion, q.respuestaCorrecta, btn));
      contenedor.appendChild(btn);
    });
  }

  function verificarOpcion(elegida, correcta, botonElegido) {
    if (respondiendo) return;

    // Si se equivoca, se marca esa opción en rojo y puede elegir otra
    if (elegida !== correcta) {
      botonElegido.classList.add("incorrecta");
      botonElegido.disabled = true;
      manejarFallo(correcta);
      return;
    }

    respondiendo = true;

    const botones = document.querySelectorAll("#zonaOpciones .opcion");
    botones.forEach(b => b.disabled = true);

    const esCorrecto = elegida === correcta;
    botonElegido.classList.add(esCorrecto ? "correcta" : "incorrecta");
    if (!esCorrecto) {
      botones.forEach(b => { if (b.textContent === correcta) b.classList.add("correcta"); });
    }

    marcarResultado(esCorrecto, correcta);
    avanzar();
  }

  /* ============================================================
     PASO 6c: modo "oraciones" -> se arma tocando fichas en orden
     ============================================================ */
  let fichasElegidas = []; // palabras que el usuario ya puso en la franja

  function prepararZonaOraciones(q) {
    fichasElegidas = [];
    pintarFranja();

    const banco = document.getElementById("bancoFichas");
    banco.innerHTML = "";
    q.fichas.forEach((palabra, idx) => {
      const btn = document.createElement("button");
      btn.className = "ficha";
      btn.textContent = palabra;
      btn.dataset.usada = "no";
      btn.addEventListener("click", () => {
        if (btn.dataset.usada === "si" || respondiendo) return;
        btn.dataset.usada = "si";
        btn.classList.add("usada");
        decirPalabraRapida(palabra);
        fichasElegidas.push({ palabra, boton: btn });
        pintarFranja();
      });
      banco.appendChild(btn);
    });
  }

  function pintarFranja() {
    const franja = document.getElementById("franjaRespuesta");
    franja.innerHTML = "";
    fichasElegidas.forEach((item, idx) => {
      const chipFicha = document.createElement("button");
      chipFicha.className = "ficha";
      chipFicha.textContent = item.palabra;
      // Tocar una ficha ya puesta la devuelve al banco
      chipFicha.addEventListener("click", () => {
        if (respondiendo) return;
        item.boton.dataset.usada = "no";
        item.boton.classList.remove("usada");
        fichasElegidas.splice(idx, 1);
        pintarFranja();
      });
      franja.appendChild(chipFicha);
    });
  }

  function verificarOracion() {
    if (respondiendo) return;
    respondiendo = true;

    const q = preguntas[preguntaActual];
    const armada = fichasElegidas.map(item => item.palabra);
    const esCorrecto = armada.length === q.tokensCorrectos.length &&
      armada.every((palabra, idx) => palabra === q.tokensCorrectos[idx]);

    // Si se equivoca, conserva las fichas puestas y puede corregir
    if (!esCorrecto) {
      manejarFallo(q.tokensCorrectos.join(" "));
      respondiendo = false;
      return;
    }

    marcarResultado(esCorrecto, q.tokensCorrectos.join(" "));
    avanzar();
  }

  document.getElementById("btnVerificarOracion").addEventListener("click", verificarOracion);

  /* ============================================================
     PASO 7: lo que pasa después de responder (puntos, racha, mensaje)
     ============================================================ */
  // Cada fallo: mensaje con el número de intento. Desde el tercero suena la ayuda (la palabra, despacio).
  // No se avanza hasta acertar.
  function manejarFallo(respuestaCorrecta, extra) {
    intentos++;
    if (intentos === 1 && !(modoActual === "completo" && pasoCompleto === 3)) {
      racha = 0;
      document.getElementById("chipRacha").textContent = "🔥 Streak: " + racha;
    }
    if (intentos >= 3) {
      mensaje.textContent = "💡 Listen to the help and try again!";
      decirEnVozAlta(respuestaCorrecta, 0.6);
    } else {
      mensaje.textContent = "❌ Not quite. Try again! (attempt " + intentos + " of 3)";
    }
    if (extra) mensaje.textContent += " — " + extra;
  }

  function marcarResultado(esCorrecto, respuestaCorrecta) {
    document.querySelector(".carrusel").classList.add("revelada");
    decirEnVozAlta(respuestaCorrecta, 0.9); // al responder, escuchás la pronunciación correcta
    if (esCorrecto) {
      mensaje.textContent = "Great job! 🎉";
      // Los puntos y la racha solo se suman si acertó a la primera
      if (intentos === 0) {
        puntos += 10;
        racha += 1;
        if (racha > mejorRacha) {
          mejorRacha = racha;
          guardarMejorRacha(modoActual, mejorRacha);
        }
      } else {
        mensaje.textContent = "Correct! 👍 (no points, you needed help)";
      }
    } else {
      mensaje.textContent = "It was: " + respuestaCorrecta;
      racha = 0;
    }
    document.getElementById("chipPuntos").textContent = "⭐ " + puntos + " points";
    document.getElementById("chipRacha").textContent = "🔥 Streak: " + racha;
  }

 function avanzar() {
    const inicio = Date.now();
    // Espera a que termine el audio (mínimo 1.7 s, máximo 10 s por si el navegador se queda pegado)
    const espera = setInterval(() => {
      const transcurrido = Date.now() - inicio;
      const hablando = "speechSynthesis" in window &&
        (window.speechSynthesis.speaking || window.speechSynthesis.pending);
      if (transcurrido < 1800 || (hablando && transcurrido < 1800)) return;
      clearInterval(espera);
      preguntaActual++;
      if (preguntaActual < preguntas.length) {
        mostrarPregunta();
      } else {
        mostrarPantallaFinal();
      }
    }, 150);
  }

  /* ============================================================
     PASO 8: pantalla final con resumen y galería premio
     ============================================================ */
  function mostrarPantallaFinal() {    guardarResumenEnHistorial();
    document.getElementById("juegoEnCurso").classList.add("oculto");
    document.getElementById("juegoFinal").classList.remove("oculto");

    document.getElementById("resultadoTexto").textContent =
      "Score: " + puntos + " points (" + Math.round(puntos/10) + " / " + preguntas.length + " correct)";
    document.getElementById("mejorRachaTexto").textContent =
      "🔥 Best streak: " + mejorRacha;

    const galeria = document.getElementById("galeria");
    galeria.innerHTML = "";
    verbos.forEach(v => {
      const img = document.createElement("img");
      img.src = v.img;
      galeria.appendChild(img);
    });
  }

  document.getElementById("btnJugarDeNuevo").addEventListener("click", () => iniciarModo(modoActual));
  document.getElementById("btnElegirOtroModo").addEventListener("click", volverAlMenu);
  document.getElementById("btnVolverMenu").addEventListener("click", volverAlMenu);

    // === SISTEMA DE PAUSA Y GUARDADO DE PARTIDA ===
  function guardarEstadoJuego() {
    const user = localStorage.getItem('userActual');
    const estado = {
      modo: modoActual,
      preguntaActual: preguntaActual,
      puntos: puntos,
      racha: racha,
      preguntas: preguntas, // Guarda el orden exacto de las preguntas
      pasoCompleto: typeof pasoCompleto !== 'undefined' ? pasoCompleto : 1
    };
    localStorage.setItem('estado_juego_' + user, JSON.stringify(estado));
    mostrarAlerta('⏸️ Juego pausado', '✅ Tu progreso fue guardado correctamente.<br><br>Puedes salir y continuar cuando quieras.');
    volverAlMenu();
  }

  /* ============================================================
     MODO COMPLETO: 3 pasos por imagen
     Paso 1: escribir el verbo -> Paso 2: escuchar -> Paso 3: hablar
     ============================================================ */
  let pasoCompleto = 1;
  const btnPaso = document.getElementById("btnPaso");

  function irAPaso(n) {
    pasoCompleto = n;
    const q = preguntas[preguntaActual];
    const consigna = document.getElementById("consigna");
    document.getElementById("zonaTexto").classList.toggle("oculto", n !== 1);
    document.getElementById("zonaAudio").classList.toggle("oculto", n !== 2);
    document.getElementById("zonaHablar").classList.toggle("oculto", n !== 3);
    document.getElementById("zonaPaso").classList.toggle("oculto", n === 1);
    consigna.classList.toggle("oculto", n === 1);
    consigna.textContent = q.respuestaCorrecta;
    respondiendo = false;
    intentos = 0;
    pronunciacionOk = false;

    if (n === 1) {
      document.querySelector(".carrusel").classList.remove("revelada");
      inputRespuesta.placeholder = "Write the verb in English...";
      prepararZonaTexto();
    } else if (n === 2) {
      mensaje.textContent = "🔊 Step 2: listen to the word as many times as you want.";
      btnPaso.textContent = "Now speak ➡";
    } else {
      mensaje.textContent = "🎤 Step 3: say the word out loud!";
      btnPaso.textContent = "Next picture ➡";
      prepararZonaHablar();
    }
  }

  btnPaso.addEventListener("click", () => {
    if (pasoCompleto === 2) {
      irAPaso(3);
    } else {
      // Para pasar a la siguiente imagen hay que pronunciar bien (si el navegador reconoce voz)
      if (!pronunciacionOk && ReconocimientoVoz) {
        mensaje.textContent = "🎤 Say the word correctly to go to the next picture.";
        return;
      }
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      preguntaActual++;
      if (preguntaActual < preguntas.length) mostrarPregunta();
      else mostrarPantallaFinal();
    }
  });

  /* ============================================================
     PASO 9: conectar las tarjetas del menú principal
     ============================================================ */
  document.querySelectorAll(".tarjeta-modo").forEach(tarjeta => {
    tarjeta.addEventListener("click", async () => {
      const modo = tarjeta.dataset.modo;
      // En los modos con voz pedimos el permiso del micrófono ANTES de empezar
      if ((modo === "hablar" || modo === "completo") && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const flujo = await navigator.mediaDevices.getUserMedia({ audio: true });
          flujo.getTracks().forEach(t => t.stop()); // solo era para pedir permiso
        } catch (e) { /* si lo bloquean, el juego abre igual y avisa al tocar el micrófono */ }
      }
      iniciarModo(modo);
    });
  });
    // Conectar el botón de Pausa
  document.getElementById("btnPausa").addEventListener("click", guardarEstadoJuego);
