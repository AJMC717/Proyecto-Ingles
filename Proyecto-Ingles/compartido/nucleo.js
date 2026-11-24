/* ============================================================
   nucleo.js
   Parte compartida del juego: variables, arranque de modos, mostrarPregunta, verificar respuestas,
   puntos/racha, pantalla final, pausa/guardado y menús.
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
  let dificultadActual = "facil";


function seleccionarDificultad(nivel, btn) {
  dificultadActual = nivel;
  resaltarDificultadMenu(nivel, btn);
}

function resaltarDificultadMenu(nivel, btn) {
  // Sincroniza el resaltado del menú aunque el cambio venga del catálogo de música.
  document.querySelectorAll('.btn-dif').forEach(b => {
    const activo = (b === btn) || (b.dataset.dificultad === nivel);
    b.style.background = activo ? '#E8F5E9' : 'white';
    b.style.borderColor = activo ? '#58CC02' : '#E5E5E5';
    b.style.transform = activo ? 'scale(1.05)' : 'scale(1)';
  });
}
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
     PASO 4: arrancar un modo de juego
     ============================================================ */
  function iniciarModo(modo) {
    const estadoGuardado = JSON.parse(localStorage.getItem(claveGuardado(modo)));

    // 1. Verificar si hay partida guardada en ESTE modo
    if (estadoGuardado && estadoGuardado.modo === modo) {
      mostrarConfirm(
        '⏸️ Partida guardada encontrada',
        `Tienes una partida guardada en este modo:<br><br>
          📍 Pregunta: <b>${estadoGuardado.preguntaActual + 1}</b><br>
          ⭐ Puntos: <b>${estadoGuardado.puntos}</b><br>
          🔥 Racha: <b>${estadoGuardado.racha}</b><br><br>
          ¿Deseas continuar donde lo dejaste?`,
        () => {
          // Acción si acepta (continuar)
          modoActual = estadoGuardado.modo;
          if (estadoGuardado.dificultad) dificultadActual = estadoGuardado.dificultad;
          if (estadoGuardado.nivelFlash) nivelFlash = estadoGuardado.nivelFlash;
          if (estadoGuardado.categoriaFlash) categoriaFlash = estadoGuardado.categoriaFlash;
          mejorRacha = leerMejorRacha(modo);
          preguntaActual = estadoGuardado.preguntaActual;
          puntos = estadoGuardado.puntos;
          racha = estadoGuardado.racha;
          preguntas = estadoGuardado.preguntas;
          if (modo === "completo") pasoCompleto = estadoGuardado.pasoCompleto || 1;
          if (modo === "frases") {
            if (estadoGuardado.categoriaFrases) categoriaFrases = estadoGuardado.categoriaFrases;
            if (estadoGuardado.nivelFrases) nivelFrases = estadoGuardado.nivelFrases;
          }
          mostrarInterfazJuego();
          mostrarPregunta();
        },
        () => {
          // Acción si cancela (empezar de cero)
          localStorage.removeItem(claveGuardado(modo));
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

    if (MODOS_VERBOS.includes(modo)) {
      preguntas = generarPreguntasFlash();
    } else if (modo === "oraciones") {
      preguntas = generarPreguntasDeOraciones();
    } else if (modo === "preguntas"){
      preguntas = generarPreguntasDePreguntas();
    } else if (modo === "frases") {
      preguntas = generarPreguntasDeFrases();
    }

    // Si ese nivel todavía no tiene contenido, avisamos y no abrimos el juego
    if (preguntas.length === 0) {
      mostrarAlerta('Aún no hay contenido', '🚧 Este nivel todavía no tiene preguntas en este modo. Prueba el nivel <b>Fácil</b>.');
      return;
    }

    mostrarInterfazJuego();
    mostrarPregunta();
  }

  function mostrarInterfazJuego() {
    document.getElementById("pantallaMenu").classList.add("oculto");
    document.getElementById("juegoFinal").classList.add("oculto");
    document.getElementById("juegoEnCurso").classList.remove("oculto");
    document.getElementById("app").classList.add("oculto");
    document.getElementById("pantallaMenuVerbos").classList.add("oculto");
    document.getElementById("pantallaNivel").classList.add("oculto");
    const seccionMusica = document.getElementById("seccion-musica");
    if (seccionMusica) seccionMusica.classList.add("oculto");
    // El cartelito del nivel solo se ve en Flash Cards
    document.getElementById("chipNivel").classList.toggle("oculto", !MODOS_VERBOS.includes(modoActual));

    document.getElementById("zonaTexto").classList.toggle("oculto", !(modoActual === "escribir" || modoActual === "escuchar" || modoActual === "completo"));
    document.getElementById("zonaAudio").classList.toggle("oculto", modoActual !== "escuchar");
    document.getElementById("zonaHablar").classList.toggle("oculto", modoActual !== "hablar");
    document.querySelector(".carrusel").classList.toggle("solo-audio", modoActual === "escuchar" && nivelFlash !== "facil");
    document.querySelector(".carrusel").classList.toggle("carrusel-frases", modoActual === "frases"); // tamaño de imagen solo para Frases
    document.getElementById("zonaPaso").classList.add("oculto");
    // En modo preguntas, ocultar ambas zonas por defecto (se controlan dinámicamente en mostrarPregunta)
    if (modoActual === "preguntas") {
      document.getElementById("zonaTexto").classList.add("oculto");
      document.getElementById("zonaOpciones").classList.add("oculto");
    } else {
      document.getElementById("zonaTexto").classList.toggle("oculto", !(modoActual === "escribir" || modoActual === "escuchar" || modoActual === "completo"));
      document.getElementById("zonaOpciones").classList.toggle("oculto", modoActual !== "elegir");
    }
    document.getElementById("zonaOraciones").classList.toggle("oculto", modoActual !== "oraciones");
    document.getElementById("consigna").classList.toggle("oculto", modoActual !== "oraciones" && modoActual !== "preguntas");

    // Limpiar cualquier resto del modo Preguntas para que no afecte a los demás módulos
    const juegoEl = document.getElementById("juegoEnCurso");
    juegoEl.classList.toggle("modo-preguntas", modoActual === "preguntas");
    if (modoActual !== "preguntas") juegoEl.classList.remove("qa-dificil");
    ["zonaTexto", "zonaOpciones"].forEach(id => {
      const el = document.getElementById(id);
      el.removeAttribute("style");
    });
    const imgA = document.getElementById("imagenActual");
    imgA.style.removeProperty("opacity");
    imgA.style.removeProperty("transform");
    imgA.style.removeProperty("filter");
  }
     
  

  function volverAlMenu() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    document.getElementById("juegoEnCurso").classList.add("oculto");
    document.getElementById("juegoFinal").classList.add("oculto");
    // Vuelve al menú de donde vino: los modos de verbos al submenú, los demás al principal
    if (MODOS_VERBOS.includes(modoActual)) mostrarMenuVerbos();
    else mostrarMenuPrincipal();
  }

  /* ============================================================
     PASO 5: mostrar la pregunta actual (con su carrusel de imágenes)
     ============================================================ */
  function mostrarPregunta() {
    const q = preguntas[preguntaActual];
    pintarColores(q.verboIdx);

    const img = document.getElementById("imagenActual");
    ponerImagen(img, q);
    img.classList.remove("entrando");
    void img.offsetWidth;
    img.classList.add("entrando");

    // Imagen anterior / siguiente, de fondo (en vez de botones)
    const anteriorQ = preguntas[(preguntaActual - 1 + preguntas.length) % preguntas.length];
    const siguienteQ = preguntas[(preguntaActual + 1) % preguntas.length];
    ponerImagen(document.getElementById("imagenAnterior"), anteriorQ);
    ponerImagen(document.getElementById("imagenSiguiente"), siguienteQ);

    document.getElementById("chipPregunta").textContent =
      "Question " + (preguntaActual + 1) + "/" + preguntas.length;
    document.getElementById("chipPuntos").textContent = "⭐ " + puntos + " points";
    document.getElementById("chipRacha").textContent = "🔥 Streak: " + racha;

    // Cartelito con el nivel y la categoría (solo en Flash Cards; en Preguntas se omite)
    if (modoActual !== "preguntas") {
      document.getElementById("chipNivel").textContent = nombreNivelFlash() + " · " + nombreCategoriaFlash();
    }

    mensaje.textContent = "";
    respondiendo = false;
    intentos = 0;

    if (modoActual === "escribir") {
      inputRespuesta.placeholder = textoPlaceholder();
      ponerPista(pistaDeLetras(q.respuestaCorrecta));   // la pista depende del nivel
      prepararZonaTexto();
    } else if (modoActual === "elegir") {
      prepararZonaOpciones(q);
    } else if (modoActual === "oraciones") {
      document.getElementById("consigna").textContent = q.traduccion;
      document.getElementById("chipNivel").textContent = q.etiqueta;
      document.getElementById("chipNivel").classList.remove("oculto");
      prepararZonaOraciones(q);
    } else if (modoActual === "escuchar") {
      document.querySelector(".carrusel").classList.remove("revelada");
      inputRespuesta.placeholder = "Write what you heard...";
      prepararZonaTexto();
      // Esperamos un ratito para que cargue la tarjeta y reproducimos el verbo
      setTimeout(() => decirEnVozAlta(q.respuestaCorrecta, velocidadDeNivel()), 400);
    } else if (modoActual === "hablar") {
      // En Easy se muestra la palabra escrita como ayuda; en los otros niveles no
      ponerPista(nivelFlash === "facil" ? q.respuestaCorrecta : "");
      prepararZonaHablar();
    } else if (modoActual === "completo") {
      irAPaso(1);
    } else if (modoActual === "preguntas") {
      // 1. Consigna
      document.getElementById("consigna").innerHTML = q.consigna;
      
      // 2. Mostrar opciones (fácil) o campo de texto (medio/difícil) solo con clases
      const juego = document.getElementById("juegoEnCurso");
      juego.classList.toggle("qa-dificil", dificultadActual === "dificil");
      if (dificultadActual === "facil") {
        document.getElementById("zonaTexto").classList.add("oculto");
        document.getElementById("zonaOpciones").classList.remove("oculto");
        prepararZonaOpciones(q);
      } else {
        document.getElementById("zonaOpciones").classList.add("oculto");
        document.getElementById("zonaTexto").classList.remove("oculto");
        inputRespuesta.placeholder = "Type your answer here...";
        prepararZonaTexto();
      }
    } else if (modoActual === "frases") {
      irAPasoFrase(1);
    }
  }

  function prepararZonaTexto() {
    inputRespuesta.value = "";
    inputRespuesta.classList.remove("correcta", "incorrecta");
    inputRespuesta.disabled = false;
    inputRespuesta.focus();
  }

  /* ============================================================
     PASO 6a: modos "escribir", "escuchar" y "completo" -> se escribe la respuesta
     ============================================================ */
  function verificarTexto() {
    if (respondiendo) return;
    respondiendo = true;

    const q = preguntas[preguntaActual];
    const escrito = inputRespuesta.value.trim();

    let esCorrecto = false;
    if (modoActual === "frases") {
      esCorrecto = normalizarFrase(escrito) === normalizarFrase(q.respuestaCorrecta);
    } else if (modoActual === "preguntas") {
      // Para preguntas, comparamos todo en minúsculas para ser justos
      esCorrecto = escrito.toLowerCase() === q.respuestaCorrecta.toLowerCase();
    } else {
      esCorrecto = escrito.toLowerCase() === q.respuestaCorrecta.toLowerCase();
    }
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
    // En las frases, los puntos se dan solo en el paso 1 (armar); aquí es práctica
    marcarResultado(esCorrecto, q.respuestaCorrecta, modoActual !== "frases");
    inputRespuesta.classList.add(esCorrecto ? "correcta" : "incorrecta");

    if (modoActual === "completo") setTimeout(() => irAPaso(2), 1500);
    else if (modoActual === "frases") setTimeout(() => irAPasoFrase(3), 1800);
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
    let opciones = (q.opciones && q.opciones.length > 0) ? q.opciones
                 : (q.opcionesFlash && q.opcionesFlash.length > 0) ? q.opcionesFlash
                 : [q.respuestaCorrecta];
    opciones = mezclar(opciones.slice());   // la correcta no siempre en la misma posición
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
     PASO 7: lo que pasa después de responder (puntos, racha, mensaje)
     ============================================================ */
  // Cada fallo: mensaje con el número de intento. Desde el tercero suena la ayuda (la palabra, despacio).
  // No se avanza hasta acertar.
  function manejarFallo(respuestaCorrecta, extra) {
    intentos++;
    if (intentos === 1 && !(modoActual === "completo" && pasoCompleto === 3) && !(modoActual === "frases" && pasoFrase !== 1)) {
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

  function marcarResultado(esCorrecto, respuestaCorrecta, sumarPuntos = true) {
    document.querySelector(".carrusel").classList.add("revelada");
    decirEnVozAlta(respuestaCorrecta, 0.9); // al responder, escuchás la pronunciación correcta
    if (esCorrecto) {
      mensaje.textContent = "Great job! 🎉";
      // Los puntos y la racha solo se suman si acertó a la primera
      if (intentos === 0 && sumarPuntos) {
        puntos += 10;
        racha += 1;
        if (racha > mejorRacha) {
          mejorRacha = racha;
          guardarMejorRacha(modoActual, mejorRacha);
        }
      } else if (intentos > 0) {
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
    // Espera 1,8 segundos (para ver el resultado y oír el audio) y pasa a la siguiente pregunta
    setTimeout(function () {
      preguntaActual++;
      if (preguntaActual < preguntas.length) {
        mostrarPregunta();
      } else {
        mostrarPantallaFinal();
      }
    }, 1800);
  }

  /* ============================================================
     PASO 8: pantalla final con resumen y galería premio
     ============================================================ */
  function mostrarPantallaFinal() {    guardarResumenEnHistorial();
    localStorage.removeItem(claveGuardado(modoActual));
    document.getElementById("juegoEnCurso").classList.add("oculto");
    document.getElementById("juegoFinal").classList.remove("oculto");

    document.getElementById("resultadoTexto").textContent =
      "Score: " + puntos + " points (" + Math.round(puntos/10) + " / " + preguntas.length + " correct)";
    document.getElementById("mejorRachaTexto").textContent =
      "🔥 Best streak: " + mejorRacha;

    const galeria = document.getElementById("galeria");
    galeria.innerHTML = "";
    // El premio son las imágenes de la ronda (en Flash Cards y Frases); en los demás, los verbos
    const imagenesPremio = (modoActual === "frases" || MODOS_VERBOS.includes(modoActual)) ? preguntas : verbos;
    imagenesPremio.forEach(v => {
      const img = document.createElement("img");
      ponerImagen(img, v);
      galeria.appendChild(img);
    });
  }

  document.getElementById("btnJugarDeNuevo").addEventListener("click", () => iniciarModo(modoActual));
  document.getElementById("btnElegirOtroModo").addEventListener("click", volverAlMenu);
  document.getElementById("btnVolverMenu").addEventListener("click", volverAlMenu);

    // === SISTEMA DE PAUSA Y GUARDADO DE PARTIDA ===

  // Nombre con el que se guarda la partida pausada.
  // Cada opción de Flash Cards (modo + categoría + nivel) tiene su propia partida,
  // así "Write the word / Verbs / Easy" no se mezcla con "Write the word / Animals / Easy".
  // Los demás modos siguen con una sola partida guardada por usuario, como antes.
  function claveGuardado(modo) {
    const user = localStorage.getItem('userActual');
    
    // Modos de Flash Cards: cada categoría + nivel tiene su propia partida
    if (MODOS_VERBOS.includes(modo)) {
      return 'estado_flash_' + user + '|' + modo + '|' + categoriaFlash + '|' + nivelFlash;
    }
    
    // Frases: cada categoría + nivel tiene su propia partida
    if (modo === "frases") {
      return 'estado_frases_' + user + '|' + categoriaFrases + '|' + nivelFrases;
    }
    
    // Modo preguntas: cada nivel de dificultad tiene su propia partida
    if (modo === "preguntas") {
      return 'estado_preguntas_' + user + '|' + dificultadActual;
    }
    
    // Oraciones: cada categoría + nivel tiene su propia partida
    if (modo === "oraciones") {
      return 'estado_oraciones_' + user + '|' + categoriaOraciones + '|' + nivelOraciones;
    }
    
    // Los demás modos: una sola partida por usuario
    return 'estado_juego_' + user;
  }
  function guardarEstadoJuego() {
    const estado = {
      modo: modoActual,
      dificultad: dificultadActual,
      nivelFlash: nivelFlash,
      categoriaFlash: categoriaFlash,
      preguntaActual: preguntaActual,
      puntos: puntos,
      racha: racha,
      preguntas: preguntas, // Guarda el orden exacto de las preguntas
      pasoCompleto: pasoCompleto
    };
    if (modoActual === "frases") {
      estado.categoriaFrases = categoriaFrases;
      estado.nivelFrases = nivelFrases;
    }
    localStorage.setItem(claveGuardado(modoActual), JSON.stringify(estado));
    mostrarAlerta('⏸️ Juego pausado', '✅ Tu progreso fue guardado correctamente.<br><br>Puedes salir y continuar cuando quieras.');
    volverAlMenu();
  }

  /* ============================================================
     PASO 9: conectar las tarjetas del menú principal
     ============================================================ */
  // Pide permiso para usar el micrófono ANTES de empezar y luego ejecuta "despues"
  function pedirMicrofono(despues) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      despues();
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (flujo) {
        flujo.getTracks().forEach(function (t) { t.stop(); });  // solo era para pedir el permiso
        despues();
      })
      .catch(function () {
        despues();   // si lo bloquean, el juego abre igual y avisa al tocar el micrófono
      });
  }

  document.querySelectorAll(".tarjeta-modo").forEach(function (tarjeta) {
    tarjeta.addEventListener("click", function () {
      const modo = tarjeta.dataset.modo;
      
      if (modo === "submenu-verbos") { mostrarMenuVerbos(); return; }
      if (MODOS_VERBOS.includes(modo)) { abrirPantallaNivel(modo); return; }
      if (modo === "oraciones") { abrirPantallaNivelOraciones(); return; }
      if (modo === "submenu-frases") { abrirPantallaFrases(); return; }
      
      // === NUEVO: Si es preguntas, abrir SU propia pantalla de dificultad ===
      if (modo === "preguntas") { 
        abrirPantallaNivelPreguntas(); 
        return; 
      }
      
      if (modo === "musica") {
        if (typeof abrirSeccionMusica === "function") abrirSeccionMusica();
        return;
      }
      iniciarModo(modo);
    });
  });
    // Conectar el botón de Pausa
  document.getElementById("btnPausa").addEventListener("click", guardarEstadoJuego);


  /* ============================================================
     MENÚS: principal y submenú de verbos
     ============================================================ */
  const MODOS_VERBOS = ["completo", "escribir", "elegir", "escuchar", "hablar"];

  function mostrarMenuPrincipal() {
    document.getElementById("pantallaMenu").classList.remove("oculto");
    document.getElementById("pantallaMenuVerbos").classList.add("oculto");
    document.getElementById("pantallaNivel").classList.add("oculto");
    const seccionMusica = document.getElementById("seccion-musica");
    if (seccionMusica) seccionMusica.classList.add("oculto");
    document.getElementById("app").classList.remove("oculto"); // saludo, Perfil, historial y cerrar sesión
  }

  function mostrarMenuVerbos() {
    document.getElementById("pantallaMenu").classList.add("oculto");
    document.getElementById("pantallaMenuVerbos").classList.remove("oculto");
    document.getElementById("pantallaNivel").classList.add("oculto");
    document.getElementById("app").classList.add("oculto");
  }

  document.getElementById("btnVolverPrincipal").addEventListener("click", mostrarMenuPrincipal);

  /* ============================================================
     IMÁGENES con respaldo (si la imagen no existe se usa el dibujo de respaldo)
     ============================================================ */
  function ponerImagen(elemento, q) {
    elemento.onerror = null;
    if (q.imgRespaldo) {
      elemento.onerror = () => { elemento.onerror = null; elemento.src = q.imgRespaldo; };
    }
    elemento.src = q.img;
  }

