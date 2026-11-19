/* ============================================================
   oraciones.js
   Build sentences: preguntas, fichas, categoría/dificultad y decir la oración en voz alta.
   ============================================================ */

  // Modo "oraciones": 12 preguntas al azar, armamos fichas con distractores
  function generarPreguntasDeOraciones() {
  // Mix = 4 oraciones de cada categoría (16); las demás categorías = 10 oraciones del nivel
  let lista = [];
  if (categoriaOraciones === "mix") {
    ["verbos", "animales", "comida", "cosas"].forEach(cat => {
      lista = lista.concat(mezclar(datosOraciones[cat][nivelOraciones]).slice(0, 4));
    });
  } else {
    lista = datosOraciones[categoriaOraciones][nivelOraciones];
  }
  const etiqueta = NIVELES[nivelOraciones].emoji + " " + NIVELES[nivelOraciones].nombre + " · " +
    CATEGORIAS.find(c => c.id === categoriaOraciones).emoji + " " +
    CATEGORIAS.find(c => c.id === categoriaOraciones).nombre;
  return mezclar(lista).map((item, idx) => ({
    verboIdx: idx,
    // La imagen es la de la oración: el dibujo del verbo o el emoji (así siempre coinciden)
    img: item.verbo ? rutaImagen(item.verbo) : imagenEmoji(item.emoji),
    oracionCorrecta: item.texto,
    traduccion: item.es,
    fichas: mezclar(item.texto.split(" ")),
    etiqueta: etiqueta
  }));
}

  /* ============================================================
     PASO 6c: modo "oraciones" -> se arma tocando fichas en orden
     ============================================================ */
  let fichasElegidas = []; // palabras que el usuario ya puso en la franja

  function prepararZonaOraciones(q) {
    restaurarZonaOraciones();
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
    const armada = fichasElegidas.map(item => item.palabra).join(" ");
    const esCorrecto = (armada === q.oracionCorrecta);

    // Si se equivoca, conserva las fichas puestas y puede corregir
    if (!esCorrecto) {
      manejarFallo(q.oracionCorrecta);
      respondiendo = false;
      return;
    }
    
    if ('speechSynthesis' in window) {
    const locucion = new SpeechSynthesisUtterance(q.oracionCorrecta);
    locucion.lang = 'en-US';
    window.speechSynthesis.speak(locucion);
    }

    marcarResultado(esCorrecto, q.oracionCorrecta);
    if (modoActual === "frases") setTimeout(() => irAPasoFrase(2), 1800); // sigue: escribir
    else if (modoActual === "oraciones") pasarAHablarOracion();
    else avanzar();
  }

  document.getElementById("btnVerificarOracion").addEventListener("click", verificarOracion);

  /* ============================================================
     BUILD SENTENCES: elegir categoría y dificultad, y decir la oración en voz alta
     Cuando la oración queda bien armada, se enciende el micrófono para que la diga.
     ============================================================ */
  let categoriaOraciones = "verbos";   // verbos, animales, comida, cosas o mix
  let nivelOraciones = "facil";        // facil, medio o dificil
  let reconocimientoOracion = null;    // el reconocimiento de voz que está escuchando ahora
  let numeroHablaOracion = 0;          // cambia en cada pregunta (así se ignoran audios viejos)
  let intentosHablaOracion = 0;        // veces que se equivocó al decir la oración
  let hablaOracionOk = false;          // ¿ya dijo bien la oración?

  function abrirPantallaNivelOraciones() {
    dibujarCategoriasOraciones();
    document.getElementById("pantallaMenu").classList.add("oculto");
    document.getElementById("app").classList.add("oculto");
    document.getElementById("pantallaNivelOraciones").classList.remove("oculto");
  }

  // Dibuja los botones de categoría (Verbs, Animals, Food, Things, Mix) y marca el elegido
  function dibujarCategoriasOraciones() {
    const fila = document.getElementById("filaCategoriasOraciones");
    fila.innerHTML = "";
    for (let i = 0; i < CATEGORIAS.length; i++) {
      const categoria = CATEGORIAS[i];
      const boton = document.createElement("button");
      boton.className = "chip-categoria";
      if (categoria.id === categoriaOraciones) boton.className += " activa";
      boton.textContent = categoria.emoji + " " + categoria.nombre;
      boton.addEventListener("click", function () {
        categoriaOraciones = categoria.id;
        dibujarCategoriasOraciones();
      });
      fila.appendChild(boton);
    }
    document.getElementById("textoCantidadOraciones").textContent =
      categoriaOraciones === "mix" ? "🎲 Mix: 16 sentences from all the categories" : "10 sentences per level";
  }

  // Al tocar una dificultad empieza el juego (se pide el micrófono antes, como en Speak)
  document.querySelectorAll(".boton-nivel-oraciones").forEach(function (boton) {
    boton.addEventListener("click", function () {
      nivelOraciones = boton.dataset.nivel;
      document.getElementById("pantallaNivelOraciones").classList.add("oculto");
      pedirMicrofono(function () { iniciarModo("oraciones"); });
    });
  });

  document.getElementById("btnVolverNivelOraciones").addEventListener("click", function () {
    document.getElementById("pantallaNivelOraciones").classList.add("oculto");
    mostrarMenuPrincipal();
  });

  // Deja la zona de oraciones lista para una pregunta nueva (fichas visibles, micrófono apagado)
  function restaurarZonaOraciones() {
    numeroHablaOracion++;
    if (reconocimientoOracion) {
      try { reconocimientoOracion.abort(); } catch (e) { /* ya estaba apagado */ }
      reconocimientoOracion = null;
    }
    hablaOracionOk = false;
    intentosHablaOracion = 0;
    document.getElementById("zonaOraciones").classList.remove("hablando");
    document.getElementById("zonaHablarOracion").classList.add("oculto");
    document.getElementById("btnMicOracion").classList.remove("oculto", "escuchando");
    document.getElementById("btnMicOracion").disabled = false;
    document.getElementById("btnSiguienteOracion").classList.add("oculto");
    document.getElementById("btnSiguienteOracion").disabled = false;
  }

  // La oración ya está bien armada: aparece el micrófono y se enciende solo
  function pasarAHablarOracion() {
    intentosHablaOracion = 0;
    hablaOracionOk = false;
    document.getElementById("zonaOraciones").classList.add("hablando");
    document.getElementById("zonaHablarOracion").classList.remove("oculto");
    document.getElementById("btnMicOracion").textContent = "🎤 Tap and say the sentence";

    if (!ReconocimientoVoz) {
      // Sin reconocimiento de voz (por ejemplo Firefox) no se puede comprobar: se deja seguir
      mensaje.textContent = "Your browser can't recognize speech. Try Chrome or Edge.";
      document.getElementById("btnMicOracion").classList.add("oculto");
      document.getElementById("btnSiguienteOracion").classList.remove("oculto");
      return;
    }
    mensaje.textContent += " Now say the sentence out loud! 🎤";
    esperarVozYEscuchar(numeroHablaOracion);
  }

  // Espera a que termine de sonar la oración (para que el micrófono no escuche a la página) y lo enciende
  function esperarVozYEscuchar(numero) {
    const sintetizador = ("speechSynthesis" in window) ? window.speechSynthesis : null;
    let esperado = 0;
    const revisar = setInterval(function () {
      esperado += 250;
      const juegoVisible = !document.getElementById("juegoEnCurso").classList.contains("oculto");
      if (numero !== numeroHablaOracion || !juegoVisible) { clearInterval(revisar); return; }
      const sonando = sintetizador && (sintetizador.speaking || sintetizador.pending);
      if ((esperado >= 750 && !sonando) || esperado >= 10000) {
        clearInterval(revisar);
        empezarEscuchaOracion();
      }
    }, 250);
  }

  function empezarEscuchaOracion() {
    if (!ReconocimientoVoz || reconocimientoOracion || hablaOracionOk) return;

    const numero = numeroHablaOracion;
    const q = preguntas[preguntaActual];
    const btn = document.getElementById("btnMicOracion");

    const reconocimiento = new ReconocimientoVoz();
    reconocimiento.lang = "en-US";
    reconocimiento.maxAlternatives = 5;
    reconocimiento.interimResults = false;
    reconocimientoOracion = reconocimiento;
    btn.classList.add("escuchando");
    btn.textContent = "🎙️ Listening... say the sentence";

    reconocimiento.onresult = (evento) => {
      if (numero !== numeroHablaOracion) return;
      const alternativas = Array.from(evento.results[0]).map(a => a.transcript);
      verificarHablaOracion(alternativas, q);
    };

    reconocimiento.onerror = (evento) => {
      if (numero !== numeroHablaOracion) return;
      if (evento.error === "not-allowed" || evento.error === "service-not-allowed") {
        mensaje.textContent = "I need permission to use the microphone.";
        document.getElementById("btnSiguienteOracion").classList.remove("oculto");
      } else if (evento.error === "network") {
        mensaje.textContent = "No internet (or the voice service is blocked). Check your connection or try Chrome.";
        document.getElementById("btnSiguienteOracion").classList.remove("oculto");
      } else if (evento.error === "no-speech") {
        mensaje.textContent = "I didn't hear you, tap the microphone and try again.";
      } else if (evento.error !== "aborted") {
        mensaje.textContent = "I could not hear you (" + evento.error + "). Try again.";
      }
    };

    reconocimiento.onend = () => {
      if (numero !== numeroHablaOracion) return;
      reconocimientoOracion = null;
      btn.classList.remove("escuchando");
      if (!hablaOracionOk) btn.textContent = "🎤 Tap and say the sentence";
    };

    try { reconocimiento.start(); }
    catch (e) { reconocimientoOracion = null; btn.classList.remove("escuchando"); }
  }

  // Compara lo que se escuchó con la oración. Desde el tercer error suena la ayuda (despacio).
  function verificarHablaOracion(alternativas, q) {
    const correcta = limpiarTexto(q.oracionCorrecta);
    const escuchadas = alternativas.map(limpiarTexto);

    if (escuchadas.some(t => coincideOracionHablada(t, correcta))) {
      hablaOracionOk = true;
      document.getElementById("btnMicOracion").disabled = true;
      mensaje.textContent = "Great pronunciation! 🎤🎉";
      avanzar();
      return;
    }

    intentosHablaOracion++;
    const oido = 'I heard: "' + (escuchadas[0] || "...") + '"';
    if (intentosHablaOracion >= 3) {
      mensaje.textContent = "💡 " + oido + ". Listen to the help and try again!";
      decirEnVozAlta(q.oracionCorrecta, 0.6);
    } else {
      mensaje.textContent = "❌ " + oido + ". Try again! (attempt " + intentosHablaOracion + " of 3)";
    }
  }

  // ¿Lo que se escuchó es la oración? Se compara palabra por palabra.
  // En oraciones de 6 palabras o más se perdona 1 palabra (el micrófono a veces se come una).
  function coincideOracionHablada(oido, correcta) {
    if (oido === correcta) return true;
    const a = oido.split(" ").filter(p => p !== "");
    const b = correcta.split(" ");
    const permitidas = b.length >= 6 ? 1 : 0;

    // palabras que coinciden en el mismo orden
    const tabla = [];
    for (let i = 0; i <= a.length; i++) tabla.push(new Array(b.length + 1).fill(0));
    for (let i = 1; i <= a.length; i++) {
      for (let k = 1; k <= b.length; k++) {
        tabla[i][k] = (a[i - 1] === b[k - 1])
          ? tabla[i - 1][k - 1] + 1
          : Math.max(tabla[i - 1][k], tabla[i][k - 1]);
      }
    }
    return tabla[a.length][b.length] >= b.length - permitidas && a.length <= b.length + permitidas;
  }

  document.getElementById("btnMicOracion").addEventListener("click", empezarEscuchaOracion);
  document.getElementById("btnSiguienteOracion").addEventListener("click", function () {
    this.disabled = true;
    avanzar();
  });

