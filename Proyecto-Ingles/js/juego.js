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
  let dificultadActual = "facil";

  // Flash Cards: lo que se eligió en la pantalla de nivel
  let categoriaFlash = "verbos";   // verbos, animales, comida, cosas o mix
  let nivelFlash = "facil";        // facil, medio o dificil

    // Conjugaciones en presente (3ra persona) para los 16 verbos en español
  const conjugacionPresenteEs = {
    Play: "juega",
    Eat: "come",
    Read: "lee",
    Sing: "canta",
    Write: "escribe",
    Sleep: "duerme",
    Run: "corre",
    Talk: "habla",
    Dance: "baila",
    Listen: "escucha",
    Speak: "habla",
    Ask: "pregunta",
    Answer: "responde",
    Learn: "aprende",
    Teach: "enseña",
    Practice: "practica"
  };

    // Convierte un verbo a su forma gerundio (-ing) correctamente
  function aGerundio(verbo) {
    const v = verbo.toLowerCase();
    // Casos especiales de verbos que terminan en 'e' muda
    if (v.endsWith('e') && !v.endsWith('ee')) {
      return v.slice(0, -1) + 'ing';  // dance→dancing, write→writing
    }
    // Verbos CVC (consonante-vocal-consonante) que duplican: run→running
    if (v.length === 3 && /[bcdfgklmnpt]/.test(v[0]) && /[aeiou]/.test(v[1]) && /[bcdfgklmnpt]/.test(v[2])) {
      return v + v[2] + 'ing';
    }
    // Caso normal
    return v + 'ing';
  }
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
     PASO 4: arrancar un modo de juego
     ============================================================ */
  function generarPreguntasDePreguntas() {
    const lista = [];
    const verbosMezclados = mezclar(verbos);
    const totalPreguntas = 16;

    // Banco de preguntas Tipo A (sistema pregunta, usuario responde)
    const bancoTipoA = [
      (p, v) => `What is ${p.toLowerCase()} doing?`,
      (p, v) => `Look at the picture. What is ${p.toLowerCase()} doing?`,
      (p, v) => `Choose the correct verb for this image:`,
      (p, v) => `What is happening in this scene?`,
      (p, v) => `What does ${p.toLowerCase()} do in the picture?`,
      (p, v) => `Identify the verb in this image:`,
      (p, v) => `What action is shown here?`,
      (p, v) => `Select the correct verb:`
    ];

    // Banco de preguntas Tipo B (sistema da respuesta, usuario elige pregunta)
    const bancoTipoB = [
      (p, v) => ({
        consigna: `"${p} is ${aGerundio(v.nombre)}." What is the correct question?`,
        respuesta: `What is ${p.toLowerCase()} doing?`,
        distractores: [`Where is ${p.toLowerCase()} going?`, `Who is ${p.toLowerCase()}?`, `When does ${p.toLowerCase()} eat?`]
      }),
      (p, v) => ({
        consigna: `Answer: "${p} ${v.nombre.toLowerCase()}s." What do you ask?`,
        respuesta: `What does ${p.toLowerCase()} do?`,
        distractores: [`Where does ${p.toLowerCase()} go?`, `Who does ${p.toLowerCase()} know?`, `When does ${p.toLowerCase()} play?`]
      }),
      (p, v) => ({
        consigna: `"${p} likes to ${v.nombre.toLowerCase()}." What is the verb?`,
        respuesta: v.nombre,
        distractores: [verboAleatorioDiferente(v), verboAleatorioDiferente(v), verboAleatorioDiferente(v)]
      }),
      (p, v) => ({
        consigna: `If the answer is "${p} is ${aGerundio(v.nombre)}", what is the question?`,
        respuesta: `What is ${p.toLowerCase()} doing?`,
        distractores: [`Why is ${p.toLowerCase()} here?`, `How does ${p.toLowerCase()} feel?`, `Where is ${p.toLowerCase()}?`]
      }),
      (p, v) => ({
        consigna: `"${p} is having fun." What is ${p.toLowerCase()} doing?`,
        respuesta: v.nombre,
        distractores: [verboAleatorioDiferente(v), verboAleatorioDiferente(v), verboAleatorioDiferente(v)]
      }),
      (p, v) => ({
        consigna: `Look at ${p.toLowerCase()}. What action is ${p.toLowerCase()} doing?`,
        respuesta: v.nombre,
        distractores: [verboAleatorioDiferente(v), verboAleatorioDiferente(v), verboAleatorioDiferente(v)]
      }),
      (p, v) => ({
        consigna: `"${p} enjoys this activity." What is it?`,
        respuesta: v.nombre,
        distractores: [verboAleatorioDiferente(v), verboAleatorioDiferente(v), verboAleatorioDiferente(v)]
      }),
      (p, v) => ({
        consigna: `What question matches: "${p} is ${aGerundio(v.nombre)}"?`,
        respuesta: `What is ${p.toLowerCase()} doing?`,
        distractores: [`Why is ${p.toLowerCase()} smiling?`, `How is ${p.toLowerCase()} feeling?`, `Where is ${p.toLowerCase()} going?`]
      })
    ];

    // Banco de preguntas Tipo A en español (nivel difícil)
    const bancoTipoAEs = [
      (p, v) => `¿Cómo se dice "<b>${v.es}</b>" en inglés?`,
      (p, v) => `Traduce al inglés: "<b>${v.es}</b>"`,
      (p, v) => `¿Cuál es el verbo en inglés para: "<b>${v.es}</b>"?`,
      (p, v) => `Escribe en inglés: "<b>${v.es}</b>"`,
      (p, v) => `¿Cómo se expresa "<b>${v.es}</b>" en inglés?`,
      (p, v) => `Traduce esta acción: "<b>${v.es}</b>"`,
      (p, v) => `¿Cuál es la palabra en inglés para: "<b>${v.es}</b>"?`,
      (p, v) => `Convierte al inglés: "<b>${v.es}</b>"`
    ];

        // Banco de preguntas Tipo B en español (nivel difícil) - 100% español y DIFERENTES
        // Banco de preguntas Tipo B en español (nivel difícil) - 100% español y correctas
        // Banco de preguntas Tipo B en español (nivel difícil) - gramaticalmente correctas
    const bancoTipoBEs = [
      // 1. Presente continuo: qué está haciendo ahora
      (p, v) => ({
        consigna: `Traduce al inglés: "<b>¿Qué está haciendo ella ahora mismo?</b>"`,
        respuesta: `What is she doing right now?`
      }),
      // 2. Presente simple: qué hace habitualmente
      (p, v) => ({
        consigna: `¿Cómo se pregunta en inglés: "<b>¿Qué hace ella todos los días?</b>"?`,
        respuesta: `What does she do every day?`
      }),
      // 3. Pasado: qué hizo ayer
      (p, v) => ({
        consigna: `Escribe en inglés: "<b>¿Qué hizo ella ayer?</b>"`,
        respuesta: `What did she do yesterday?`
      }),
      // 4. Futuro: qué hará mañana
      (p, v) => ({
        consigna: `Convierte al inglés: "<b>¿Qué hará ella mañana?</b>"`,
        respuesta: `What will she do tomorrow?`
      }),
      // 5. Razón: por qué hace algo (verbo conjugado)
      (p, v) => ({
        consigna: `Traduce esta pregunta: "<b>¿Por qué ${conjugacionPresenteEs[v.nombre]} ella?</b>"`,
        respuesta: `Why does she ${v.nombre.toLowerCase()}?`
      }),
      // 6. Lugar: dónde hace algo (verbo conjugado)
      (p, v) => ({
        consigna: `¿Cómo se dice en inglés: "<b>¿Dónde ${conjugacionPresenteEs[v.nombre]} ella?</b>"?`,
        respuesta: `Where does she ${v.nombre.toLowerCase()}?`
      }),
      // 7. Tiempo: cuándo hace algo (verbo conjugado)
      (p, v) => ({
        consigna: `Escribe en inglés: "<b>¿Cuándo ${conjugacionPresenteEs[v.nombre]} ella?</b>"`,
        respuesta: `When does she ${v.nombre.toLowerCase()}?`
      }),
      // 8. Compañía: con quién hace algo (verbo conjugado)
      (p, v) => ({
        consigna: `¿Cómo preguntarías en inglés: "<b>¿Con quién ${conjugacionPresenteEs[v.nombre]} ella?</b>"?`,
        respuesta: `Who does she ${v.nombre.toLowerCase()} with?`
      })
    ];
    for (let i = 0; i < totalPreguntas; i++) {
      const verbo = verbosMezclados[i % verbosMezclados.length];
      const pronombre = pronombrePorVerbo[verbo.nombre] || "She";
      const esTipoA = i % 2 === 0;
      
      // Índice para el banco (0-7) basado en la mitad del índice
      const indiceBanco = Math.floor(i / 2) % 8;

      let pregunta = {
        verboIdx: i,
        img: verbo.img,
        tipo: esTipoA ? "A" : "B",
        verboData: verbo,
        pronombre: pronombre
      };

      // ============ NIVEL FÁCIL: Opción múltiple ============
      if (dificultadActual === "facil") {
        if (esTipoA) {
          const consignaFn = bancoTipoA[indiceBanco];
          pregunta.consigna = consignaFn(pronombre, verbo);
          pregunta.respuestaCorrecta = verbo.nombre;
          pregunta.opciones = armarOpcionesQA(verbo.nombre, verbos.map(v => v.nombre));
        } else {
          const datosB = bancoTipoB[indiceBanco](pronombre, verbo);
          pregunta.consigna = datosB.consigna;
          pregunta.respuestaCorrecta = datosB.respuesta;
          pregunta.opciones = armarOpcionesQA(datosB.respuesta, [datosB.respuesta, ...datosB.distractores]);
        }
      }
      // ============ NIVEL MEDIO: Escribir en inglés ============
      else if (dificultadActual === "medio") {
        pregunta.tipoRespuesta = "escribir";
        pregunta.imgSutil = false;
        if (esTipoA) {
          const consignaFn = bancoTipoA[indiceBanco];
          pregunta.consigna = consignaFn(pronombre, verbo) + " (write the verb)";
          pregunta.respuestaCorrecta = verbo.nombre;
        } else {
          const datosB = bancoTipoB[indiceBanco](pronombre, verbo);
          pregunta.consigna = datosB.consigna + " (write the answer)";
          pregunta.respuestaCorrecta = datosB.respuesta;
        }
      }
      // ============ NIVEL DIFÍCIL: Traducción español→inglés ============
      else if (dificultadActual === "dificil") {
        pregunta.tipoRespuesta = "escribir";
        pregunta.imgSutil = true;
        if (esTipoA) {
          const consignaFn = bancoTipoAEs[indiceBanco];
          pregunta.consigna = consignaFn(pronombre, verbo);
          pregunta.respuestaCorrecta = verbo.nombre;
        } else {
          const datosB = bancoTipoBEs[indiceBanco](pronombre, verbo);
          pregunta.consigna = datosB.consigna;
          pregunta.respuestaCorrecta = datosB.respuesta;
        }
      }
      lista.push(pregunta);
    }
    return mezclar(lista);
  }

  // Función auxiliar para obtener un verbo aleatorio diferente al actual
  function verboAleatorioDiferente(verboActual) {
    const otros = verbos.filter(v => v.nombre !== verboActual.nombre);
    return otros[Math.floor(Math.random() * otros.length)].nombre;
  }
  // Genera 4 opciones de VERBOS (sin duplicados garantizado)
  function armarOpcionesDeVerbos(correcta) {
    const opciones = [correcta];
    const otrosVerbos = verbos.filter(v => v.nombre !== correcta);
    const mezclados = mezclar(otrosVerbos);
    
    for (let i = 0; i < 3 && i < mezclados.length; i++) {
      opciones.push(mezclados[i].nombre);
    }
    return mezclar(opciones);
  }
    // Genera 4 opciones de PREGUNTAS (sin duplicados garantizado)
  function armarOpcionesDePreguntas(pronombre) {
    const correcta = `What is ${pronombre.toLowerCase()} doing?`;
    const opciones = [correcta];
    const otrasPreguntas = [
      `Where is ${pronombre.toLowerCase()} going?`,
      `Who is ${pronombre.toLowerCase()}?`,
      `When does ${pronombre.toLowerCase()} eat?`,
      `What does ${pronombre.toLowerCase()} do?`,
      `Why is ${pronombre.toLowerCase()} happy?`,
      `How is ${pronombre.toLowerCase()} feeling?`
    ];
    const mezcladas = mezclar(otrasPreguntas);
    
    for (let i = 0; i < 3 && i < mezcladas.length; i++) {
      opciones.push(mezcladas[i]);
    }
    return mezclar(opciones);
  }
  function armarOpcionesQA(correcta, todas) {
    // Garantizar 4 opciones ÚNICAS sin fallar
    const opciones = [correcta];
    
    // Crear pool de opciones válidas (sin la correcta y sin duplicados)
    const pool = [];
    const vistas = new Set([correcta]);
    
    for (const item of todas) {
      if (!vistas.has(item)) {
        vistas.add(item);
        pool.push(item);
      }
    }
    
    // Mezclar el pool
    const poolMezclado = mezclar(pool);
    
    // Tomar hasta 3 opciones del pool
    for (let i = 0; i < poolMezclado.length && opciones.length < 4; i++) {
      opciones.push(poolMezclado[i]);
    }
    
    // Si aún no hay 4, agregar opciones genéricas de respaldo
    const respaldo = ["Run", "Sleep", "Eat", "Play", "Talk", "Write", "Read", "Sing"];
    for (const r of respaldo) {
      if (opciones.length < 4 && !opciones.includes(r)) {
        opciones.push(r);
      }
    }
    
    // Mezclar el resultado final
    return mezclar(opciones);
  }
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

    // Cartelito con el nivel y la categoría (solo en Flash Cards)
    document.getElementById("chipNivel").textContent = nombreNivelFlash() + " · " + nombreCategoriaFlash();

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
      
      // 2. FORZAR VISIBILIDAD (Esto mata cualquier regla del CSS)
      if (dificultadActual === "facil") {
        // FÁCIL: Ocultar texto, mostrar opciones en 2x2
        document.getElementById("zonaTexto").style.setProperty('display', 'none', 'important');
        document.getElementById("zonaOpciones").style.setProperty('display', 'grid', 'important');
        document.getElementById("zonaOpciones").style.gridTemplateColumns = '1fr 1fr';
        document.getElementById("zonaOpciones").style.gap = '15px';
        document.getElementById("zonaOpciones").style.maxWidth = '600px';
        document.getElementById("zonaOpciones").style.margin = '20px auto';
        prepararZonaOpciones(q);
      } else {
        // MEDIO Y DIFÍCIL: Ocultar opciones, FORZAR mostrar texto y check
        document.getElementById("zonaOpciones").style.setProperty('display', 'none', 'important');
        document.getElementById("zonaTexto").style.setProperty('display', 'flex', 'important');
        document.getElementById("zonaTexto").style.justifyContent = 'center';
        document.getElementById("zonaTexto").style.alignItems = 'center';
        document.getElementById("zonaTexto").style.gap = '15px';
        document.getElementById("zonaTexto").style.maxWidth = '600px';
        document.getElementById("zonaTexto").style.margin = '30px auto';
        
        inputRespuesta.placeholder = "Type your answer here...";
        inputRespuesta.value = "";
        inputRespuesta.disabled = false;
        inputRespuesta.focus();
        prepararZonaTexto();
      }

      // 3. Imagen
      const imgActual = document.getElementById("imagenActual");
      if (dificultadActual === "dificil") {
        imgActual.style.opacity = "0.15";
        imgActual.style.transform = "scale(0.4)";
        imgActual.style.filter = "grayscale(100%) blur(2px)";
      } else {
        imgActual.style.opacity = "1";
        imgActual.style.transform = "scale(1)";
        imgActual.style.filter = "none";
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
    let opciones = q.opciones && q.opciones.length > 0 ? q.opciones : [q.respuestaCorrecta];
    const contenedor = document.getElementById("zonaOpciones");
    contenedor.innerHTML = "";

    opciones.forEach(nombreOpcion => {
      const btn = document.createElement("button");
      btn.className = "opcion";
      btn.textContent = nombreOpcion;
      btn.style.padding = '15px';
      btn.style.fontSize = '16px';
      btn.style.borderRadius = '12px';
      btn.style.cursor = 'pointer';
      btn.style.width = '100%';
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
      // La tarjeta "Write, Listen and Speak" del menú principal solo abre el submenú
      if (modo === "submenu-verbos") { mostrarMenuVerbos(); return; }
      // Los modos de Flash Cards pasan primero por la pantalla de nivel
      if (MODOS_VERBOS.includes(modo)) { abrirPantallaNivel(modo); return; }
      // Build sentences: primero se elige la categoría y la dificultad
      if (modo === "oraciones") { abrirPantallaNivelOraciones(); return; }
      // Frases: primero se elige la categoría y el nivel
      if (modo === "submenu-frases") { abrirPantallaFrases(); return; }
      // "Escucha, canta y habla" tiene su propio módulo (musica.js)
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
