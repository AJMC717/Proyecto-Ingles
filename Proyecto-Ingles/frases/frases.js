/* ============================================================
   frases.js
   Frequent phrases: pantalla de categoría/nivel y los pasos de cada frase.
   ============================================================ */

  /* ============================================================
     FRASES DE USO FRECUENTE
     Parte 1: pantalla para elegir la categoría y el nivel
     Parte 2: los 4 pasos de cada frase (armar, escribir, escuchar y decir)
     Los datos están en datos.js (CATEGORIAS_FRASES y frasesPorCategoria).
     ============================================================ */

  /* ---------- Parte 1: categoría y nivel ---------- */
  let categoriaFrases = "saludos";   // categoría elegida (id de CATEGORIAS_FRASES)
  let nivelFrases = "facil";         // nivel elegido: facil, medio o dificil

  // Muestra la pantalla de categoría y nivel
  function abrirPantallaFrases() {
    dibujarCategoriasFrases();
    document.getElementById("pantallaMenu").classList.add("oculto");
    document.getElementById("app").classList.add("oculto");
    document.getElementById("pantallaFrases").classList.remove("oculto");
  }

  // Dibuja los botones de categoría y marca el elegido
  function dibujarCategoriasFrases() {
    const fila = document.getElementById("filaCategoriasFrases");
    fila.innerHTML = "";
    for (let i = 0; i < CATEGORIAS_FRASES.length; i++) {
      const categoria = CATEGORIAS_FRASES[i];
      const boton = document.createElement("button");
      boton.className = "chip-categoria";
      if (categoria.id === categoriaFrases) boton.className += " activa";
      boton.textContent = categoria.emoji + " " + categoria.nombre;
      boton.addEventListener("click", function () {
        categoriaFrases = categoria.id;
        dibujarCategoriasFrases();
      });
      fila.appendChild(boton);
    }
    document.getElementById("textoCantidadFrases").textContent =
      categoriaFrases === "mix" ? "🎲 Mix: 10 random phrases from all the categories" : "10 phrases per level";
  }

  // Devuelve las frases de una categoría y un nivel.
  // Mix = 10 frases al azar, tomadas de todas las categorías en ese nivel.
  function listaDeFrases(categoria, nivel) {
    if (categoria === "mix") {
      let todas = [];
      for (const id in frasesPorCategoria) {
        todas = todas.concat(frasesPorCategoria[id][nivel] || []);
      }
      return mezclar(todas).slice(0, 10);
    }
    const datosCategoria = frasesPorCategoria[categoria] || {};
    return datosCategoria[nivel] || [];
  }

  // Al tocar un nivel empieza el juego (se pide el micrófono antes)
  document.querySelectorAll(".boton-nivel-frases").forEach(function (boton) {
    boton.addEventListener("click", function () {
      nivelFrases = boton.dataset.nivel;
      if (listaDeFrases(categoriaFrases, nivelFrases).length === 0) {
        mostrarAlerta("Aún no hay contenido", "🚧 Este nivel todavía no tiene frases.");
        return;
      }
      document.getElementById("pantallaFrases").classList.add("oculto");
      pedirMicrofono(function () { iniciarModo("frases"); });
    });
  });

  document.getElementById("btnVolverFrases").addEventListener("click", function () {
    document.getElementById("pantallaFrases").classList.add("oculto");
    mostrarMenuPrincipal();
  });

  /* ---------- Parte 2: los 4 pasos de cada frase ----------
     Paso 1: armar la frase con fichas -> Paso 2: escribirla
     Paso 3: escucharla -> Paso 4: decirla (y pasa a la siguiente frase) */
  let pasoFrase = 1;

  // Compara sin mayúsculas ni signos (¿ ? ¡ ! . ,)
  function normalizarFrase(texto) {
    return texto.toLowerCase().replace(/[¿?¡!.,]/g, "").replace(/\s+/g, " ").trim();
  }

  // Arma la lista de preguntas de la ronda con las frases de la categoría y el nivel
  function generarPreguntasDeFrases() {
    const lista = listaDeFrases(categoriaFrases, nivelFrases);
    return mezclar(lista).map((item, idx) => ({
      verboIdx: idx,
      img: item.img ? rutaImagenFrase(item.img) : imagenRespaldoFrase(item.emoji),
      imgRespaldo: imagenRespaldoFrase(item.emoji),
      oracionCorrecta: item.texto,    // paso 1 (armar)
      respuestaCorrecta: item.texto,  // pasos 2, 3 y 4 (escribir, escuchar, hablar)
      traduccion: item.es,
      fichas: mezclar(item.texto.split(" "))
    }));
  }

  function irAPasoFrase(n) {
    pasoFrase = n;
    const q = preguntas[preguntaActual];
    const consigna = document.getElementById("consigna");
    document.getElementById("zonaOraciones").classList.toggle("oculto", n !== 1);
    document.getElementById("zonaTexto").classList.toggle("oculto", n !== 2);
    document.getElementById("zonaAudio").classList.toggle("oculto", n !== 3);
    document.getElementById("zonaHablar").classList.toggle("oculto", n !== 4);
    document.getElementById("zonaPaso").classList.toggle("oculto", n < 3);
    consigna.classList.remove("oculto");
    respondiendo = false;
    intentos = 0;
    pronunciacionOk = false;

    if (n === 1) {
      consigna.textContent = q.traduccion;
      mensaje.textContent = "🧩 Step 1: tap the words to build the phrase.";
      prepararZonaOraciones(q);
    } else if (n === 2) {
      consigna.textContent = q.traduccion;
      mensaje.textContent = "✍️ Step 2: now write the phrase yourself.";
      inputRespuesta.placeholder = "Write the phrase in English...";
      prepararZonaTexto();
    } else if (n === 3) {
      consigna.textContent = q.respuestaCorrecta;
      mensaje.textContent = "🔊 Step 3: listen to the phrase as many times as you want.";
      btnPaso.textContent = "Now speak ➡";
      decirEnVozAlta(q.respuestaCorrecta, 0.9);
    } else {
      consigna.textContent = q.respuestaCorrecta;
      mensaje.textContent = "🎤 Step 4: say the phrase out loud!";
      btnPaso.textContent = "Next phrase ➡";
      prepararZonaHablar();
    }
  }

  // Botón de abajo en los pasos 3 y 4 de las frases
  function botonSiguienteFrase() {
    if (pasoFrase === 3) { irAPasoFrase(4); return; }
    // Para pasar a la siguiente frase hay que pronunciar bien (si el navegador reconoce voz)
    if (!pronunciacionOk && ReconocimientoVoz) {
      mensaje.textContent = "🎤 Say the phrase correctly to go to the next one.";
      return;
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    preguntaActual++;
    if (preguntaActual < preguntas.length) mostrarPregunta();
    else mostrarPantallaFinal();
  }
