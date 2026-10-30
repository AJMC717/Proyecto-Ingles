/* ============================================================
   audio.js
   Voz y micrófono: que la página hable (speechSynthesis) y te escuche (SpeechRecognition).
   ============================================================ */

  /* ============================================================
     PASO AUDIO 1: que la página HABLE (texto -> voz)
     Usa "speechSynthesis", que viene incluido en el navegador:
     no hay que descargar archivos de audio ni pagar nada.
     ============================================================ */
  function decirEnVozAlta(texto, velocidad) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel(); // corta lo que estuviera sonando
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = "en-US";              // pronunciacion en ingles
    voz.rate = velocidad || 0.9;     // 1 = normal, menos = mas lento
    window.speechSynthesis.speak(voz);
  }

  // Version rapida para palabras sueltas (modo "Build sentences")
let ultimaVoz = null; // guardamos la referencia para que el navegador no la borre
let vozLocal = null;  // voz instalada en el equipo (suena sin demora)

function elegirVozLocal() {
  const voces = window.speechSynthesis.getVoices();
  vozLocal = voces.find(v => v.lang === "en-US" && v.localService)
          || voces.find(v => v.lang.startsWith("en") && v.localService)
          || null;
}
if ("speechSynthesis" in window) {
  elegirVozLocal();
  window.speechSynthesis.onvoiceschanged = elegirVozLocal;
}

function decirPalabraRapida(texto) {
  if (!("speechSynthesis" in window)) return;
  const sintetizador = window.speechSynthesis;
  if (sintetizador.speaking || sintetizador.pending) sintetizador.cancel();
  ultimaVoz = new SpeechSynthesisUtterance(texto);
  ultimaVoz.lang = "en-US";
  if (vozLocal) ultimaVoz.voice = vozLocal;
  ultimaVoz.rate = 0.9;
  sintetizador.speak(ultimaVoz);
}

  // "Calentamos" el motor de voz en el primer toque, para que la primera palabra no tarde
  function calentarVoz() {
    if (!("speechSynthesis" in window)) return;
    const silencio = new SpeechSynthesisUtterance(" ");
    silencio.volume = 0;
    window.speechSynthesis.speak(silencio);
  }
  document.addEventListener("pointerdown", calentarVoz, { once: true });

  document.getElementById("btnOirNormal").addEventListener("click", () => {
    decirEnVozAlta(preguntas[preguntaActual].respuestaCorrecta, 0.9);
  });
  document.getElementById("btnOirLento").addEventListener("click", () => {
    decirEnVozAlta(preguntas[preguntaActual].respuestaCorrecta, 0.5);
  });

  /* ============================================================
     PASO AUDIO 2: que la página ESCUCHE (voz -> texto)
     Usa "SpeechRecognition". Funciona en Chrome y Edge
     (en Firefox no existe). Pide permiso para usar el micrófono.
     ============================================================ */
  const ReconocimientoVoz = window.SpeechRecognition || window.webkitSpeechRecognition;
  let escuchando = false;
  const btnMic = document.getElementById("btnMic");

  function prepararZonaHablar() {
    escuchando = false;
    btnMic.classList.remove("escuchando");
    btnMic.disabled = false;
    btnMic.textContent = "🎤 Tap and say the verb";
   
    if (!ReconocimientoVoz) {
      mensaje.textContent = "Your browser can't recognize speech. Try Chrome or Edge.";
    }
  }

  function empezarAEscuchar() {
    if (!ReconocimientoVoz || escuchando || respondiendo) return;

    const reconocimiento = new ReconocimientoVoz();
    reconocimiento.lang = "en-US";      // esperamos que hable en inglés
    reconocimiento.maxAlternatives = 5; // pedimos varias "posibles" transcripciones
    reconocimiento.interimResults = false;

    escuchando = true;
    btnMic.classList.add("escuchando");
    btnMic.textContent = "🎙️ Listening...";
    mensaje.textContent = "";

    reconocimiento.onresult = (evento) => {
      const alternativas = Array.from(evento.results[0]).map(a => a.transcript);
      verificarHabla(alternativas);
    };

    reconocimiento.onerror = (evento) => {
      if (evento.error === "not-allowed" || evento.error === "service-not-allowed") {
        mensaje.textContent = "I need permission to use the microphone.";
      } else if (evento.error === "network") {
        mensaje.textContent = "No internet (or the voice service is blocked). Check your connection or try Chrome.";
      } else if (evento.error === "no-speech") {
        mensaje.textContent = "I didn't hear you, try again.";
      } else {
        mensaje.textContent = "I could not hear you (" + evento.error + "). Try again.";
      }
    };

    reconocimiento.onend = () => {
      escuchando = false;
      btnMic.classList.remove("escuchando");
      if (!respondiendo) btnMic.textContent = "🎤 Tap and say the verb";
    };

    reconocimiento.start();
  }

  function limpiarTexto(texto) {
    return texto.toLowerCase().replace(/[^a-z' ]/g, "").trim();
  }

  function verificarHabla(alternativas) {
    if (respondiendo) return;
    respondiendo = true;

    const q = preguntas[preguntaActual];
    const correcta = limpiarTexto(q.respuestaCorrecta);
    const escuchadas = alternativas.map(limpiarTexto);

    // En el modo "completo" se puede intentar las veces que quieras (no suma puntos)
    if (modoActual === "completo") {
      respondiendo = false;
      const ok = escuchadas.some(t => t === correcta || t.split(" ").includes(correcta));
      mensaje.textContent = ok ? "Great pronunciation! 🎤🎉"
        : 'I heard: "' + (escuchadas[0] || "...") + '" — try again!';
      if (ok) pronunciacionOk = true;
      else manejarFallo(q.respuestaCorrecta, 'I heard: "' + (escuchadas[0] || "...") + '"');
      return;
    }

    // Es correcto si alguna de las transcripciones es el verbo
    // (o lo contiene, por si dijo "to play" o "play play")
    const esCorrecto = escuchadas.some(t => t === correcta || t.split(" ").includes(correcta));

    // Si falla (y el navegador sí reconoce voz), se queda en la misma pregunta
    if (!esCorrecto && ReconocimientoVoz) {
      respondiendo = false;
      manejarFallo(q.respuestaCorrecta, escuchadas[0] ? 'I heard: "' + escuchadas[0] + '"' : "");
      return;
    }

    marcarResultado(esCorrecto, q.respuestaCorrecta);
    if (!esCorrecto && escuchadas[0]) {
      mensaje.textContent = 'I heard: "' + escuchadas[0] + '" — It was: ' + q.respuestaCorrecta;
    }
    avanzar();
  }

  btnMic.addEventListener("click", empezarAEscuchar);
