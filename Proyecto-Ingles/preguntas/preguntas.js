/* ============================================================
   preguntas.js
   Questions & Answers: arma las preguntas y sus opciones (la pantalla de juego es la compartida).
   ============================================================ */

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
