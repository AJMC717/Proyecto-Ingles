/* ============================================================
   musica.js
   Módulo "Escucha, canta y habla":
   - Muestra un catálogo de canciones filtrado por dificultad.
   - Reproduce una pista de audio por línea (con respaldo de voz).
   - Escucha al usuario con SpeechRecognition.
   - Compara la transcripción con la frase objetivo.
   - Suma puntos, guarda el puntaje y muestra las estrellas finales.
   ============================================================ */

const CANCION_FACIL = [
  { id: 1, text: "If you're happy and you know it, clap your hands. (Clap-clap)", audio: "audio/if-youre-happy/linea1.mp3" },
  { id: 2, text: "If you're happy and you know it, clap your hands. (Clap-clap)", audio: "audio/if-youre-happy/linea2.mp3" },
  { id: 3, text: "If you're happy and you know it, then your face will surely show it.", audio: "audio/if-youre-happy/linea3.mp3" },
  { id: 4, text: "If you're happy and you know it, clap your hands. (Clap-clap)", audio: "audio/if-youre-happy/linea4.mp3" }
];

const CANCION_MEDIA = [
  { id: 1, text: "I used to rule the world\nSeas would rise when I gave the Word", audio: "audio/viva-la-vida/linea1.mp3" },
  { id: 2, text: "Now in the morning, I sleep alone\nSweep the streets I used to own", audio: "audio/viva-la-vida/linea2.mp3" },
  { id: 3, text: "I used to roll the dice\nFeel the fear in my enemies' eyes", audio: "audio/viva-la-vida/linea3.mp3" },
  { id: 4, text: 'Listen as the crowd would sing\n"Now the old king is dead, long live the king"', audio: "audio/viva-la-vida/linea4.mp3" },
  { id: 5, text: "One minute, I held the key\nNext, the walls were closed on me", audio: "audio/viva-la-vida/linea5.mp3" },
  { id: 6, text: "And I discovered that my castles stand\nUpon pillars of salt and pillars of sand", audio: "audio/viva-la-vida/linea6.mp3" },
  { id: 7, text: "I hear Jerusalem bells a-ringin'\nRoman cavalry choirs are singin'", audio: "audio/viva-la-vida/linea7.mp3" },
  { id: 8, text: "Be my mirror, my sword and shield\nMy missionaries in a foreign field", audio: "audio/viva-la-vida/linea8.mp3" },
  { id: 9, text: "For some reason I can't explain\nOnce you'd gone, there was never", audio: "audio/viva-la-vida/linea9.mp3" },
  { id: 10, text: "Never an honest word\nAnd that was when I ruled the world", audio: "audio/viva-la-vida/linea10.mp3" }
];

const CATALOGO_CANCIONES = [
  // Easy: 3 canciones (la primera está disponible; las otras se irán agregando).
  {
    id: 1,
    numero: 1,
    titulo: "If You're Happy and You Know It",
    dificultad: "facil",
    frases: CANCION_FACIL.length,
    disponible: true,
    datos: CANCION_FACIL
  },
  {
    id: 3,
    numero: 2,
    titulo: "",
    dificultad: "facil",
    frases: 0,
    disponible: false,
    datos: null
  },
  {
    id: 4,
    numero: 3,
    titulo: "",
    dificultad: "facil",
    frases: 0,
    disponible: false,
    datos: null
  },

  // Medium: 3 canciones (Viva la Vida es la primera).
  {
    id: 2,
    numero: 1,
    titulo: "Coldplay - Viva la Vida",
    dificultad: "medio",
    frases: CANCION_MEDIA.length,
    disponible: true,
    datos: CANCION_MEDIA
  },
  {
    id: 5,
    numero: 2,
    titulo: "",
    dificultad: "medio",
    frases: 0,
    disponible: false,
    datos: null
  },
  {
    id: 6,
    numero: 3,
    titulo: "",
    dificultad: "medio",
    frases: 0,
    disponible: false,
    datos: null
  },

  // Hard: 3 canciones (todavía no hay audios ni letras).
  {
    id: 7,
    numero: 1,
    titulo: "",
    dificultad: "dificil",
    frases: 0,
    disponible: false,
    datos: null
  },
  {
    id: 8,
    numero: 2,
    titulo: "",
    dificultad: "dificil",
    frases: 0,
    disponible: false,
    datos: null
  },
  {
    id: 9,
    numero: 3,
    titulo: "",
    dificultad: "dificil",
    frases: 0,
    disponible: false,
    datos: null
  }
];

const MUSICA_TOTAL_RONDAS = 2;
const MUSICA_PUNTOS_POR_LINEA = 50;

let cancionActualMusica = CATALOGO_CANCIONES[0];
let CANCION_DATOS = cancionActualMusica.datos;
let lineaActualIndex = 0;
let rondaActual = 1;
let puntajeTotal = 0;
let reproductorAudio = null;
let reconocimientoMusica = null;
let musicaEscuchando = false;
let musicaLineaCompletada = false;
let musicaErroresLinea = 0;
let musicaErroresTotales = 0;
let musicaTimeoutAvance = null;
let musicaSesionGuardada = false;
let musicaTokenReconocimiento = 0;
let musicaTokenGuia = 0;
let musicaAudioContext = null;
let dificultadMusicaSeleccionada = "facil";

/* ============================================================
   UTILIDADES DE TEXTO
   ============================================================ */
function normalizarTextoMusica(texto) {
  return String(texto || "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/[’‘]/g, "'")
    .replace(/\bcan't\b/g, "cannot")
    .replace(/\bwon't\b/g, "will not")
    .replace(/\bshan't\b/g, "shall not")
    .replace(/n't\b/g, " not")
    .replace(/'re\b/g, " are")
    .replace(/'ve\b/g, " have")
    .replace(/'ll\b/g, " will")
    .replace(/'d\b/g, " would")
    .replace(/'m\b/g, " am")
    .replace(/'s\b/g, " is")
    .replace(/([a-z])in'(?=\s|$)/g, "$1ing")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function lcsMusica(a, b) {
  const filas = a.length + 1;
  const columnas = b.length + 1;
  const tabla = Array.from({ length: filas }, () => new Array(columnas).fill(0));

  for (let i = 1; i < filas; i++) {
    for (let j = 1; j < columnas; j++) {
      tabla[i][j] = a[i - 1] === b[j - 1]
        ? tabla[i - 1][j - 1] + 1
        : Math.max(tabla[i - 1][j], tabla[i][j - 1]);
    }
  }
  return tabla[a.length][b.length];
}

function coincideLineaMusica(oido, objetivo) {
  if (!oido || !objetivo) return false;
  if (oido === objetivo) return true;

  // La frase completa aparece dentro de lo que se escuchó.
  if ((" " + oido + " ").includes(" " + objetivo + " ")) return true;

  const palabrasOidas = oido.split(" ").filter(Boolean);
  const palabrasObjetivo = objetivo.split(" ").filter(Boolean);
  if (palabrasObjetivo.length === 0) return false;

  // Coincidencia por palabras clave: al menos el 75 % de la frase.
  const setOidas = new Set(palabrasOidas);
  const coincidencias = palabrasObjetivo.filter(p => setOidas.has(p)).length;
  const requeridas = Math.max(1, Math.ceil(palabrasObjetivo.length * 0.75));
  if (coincidencias >= requeridas && palabrasOidas.length <= palabrasObjetivo.length + 3) {
    return true;
  }

  // Tolerancia para frases largas: se permite omitir una o dos palabras.
  const permitidas = palabrasObjetivo.length >= 8 ? 2 : palabrasObjetivo.length >= 5 ? 1 : 0;
  return lcsMusica(palabrasOidas, palabrasObjetivo) >= palabrasObjetivo.length - permitidas
    && palabrasOidas.length <= palabrasObjetivo.length + permitidas + 2;
}

/* ============================================================
   AUDIO DE LA GUÍA
   ============================================================ */
function detenerAudios() {
  musicaTokenGuia++;
  if (reproductorAudio) {
    try {
      reproductorAudio.pause();
      reproductorAudio.currentTime = 0;
    } catch (e) {
      // Algunos navegadores no permiten modificar el audio antes de cargarlo.
    }
  }
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function hablarGuiaMusica(texto, tokenGuia) {
  if (!("speechSynthesis" in window)) {
    mostrarFeedbackMusica("Could not play the audio. Check the MP3 files or use Chrome/Edge.", "reintento");
    return;
  }

  const token = (tokenGuia == null) ? musicaTokenGuia : tokenGuia;

  window.speechSynthesis.cancel();
  const voz = new SpeechSynthesisUtterance(texto);
  voz.lang = "en-US";
  voz.rate = 0.85;
  voz.pitch = 1.05;
  voz.onend = function () {
    if (token === musicaTokenGuia && !musicaLineaCompletada && !musicaEscuchando) {
      mostrarFeedbackMusica("Now press “Speak” 🎤", "");
    }
  };
  window.speechSynthesis.speak(voz);
}

function reproducirAudioGuia() {
  if (musicaLineaCompletada) return;

  desbloquearAudioMusica();

  // El micrófono y el audio no deben escucharse al mismo tiempo.
  detenerReconocimientoMusica();
  detenerAudios();

  const tokenGuia = ++musicaTokenGuia;
  const linea = CANCION_DATOS[lineaActualIndex];
  mostrarFeedbackMusica("🔊 Playing the guide...", "escuchando");
  mostrarTranscripcionMusica("");

  let respaldoUsado = false;
  const usarVozDelNavegador = function () {
    if (respaldoUsado || tokenGuia !== musicaTokenGuia || musicaEscuchando) return;
    respaldoUsado = true;
    hablarGuiaMusica(linea.text, tokenGuia);
  };

  try {
    const audio = new Audio(linea.audio);
    reproductorAudio = audio;
    audio.preload = "auto";
    audio.volume = 0.95;

    audio.onerror = usarVozDelNavegador;
    audio.onended = function () {
      if (tokenGuia === musicaTokenGuia && !musicaLineaCompletada && !musicaEscuchando) {
        mostrarFeedbackMusica("Now press “Speak” 🎤", "");
      }
    };

    const reproduccion = audio.play();
    if (reproduccion && typeof reproduccion.catch === "function") {
      reproduccion.catch(usarVozDelNavegador);
    }
  } catch (e) {
    usarVozDelNavegador();
  }
}

/* ============================================================
   SONIDO BREVE DE ÉXITO (sin archivos externos)
   ============================================================ */
function desbloquearAudioMusica() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;

  try {
    if (!musicaAudioContext) musicaAudioContext = new Ctx();
    if (musicaAudioContext.state === "suspended") musicaAudioContext.resume();
  } catch (e) {
    // Si no se puede crear, el sonido de éxito simplemente no suena.
  }
}

function reproducirSonidoExito() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;

  try {
    if (!musicaAudioContext) musicaAudioContext = new Ctx();
    if (musicaAudioContext.state === "suspended") musicaAudioContext.resume();

    const ctx = musicaAudioContext;
    const ahora = ctx.currentTime;
    const notas = [523.25, 659.25, 783.99]; // Do, Mi, Sol

    notas.forEach(function (frecuencia, indice) {
      const inicio = ahora + indice * 0.08;
      const oscilador = ctx.createOscillator();
      const ganancia = ctx.createGain();

      oscilador.type = "sine";
      oscilador.frequency.setValueAtTime(frecuencia, inicio);
      ganancia.gain.setValueAtTime(0.0001, inicio);
      ganancia.gain.exponentialRampToValueAtTime(0.18, inicio + 0.02);
      ganancia.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.2);

      oscilador.connect(ganancia);
      ganancia.connect(ctx.destination);
      oscilador.start(inicio);
      oscilador.stop(inicio + 0.22);
    });
  } catch (e) {
    // Si el navegador bloquea el audio, el módulo sigue funcionando.
  }
}

/* ============================================================
   RECONOCIMIENTO DE VOZ
   ============================================================ */
function detenerReconocimientoMusica() {
  musicaTokenReconocimiento++;

  if (reconocimientoMusica) {
    try {
      reconocimientoMusica.abort();
    } catch (e) {
      // El reconocimiento pudo haber terminado solo.
    }
    reconocimientoMusica = null;
  }

  musicaEscuchando = false;
  const boton = document.getElementById("btnMusicaMic");
  if (boton) {
    boton.classList.remove("escuchando");
    if (!musicaLineaCompletada) {
      boton.disabled = false;
      boton.textContent = "🎤 Speak";
    }
  }
}

function pronunciarLinea() {
  if (musicaLineaCompletada || musicaEscuchando) return;

  const Reconocimiento = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Reconocimiento) {
    mostrarFeedbackMusica("Your browser cannot recognize speech. Use Chrome or Edge.", "reintento");
    return;
  }

  desbloquearAudioMusica();

  // Regla clave: cortar cualquier audio antes de abrir el micrófono.
  detenerAudios();
  detenerReconocimientoMusica();

  const indice = lineaActualIndex;
  const linea = CANCION_DATOS[indice];
  const token = ++musicaTokenReconocimiento;
  const reconocimiento = new Reconocimiento();

  reconocimiento.lang = "en-US";
  reconocimiento.continuous = false;
  reconocimiento.interimResults = false;
  reconocimiento.maxAlternatives = 5;

  reconocimientoMusica = reconocimiento;
  musicaEscuchando = true;

  const boton = document.getElementById("btnMusicaMic");
  boton.classList.add("escuchando");
  boton.disabled = true;
  boton.textContent = "🎙️ Listening...";

  mostrarFeedbackMusica("🎙️ Listening...", "escuchando");
  mostrarTranscripcionMusica("");

  reconocimiento.onresult = function (evento) {
    if (token !== musicaTokenReconocimiento || indice !== lineaActualIndex) return;
    const alternativas = Array.from(evento.results[0]).map(a => a.transcript);
    evaluarPronunciacionMusica(alternativas, linea);
  };

  reconocimiento.onerror = function (evento) {
    if (token !== musicaTokenReconocimiento || indice !== lineaActualIndex || musicaLineaCompletada) return;

    if (evento.error === "not-allowed" || evento.error === "service-not-allowed") {
      mostrarFeedbackMusica("I need permission to use the microphone.", "reintento");
    } else if (evento.error === "network") {
      mostrarFeedbackMusica("There is no internet or the voice service is blocked. Try Chrome.", "reintento");
    } else if (evento.error === "no-speech") {
      mostrarFeedbackMusica("I didn't hear you. Press “Speak” and try again.", "reintento");
    } else if (evento.error !== "aborted") {
      mostrarFeedbackMusica("I couldn't hear you (" + evento.error + "). Try again.", "reintento");
    }
  };

  reconocimiento.onend = function () {
    if (token !== musicaTokenReconocimiento || indice !== lineaActualIndex) return;

    musicaEscuchando = false;
    reconocimientoMusica = null;
    boton.classList.remove("escuchando");

    if (!musicaLineaCompletada) {
      boton.disabled = false;
      boton.textContent = "🎤 Speak";
      // Si no hubo resultado, onerror ya dejó el mensaje correspondiente.
    }
  };

  try {
    reconocimiento.start();
  } catch (e) {
    musicaEscuchando = false;
    reconocimientoMusica = null;
    boton.classList.remove("escuchando");
    boton.disabled = false;
    boton.textContent = "🎤 Speak";
    mostrarFeedbackMusica("Could not start the microphone. Try again.", "reintento");
  }
}

function evaluarPronunciacionMusica(alternativas, linea) {
  if (musicaLineaCompletada) return;

  const objetivo = normalizarTextoMusica(linea.text);
  const escuchadas = alternativas.map(normalizarTextoMusica).filter(Boolean);
  const transcripcion = alternativas[0] || "";

  mostrarTranscripcionMusica(transcripcion);

  const acierto = escuchadas.some(function (texto) {
    return coincideLineaMusica(texto, objetivo);
  });

  if (acierto) {
    musicaLineaCompletada = true;
    puntajeTotal += MUSICA_PUNTOS_POR_LINEA;

    const botonGuia = document.getElementById("btnMusicaGuia");
    const botonMic = document.getElementById("btnMusicaMic");
    botonGuia.disabled = true;
    botonMic.disabled = true;
    botonMic.classList.remove("escuchando");
    botonMic.textContent = "✅ Good!";

    mostrarFeedbackMusica("Excellent pronunciation! ✨ +" + MUSICA_PUNTOS_POR_LINEA + " pts", "exito");
    actualizarPantallaMusica();
    reproducirSonidoExito();

    musicaTimeoutAvance = setTimeout(avanzarLineaMusica, 1500);
  } else {
    musicaErroresLinea++;
    musicaErroresTotales++;
    mostrarFeedbackMusica("Almost, try again 🔄 (attempt " + musicaErroresLinea + ")", "reintento");
  }
}

/* ============================================================
   FLUJO DE RONDAS
   ============================================================ */
function avanzarLineaMusica() {
  musicaTimeoutAvance = null;
  detenerReconocimientoMusica();
  detenerAudios();

  lineaActualIndex++;

  if (lineaActualIndex >= CANCION_DATOS.length) {
    lineaActualIndex = 0;
    rondaActual++;

    if (rondaActual > MUSICA_TOTAL_RONDAS) {
      mostrarResultadosMusica();
      return;
    }

    mostrarFeedbackMusica("🎉 Round 1 complete! Round 2 starts now.", "exito");
  } else {
    mostrarFeedbackMusica("Listen to the guide and repeat the phrase with the microphone.", "");
  }

  musicaLineaCompletada = false;
  musicaErroresLinea = 0;
  document.getElementById("musicaTranscripcion").textContent = "";
  actualizarPantallaMusica();
}

function calcularEstrellasMusica() {
  if (musicaErroresTotales === 0) return 3;
  if (musicaErroresTotales <= 2) return 2;
  return 1;
}

function mostrarResultadosMusica() {
  cancelarTemporizadoresMusica();
  musicaLineaCompletada = true;
  detenerAudios();
  detenerReconocimientoMusica();

  let totalAcumulado = leerPuntajeMusica();

  if (!musicaSesionGuardada) {
    borrarEstadoMusica(cancionActualMusica);
    marcarCancionCompletadaMusica(cancionActualMusica);
    totalAcumulado = guardarPuntajeMusica();
    guardarHistorialMusica();
    musicaSesionGuardada = true;
  }

  const estrellas = calcularEstrellasMusica();

  document.getElementById("musicaResultadoPuntaje").textContent =
    "Session score: " + puntajeTotal + " pts";
  document.getElementById("musicaResultadoAcumulado").textContent =
    "Total accumulated score: " + totalAcumulado + " pts";
  document.getElementById("musicaResultadoDetalle").textContent =
    "You completed " + MUSICA_TOTAL_RONDAS + " rounds · " +
    (CANCION_DATOS.length * MUSICA_TOTAL_RONDAS) + " phrases · " +
    musicaErroresTotales + (musicaErroresTotales === 1 ? " retry" : " retries");

  const siguiente = siguienteCancionMusica(cancionActualMusica);
  const desbloqueo = document.getElementById("musicaResultadoDesbloqueo");
  if (desbloqueo) {
    if (!siguiente) {
      desbloqueo.textContent = "🏆 You completed all songs in this difficulty!";
    } else if (siguiente.disponible) {
      desbloqueo.textContent = "🔓 Song " + siguiente.numero + " unlocked!";
    } else {
      desbloqueo.textContent = "🔓 Song " + siguiente.numero + " unlocked! It's coming soon.";
    }
  }

  const contenedorEstrellas = document.getElementById("musicaEstrellas");
  contenedorEstrellas.innerHTML = "";
  for (let i = 1; i <= 3; i++) {
    const estrella = document.createElement("span");
    const activa = i <= estrellas;
    estrella.textContent = activa ? "⭐" : "☆";
    if (!activa) estrella.className = "apagada";
    contenedorEstrellas.appendChild(estrella);
  }

  document.getElementById("musicaResultados").classList.remove("oculto");
}

function cancelarTemporizadoresMusica() {
  if (musicaTimeoutAvance) {
    clearTimeout(musicaTimeoutAvance);
    musicaTimeoutAvance = null;
  }
}

/* ============================================================
   PUNTAJE Y HISTORIAL
   ============================================================ */
function clavePuntajeMusica() {
  const usuario = localStorage.getItem("userActual") || "invitado";
  return "musicaPuntaje_" + usuario;
}

function leerPuntajeMusica() {
  try {
    return parseInt(localStorage.getItem(clavePuntajeMusica()) || "0", 10) || 0;
  } catch (e) {
    return 0;
  }
}

function guardarPuntajeMusica() {
  const total = leerPuntajeMusica() + puntajeTotal;
  try {
    localStorage.setItem(clavePuntajeMusica(), String(total));
  } catch (e) {
    // Si localStorage está lleno o bloqueado, el módulo sigue funcionando.
  }
  return total;
}

function guardarHistorialMusica() {
  const usuario = localStorage.getItem("userActual");
  if (!usuario) return;

  try {
    const clave = "hist_" + usuario;
    const historial = JSON.parse(localStorage.getItem(clave) || "[]");
    historial.push({
      fecha: new Date().toLocaleString(),
      modo: "Listen, Sing and Speak",
      puntaje: puntajeTotal,
      rachaMaxima: 0
    });
    localStorage.setItem(clave, JSON.stringify(historial));
  } catch (e) {
    // El historial es opcional; no debe romper el módulo.
  }
}

/* ============================================================
   PROGRESO DE CANCIONES
   ============================================================ */
function claveCompletadasMusica() {
  const usuario = localStorage.getItem("userActual") || "invitado";
  return "musicaCompletadas_" + usuario;
}

function leerCompletadasMusica() {
  try {
    const datos = JSON.parse(localStorage.getItem(claveCompletadasMusica()) || "[]");
    return new Set(Array.isArray(datos) ? datos : []);
  } catch (e) {
    return new Set();
  }
}

function guardarCompletadasMusica(completadas) {
  try {
    localStorage.setItem(claveCompletadasMusica(), JSON.stringify(Array.from(completadas)));
  } catch (e) {
    // El progreso es opcional; no debe romper el módulo.
  }
}

function claveCancionMusica(cancion) {
  return cancion.dificultad + ":" + cancion.numero;
}

function marcarCancionCompletadaMusica(cancion) {
  if (!cancion || !cancion.disponible) return;

  const completadas = leerCompletadasMusica();
  completadas.add(claveCancionMusica(cancion));
  guardarCompletadasMusica(completadas);
}

function cancionDesbloqueadaMusica(cancion, completadas) {
  if (!cancion) return false;
  if (cancion.numero <= 1) return true;

  const anterior = CATALOGO_CANCIONES.find(function (item) {
    return item.dificultad === cancion.dificultad && item.numero === cancion.numero - 1;
  });
  if (!anterior) return false;

  const cancionesCompletadas = completadas || leerCompletadasMusica();
  return cancionesCompletadas.has(claveCancionMusica(anterior));
}

function siguienteCancionMusica(cancion) {
  if (!cancion) return null;
  return CATALOGO_CANCIONES.find(function (item) {
    return item.dificultad === cancion.dificultad && item.numero === cancion.numero + 1;
  }) || null;
}

/* ============================================================
   PARTIDA GUARDADA (PAUSA)
   ============================================================ */
function claveEstadoMusica(cancion) {
  const usuario = localStorage.getItem("userActual") || "invitado";
  return "estado_musica_" + usuario + "|" + cancion.dificultad + "|" + cancion.numero;
}

function leerEstadoMusica(cancion) {
  if (!cancion) return null;

  try {
    const estado = JSON.parse(localStorage.getItem(claveEstadoMusica(cancion)) || "null");
    if (!estado) return null;
    if (estado.cancionId !== cancion.id) return null;
    if (estado.dificultad !== cancion.dificultad) return null;
    if (estado.numero !== cancion.numero) return null;
    return estado;
  } catch (e) {
    return null;
  }
}

function borrarEstadoMusica(cancion) {
  if (!cancion) return;
  try {
    localStorage.removeItem(claveEstadoMusica(cancion));
  } catch (e) {
    // Si localStorage está bloqueado, no hay nada que borrar.
  }
}

function mostrarModalMusica(titulo, mensaje, botones) {
  if (typeof mostrarModal === "function") {
    mostrarModal(titulo, mensaje, botones);
    return;
  }

  // Respaldo para entornos sin el modal genérico (por ejemplo, pruebas).
  if (typeof window !== "undefined" && typeof window.confirm === "function") {
    const aceptar = window.confirm(String(mensaje).replace(/<br\s*\/?>/gi, "\n"));
    const boton = aceptar ? botones[botones.length - 1] : botones[0];
    if (boton && typeof boton.accion === "function") boton.accion();
    return;
  }

  const ultimo = botones[botones.length - 1];
  if (ultimo && typeof ultimo.accion === "function") ultimo.accion();
}

function abrirJuegoMusica(cancion) {
  cancionActualMusica = cancion;
  CANCION_DATOS = cancion.datos;

  document.getElementById("musicaCatalogo").classList.add("oculto");
  document.getElementById("musicaJuego").classList.remove("oculto");
  document.getElementById("btnVolverMusica").textContent = "⬅ Back to catalog";
}

function guardarEstadoMusica() {
  if (!cancionActualMusica || !cancionActualMusica.disponible || musicaSesionGuardada) return;

  cancelarTemporizadoresMusica();
  detenerAudios();
  detenerReconocimientoMusica();

  const estado = {
    cancionId: cancionActualMusica.id,
    dificultad: cancionActualMusica.dificultad,
    numero: cancionActualMusica.numero,
    titulo: cancionActualMusica.titulo,
    rondaActual: rondaActual,
    lineaActualIndex: lineaActualIndex,
    puntajeTotal: puntajeTotal,
    musicaErroresLinea: musicaErroresLinea,
    musicaErroresTotales: musicaErroresTotales,
    musicaLineaCompletada: musicaLineaCompletada,
    fecha: new Date().toLocaleString()
  };

  try {
    localStorage.setItem(claveEstadoMusica(cancionActualMusica), JSON.stringify(estado));
  } catch (e) {
    // Si no se puede guardar, el módulo sigue funcionando.
  }

  mostrarModalMusica(
    "⏸️ Song paused",
    "✅ Your progress was saved.<br><br>You can come back and continue later.",
    [{ texto: "OK", estilo: "background:#58CC02; color:white;" }]
  );

  mostrarCatalogoMusica();
}

function reanudarEstadoMusica(estado) {
  cancelarTemporizadoresMusica();
  detenerAudios();
  detenerReconocimientoMusica();

  const totalLineas = CANCION_DATOS.length;

  rondaActual = Math.max(1, Math.min(MUSICA_TOTAL_RONDAS, parseInt(estado.rondaActual, 10) || 1));
  lineaActualIndex = Math.max(0, Math.min(totalLineas - 1, parseInt(estado.lineaActualIndex, 10) || 0));
  puntajeTotal = Math.max(0, parseInt(estado.puntajeTotal, 10) || 0);
  musicaErroresLinea = Math.max(0, parseInt(estado.musicaErroresLinea, 10) || 0);
  musicaErroresTotales = Math.max(0, parseInt(estado.musicaErroresTotales, 10) || 0);
  musicaLineaCompletada = !!estado.musicaLineaCompletada;
  musicaSesionGuardada = false;

  document.getElementById("musicaResultados").classList.add("oculto");
  document.getElementById("musicaTranscripcion").textContent = "";
  document.getElementById("btnMusicaGuia").disabled = false;
  const desbloqueo = document.getElementById("musicaResultadoDesbloqueo");
  if (desbloqueo) desbloqueo.textContent = "";

  actualizarPantallaMusica();

  if (musicaLineaCompletada) {
    const botonMic = document.getElementById("btnMusicaMic");
    if (botonMic) {
      botonMic.disabled = true;
      botonMic.classList.remove("escuchando");
      botonMic.textContent = "✅ Good!";
    }
    mostrarFeedbackMusica("Resuming... This line is already complete.", "exito");
    musicaTimeoutAvance = setTimeout(avanzarLineaMusica, 900);
  } else {
    mostrarFeedbackMusica("Progress restored. Listen to the guide and repeat the phrase.", "");
  }
}

function preguntarContinuarMusica(cancion, estado) {
  const totalLineas = cancion.datos ? cancion.datos.length : cancion.frases;
  const ronda = Math.max(1, parseInt(estado.rondaActual, 10) || 1);
  const linea = Math.max(1, (parseInt(estado.lineaActualIndex, 10) || 0) + 1);
  const puntos = Math.max(0, parseInt(estado.puntajeTotal, 10) || 0);

  const mensaje =
    "You have saved progress in this song:<br><br>" +
    "🎵 <b>Song " + cancion.numero + ": " + cancion.titulo + "</b><br>" +
    "📍 Round: <b>" + ronda + " of " + MUSICA_TOTAL_RONDAS + "</b><br>" +
    "🎼 Line: <b>" + linea + " of " + totalLineas + "</b><br>" +
    "⭐ Score: <b>" + puntos + " pts</b><br><br>" +
    "Do you want to continue where you left off?";

  mostrarModalMusica("⏸️ Saved progress found", mensaje, [
    {
      texto: "Start over",
      estilo: "background:#E5E5E5; color:#1B1035;",
      accion: function () {
        abrirJuegoMusica(cancion);
        iniciarSesionMusica();
      }
    },
    {
      texto: "Continue",
      estilo: "background:#58CC02; color:white;",
      accion: function () {
        abrirJuegoMusica(cancion);
        reanudarEstadoMusica(estado);
      }
    }
  ]);
}

/* ============================================================
   PANTALLA
   ============================================================ */
function mostrarFeedbackMusica(texto, tipo) {
  const caja = document.getElementById("musicaFeedback");
  if (!caja) return;
  caja.textContent = texto;
  caja.className = "musica-feedback" + (tipo ? " " + tipo : "");
}

function mostrarTranscripcionMusica(texto) {
  const caja = document.getElementById("musicaTranscripcion");
  if (!caja) return;
  caja.textContent = texto ? "Heard: “" + texto + "”" : "";
}

/* ============================================================
   CATÁLOGO Y DIFICULTAD
   ============================================================ */
function normalizarDificultadMusica(nivel) {
  return ["facil", "medio", "dificil"].includes(nivel) ? nivel : "facil";
}

function nombreDificultadMusica(nivel) {
  const nombres = {
    facil: "Easy",
    medio: "Medium",
    dificil: "Hard"
  };
  return nombres[normalizarDificultadMusica(nivel)];
}

function obtenerDificultadMusica() {
  if (typeof dificultadActual !== "undefined") {
    return normalizarDificultadMusica(dificultadActual);
  }
  return normalizarDificultadMusica(dificultadMusicaSeleccionada);
}

function actualizarCatalogoMusica() {
  const nivel = obtenerDificultadMusica();
  const nombreNivel = nombreDificultadMusica(nivel);

  // Mantiene sincronizados el menú y el selector del catálogo.
  if (typeof resaltarDificultadMenu === "function") {
    resaltarDificultadMenu(nivel);
  }

  const etiqueta = document.getElementById("musicaDificultadActual");
  if (etiqueta) etiqueta.textContent = nombreNivel;

  document.querySelectorAll("#musicaSelectorDificultad .musica-dificultad-chip").forEach(function (boton) {
    const activo = boton.dataset.dificultad === nivel;
    boton.classList.toggle("activa", activo);
    boton.setAttribute("aria-pressed", activo ? "true" : "false");
  });

  const lista = document.getElementById("musicaListaCanciones");
  if (!lista) return;
  lista.innerHTML = "";

  const canciones = CATALOGO_CANCIONES
    .filter(function (cancion) {
      return cancion.dificultad === nivel;
    })
    .sort(function (a, b) {
      return a.numero - b.numero;
    });

  if (canciones.length === 0) {
    const vacio = document.createElement("div");
    vacio.className = "musica-vacio";
    vacio.innerHTML =
      '<span class="musica-vacio-icono">🚧</span>' +
      "<strong>Coming soon</strong>" +
      "<span>There are no songs for the " + nombreNivel + " level yet.</span>";
    lista.appendChild(vacio);
    return;
  }

  const completadas = leerCompletadasMusica();

  canciones.forEach(function (cancion) {
    const completada = completadas.has(claveCancionMusica(cancion));
    const desbloqueada = cancionDesbloqueadaMusica(cancion, completadas);
    const puedeJugar = desbloqueada && cancion.disponible;
    const guardado = puedeJugar ? leerEstadoMusica(cancion) : null;
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "musica-cancion-item";

    let icono = "▶";
    let tituloCancion = "";
    let metaCancion = "";

    if (puedeJugar) {
      if (completada) boton.classList.add("completada");
      icono = "▶";
      tituloCancion = "Song " + cancion.numero + ": 🎵 " + cancion.titulo;
      metaCancion = "(" + nombreDificultadMusica(cancion.dificultad) + " - " +
        cancion.frases + " phrases" + (completada ? " · ✓ Completed" : "") +
        (guardado ? " · ⏸️ Saved" : "") + ")";
      boton.addEventListener("click", function () {
        seleccionarCancionMusica(cancion.id);
      });
    } else {
      boton.classList.add("bloqueada");
      boton.disabled = true;

      if (!desbloqueada) {
        icono = "🔒";
        tituloCancion = "Song " + cancion.numero + ": 🔒 Locked";
        metaCancion = "(" + nombreDificultadMusica(cancion.dificultad) +
          " - Complete Song " + (cancion.numero - 1) + " to unlock)";
      } else {
        icono = "⏳";
        tituloCancion = "Song " + cancion.numero + ": ⏳ Coming soon";
        metaCancion = "(" + nombreDificultadMusica(cancion.dificultad) + " - Coming soon)";
      }
    }

    boton.innerHTML =
      '<span class="musica-cancion-info">' +
        '<span class="musica-cancion-nombre">' + tituloCancion + "</span>" +
        '<span class="musica-cancion-meta">' + metaCancion + "</span>" +
      "</span>" +
      '<span class="musica-cancion-play" aria-hidden="true">' + icono + "</span>";
    lista.appendChild(boton);
  });
}

function mostrarCatalogoMusica() {
  cancelarTemporizadoresMusica();
  detenerAudios();
  detenerReconocimientoMusica();

  document.getElementById("musicaJuego").classList.add("oculto");
  document.getElementById("musicaCatalogo").classList.remove("oculto");
  document.getElementById("musicaResultados").classList.add("oculto");
  document.getElementById("btnVolverMusica").textContent = "⬅ Back to menu";
  actualizarCatalogoMusica();
}

function seleccionarCancionMusica(id) {
  const nivel = obtenerDificultadMusica();
  const cancion = CATALOGO_CANCIONES.find(function (item) {
    return item.id === id && item.dificultad === nivel && item.disponible;
  });

  if (!cancion || !cancionDesbloqueadaMusica(cancion)) return;

  const estadoGuardado = leerEstadoMusica(cancion);
  if (estadoGuardado) {
    preguntarContinuarMusica(cancion, estadoGuardado);
    return;
  }

  abrirJuegoMusica(cancion);
  iniciarSesionMusica();
}

function cambiarDificultadMusica(nivel) {
  const nivelNormalizado = normalizarDificultadMusica(nivel);

  if (typeof seleccionarDificultad === "function") {
    seleccionarDificultad(nivelNormalizado, null);
  } else {
    dificultadMusicaSeleccionada = nivelNormalizado;
    if (typeof dificultadActual !== "undefined") {
      dificultadActual = nivelNormalizado;
    }
  }

  actualizarCatalogoMusica();
}

function manejarVolverMusica() {
  const juego = document.getElementById("musicaJuego");
  if (juego && !juego.classList.contains("oculto")) {
    mostrarCatalogoMusica();
    return;
  }
  volverMenuMusica();
}

function actualizarPantallaMusica() {
  const totalLineas = CANCION_DATOS.length;
  const totalPosible = totalLineas * MUSICA_TOTAL_RONDAS * MUSICA_PUNTOS_POR_LINEA;
  const tituloCancion = document.getElementById("musicaTituloCancion");
  if (tituloCancion) {
    tituloCancion.textContent = "🎶 " + cancionActualMusica.titulo;
  }

  document.getElementById("musicaRonda").textContent =
    "Round " + Math.min(rondaActual, MUSICA_TOTAL_RONDAS) + " of " + MUSICA_TOTAL_RONDAS;
  document.getElementById("musicaLinea").textContent =
    "Line " + Math.min(lineaActualIndex + 1, totalLineas) + " of " + totalLineas;
  document.getElementById("musicaFrase").textContent = CANCION_DATOS[lineaActualIndex].text;
  document.getElementById("musicaPuntaje").textContent = "⭐ " + puntajeTotal + " pts";
  document.getElementById("musicaBarra").style.width =
    Math.min(100, (puntajeTotal / totalPosible) * 100) + "%";

  const botonGuia = document.getElementById("btnMusicaGuia");
  const botonMic = document.getElementById("btnMusicaMic");

  if (!musicaEscuchando) {
    botonGuia.disabled = musicaLineaCompletada;

    if (!musicaLineaCompletada) {
      botonMic.disabled = false;
      botonMic.classList.remove("escuchando");
      botonMic.textContent = "🎤 Speak";
    }
  }
}

function iniciarSesionMusica() {
  cancelarTemporizadoresMusica();
  detenerAudios();
  detenerReconocimientoMusica();
  borrarEstadoMusica(cancionActualMusica);

  CANCION_DATOS = cancionActualMusica.datos;
  rondaActual = 1;
  lineaActualIndex = 0;
  puntajeTotal = 0;
  musicaErroresLinea = 0;
  musicaErroresTotales = 0;
  musicaLineaCompletada = false;
  musicaSesionGuardada = false;

  document.getElementById("musicaResultados").classList.add("oculto");
  document.getElementById("musicaTranscripcion").textContent = "";
  document.getElementById("btnMusicaGuia").disabled = false;
  const desbloqueo = document.getElementById("musicaResultadoDesbloqueo");
  if (desbloqueo) desbloqueo.textContent = "";

  actualizarPantallaMusica();
  mostrarFeedbackMusica("Listen to the guide and repeat the phrase with the microphone.", "");
}

function abrirSeccionMusica() {
  document.getElementById("pantallaMenu").classList.add("oculto");
  document.getElementById("pantallaMenuVerbos").classList.add("oculto");
  document.getElementById("pantallaNivel").classList.add("oculto");
  document.getElementById("pantallaNivelOraciones").classList.add("oculto");
  document.getElementById("pantallaFrases").classList.add("oculto");
  document.getElementById("juegoEnCurso").classList.add("oculto");
  document.getElementById("juegoFinal").classList.add("oculto");
  document.getElementById("app").classList.add("oculto");

  document.getElementById("seccion-musica").classList.remove("oculto");
  mostrarCatalogoMusica();
}

function volverMenuMusica() {
  cancelarTemporizadoresMusica();
  detenerAudios();
  detenerReconocimientoMusica();

  document.getElementById("seccion-musica").classList.add("oculto");
  document.getElementById("musicaCatalogo").classList.add("oculto");
  document.getElementById("musicaJuego").classList.add("oculto");
  document.getElementById("musicaResultados").classList.add("oculto");
  mostrarMenuPrincipal();
}

function reintentarMusica() {
  document.getElementById("musicaResultados").classList.add("oculto");
  iniciarSesionMusica();
}

/* ============================================================
   CONEXIONES
   ============================================================ */
document.getElementById("btnVolverMusica").addEventListener("click", manejarVolverMusica);
document.getElementById("btnMusicaPausa").addEventListener("click", guardarEstadoMusica);
document.getElementById("btnMusicaGuia").addEventListener("click", reproducirAudioGuia);
document.getElementById("btnMusicaMic").addEventListener("click", pronunciarLinea);
document.getElementById("btnMusicaReintentar").addEventListener("click", reintentarMusica);
document.getElementById("btnMusicaVolverCatalogo").addEventListener("click", mostrarCatalogoMusica);
document.getElementById("btnMusicaVolverMenu").addEventListener("click", volverMenuMusica);

document.querySelectorAll("#musicaSelectorDificultad .musica-dificultad-chip").forEach(function (boton) {
  boton.addEventListener("click", function () {
    cambiarDificultadMusica(boton.dataset.dificultad);
  });
});
