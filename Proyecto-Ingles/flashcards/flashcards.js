/* ============================================================
   flashcards.js
   Write, Listen and Speak: preguntas por categoría/nivel, pantalla de nivel, pistas y modo completo (3 pasos).
   ============================================================ */

  // Flash Cards: lo que se eligió en la pantalla de nivel
  let categoriaFlash = "verbos";   // verbos, animales, comida, cosas o mix
  let nivelFlash = "facil";        // facil, medio o dificil

  /* ============================================================
     PASO 3: generar las preguntas según el modo elegido
     ============================================================ */

  // FLASH CARDS (completo, escribir, elegir, escuchar y hablar):
  // las palabras dependen de la categoría y del nivel que se eligieron
  function generarPreguntasFlash() {
    const palabras = mezclar(palabrasDelNivel(categoriaFlash, nivelFlash)).slice(0, 10);
    const todas = todasLasPalabras(categoriaFlash);
    const lista = [];

    for (let i = 0; i < palabras.length; i++) {
      const pregunta = {
        verboIdx: i,                        // (se usa para cambiar los colores)
        img: palabras[i].img,
        respuestaCorrecta: palabras[i].palabra
      };
      if (modoActual === "elegir") {
        pregunta.opcionesFlash = armarOpciones(palabras[i], todas);
      }
      lista.push(pregunta);
    }
    return lista;
  }

  // Opciones del modo "elegir": Easy = 3, Medium = 4, Hard = 6
  function armarOpciones(palabra, todas) {
    let cantidad = 4;
    if (nivelFlash === "facil") cantidad = 3;
    if (nivelFlash === "dificil") cantidad = 6;

    const opciones = [palabra.palabra];
    const otras = mezclar(todas);
    for (let i = 0; i < otras.length && opciones.length < cantidad; i++) {
      if (otras[i].palabra !== palabra.palabra) opciones.push(otras[i].palabra);
    }
    return opciones;
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
    if (n === 1) {
      ponerPista(pistaDeLetras(q.respuestaCorrecta));   // pista según el nivel (puede estar vacía)
    } else {
      consigna.textContent = q.respuestaCorrecta;
      consigna.classList.remove("oculto");
    }
    respondiendo = false;
    intentos = 0;
    pronunciacionOk = false;

    if (n === 1) {
      document.querySelector(".carrusel").classList.remove("revelada");
      inputRespuesta.placeholder = textoPlaceholder();
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
    if (modoActual === "frases") { botonSiguienteFrase(); return; }
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
     FLASH CARDS: pantalla para elegir la categoría y el nivel
     Al tocar una opción de Flash Cards, primero se elige QUÉ practicar
     (verbos, animales...) y el NIVEL (Easy, Medium, Hard).
     ============================================================ */
  let modoPendiente = null;   // la opción de Flash Cards que tocó el usuario

  function abrirPantallaNivel(modo) {
    modoPendiente = modo;
    const nombres = {
      completo: "Write, Listen and Speak",
      escribir: "Write the word",
      elegir: "Choose the right word",
      escuchar: "Listen and write",
      hablar: "Speak"
    };
    document.getElementById("tituloNivel").textContent = nombres[modo];
    dibujarCategorias();
    document.getElementById("pantallaMenuVerbos").classList.add("oculto");
    document.getElementById("pantallaNivel").classList.remove("oculto");
  }

  // Dibuja los botones de categoría (Verbs, Animals, Food...) y marca el elegido
  function dibujarCategorias() {
    const fila = document.getElementById("filaCategorias");
    fila.innerHTML = "";
    for (let i = 0; i < CATEGORIAS.length; i++) {
      const categoria = CATEGORIAS[i];
      const boton = document.createElement("button");
      boton.className = "chip-categoria";
      if (categoria.id === categoriaFlash) boton.className += " activa";
      boton.textContent = categoria.emoji + " " + categoria.nombre;
      boton.addEventListener("click", function () {
        categoriaFlash = categoria.id;
        dibujarCategorias();
      });
      fila.appendChild(boton);
    }
  }

  // Al tocar un nivel empieza el juego
  document.querySelectorAll(".boton-nivel").forEach(function (boton) {
    boton.addEventListener("click", function () {
      nivelFlash = boton.dataset.nivel;
      const modo = modoPendiente;
      if (modo === "hablar" || modo === "completo") {
        pedirMicrofono(function () { iniciarModo(modo); });
      } else {
        iniciarModo(modo);
      }
    });
  });

  document.getElementById("btnVolverNivel").addEventListener("click", mostrarMenuVerbos);

  /* ============================================================
     FLASH CARDS: cómo cambia cada opción según el nivel
     ============================================================ */

  // Muestra un texto de ayuda sobre la imagen (si el texto está vacío, lo esconde)
  function ponerPista(texto) {
    const consigna = document.getElementById("consigna");
    consigna.textContent = texto;
    consigna.classList.toggle("oculto", texto === "");
  }

  // Pista de letras: Easy = primera letra + rayitas ("C _ _"), Medium = solo rayitas, Hard = nada
  function pistaDeLetras(palabra) {
    if (nivelFlash === "dificil") return "";
    let pista = "";
    for (let i = 0; i < palabra.length; i++) {
      if (i === 0 && nivelFlash === "facil") pista += palabra.charAt(0).toUpperCase() + " ";
      else pista += "_ ";
    }
    return pista.trim();
  }

  // Velocidad de la voz al escuchar: Easy lenta, Medium normal, Hard rápida
  function velocidadDeNivel() {
    if (nivelFlash === "facil") return 0.7;
    if (nivelFlash === "dificil") return 1.0;
    return 0.9;
  }

  // Texto de ayuda del campo para escribir ("verb" si son los dibujos, "word" en las demás categorías)
  function textoPlaceholder() {
    if (categoriaFlash === "verbos") return "Write the verb in English...";
    return "Write the word in English...";
  }

  function nombreNivelFlash() {
    return NIVELES[nivelFlash].emoji + " " + NIVELES[nivelFlash].nombre;
  }

  function nombreCategoriaFlash() {
    for (let i = 0; i < CATEGORIAS.length; i++) {
      if (CATEGORIAS[i].id === categoriaFlash) return CATEGORIAS[i].emoji + " " + CATEGORIAS[i].nombre;
    }
    return "";
  }

