/* ============================================================
   datos.js
   Datos fijos: rutas de imágenes, los 16 verbos, pronombres, colores y funciones auxiliares.
   ============================================================ */

  /* ============================================================
     PASO 1: datos de los 16 verbos (nombre, imagen y conjugaciones)
     ============================================================ */
  // ----- DÓNDE ESTÁN LAS IMÁGENES (se cambia solo acá) -----
  // La carpeta va junto a index.html. Los archivos se llaman como el verbo: Play.jpeg, Eat.jpeg...
  const CARPETA_IMAGENES = "imagenes_verbos/";
  const EXTENSION_IMAGENES = ".jpeg";

  function rutaImagen(nombre) {
    return CARPETA_IMAGENES + nombre + EXTENSION_IMAGENES;
  }

  const verbos = [
  { nombre: "Play", img: rutaImagen("Play"), past: "played", pres: "play", pres3: "plays", fut: "will play" },
  { nombre: "Eat", img: rutaImagen("Eat"), past: "ate", pres: "eat", pres3: "eats", fut: "will eat" },
  { nombre: "Read", img: rutaImagen("Read"), past: "read", pres: "read", pres3: "reads", fut: "will read" },
  { nombre: "Sing", img: rutaImagen("Sing"), past: "sang", pres: "sing", pres3: "sings", fut: "will sing" },
  { nombre: "Write", img: rutaImagen("Write"), past: "wrote", pres: "write", pres3: "writes", fut: "will write" },
  { nombre: "Sleep", img: rutaImagen("Sleep"), past: "slept", pres: "sleep", pres3: "sleeps", fut: "will sleep" },
  { nombre: "Run", img: rutaImagen("Run"), past: "ran", pres: "run", pres3: "runs", fut: "will run" },
  { nombre: "Talk", img: rutaImagen("Talk"), past: "talked", pres: "talk", pres3: "talks", fut: "will talk" },
  { nombre: "Dance", img: rutaImagen("Dance"), past: "danced", pres: "dance", pres3: "dances", fut: "will dance" },
  { nombre: "Listen", img: rutaImagen("Listen"), past: "listened", pres: "listen", pres3: "listens", fut: "will listen" },
  { nombre: "Speak", img: rutaImagen("Speak"), past: "spoke", pres: "speak", pres3: "speaks", fut: "will speak" },
  { nombre: "Ask", img: rutaImagen("Ask"), past: "asked", pres: "ask", pres3: "asks", fut: "will ask" },
  { nombre: "Answer", img: rutaImagen("Answer"), past: "answered", pres: "answer", pres3: "answers", fut: "will answer" },
  { nombre: "Learn", img: rutaImagen("Learn"), past: "learned", pres: "learn", pres3: "learns", fut: "will learn" },
  { nombre: "Teach", img: rutaImagen("Teach"), past: "taught", pres: "teach", pres3: "teaches", fut: "will teach" },
  { nombre: "Practice", img: rutaImagen("Practice"), past: "practiced", pres: "practice", pres3: "practices", fut: "will practice" }
  ];

  // Pronombre según quién aparece en la imagen de cada verbo (cámbialo si no coincide)
  const pronombrePorVerbo = {
    Play: "She", Eat: "She", Read: "She", Sing: "She", Write: "She", Sleep: "She",
    Run: "He", Talk: "She", Dance: "She", Listen: "She", Speak: "She", Ask: "She",
    Answer: "She", Learn: "They", Teach: "She", Practice: "She"
  };

  const pronombres = ["I", "You", "He", "She", "It", "We", "You", "They"];
  const esTercera  = [false, false, true, true, true, false, false, false];
  const pronombresUnicos = ["I", "You", "He", "She", "It", "We", "They"];

  const coloresVivos = [
    ["#FF6EC7", "#7C4DFF"], ["#00E5FF", "#2979FF"], ["#FFD500", "#FF7A00"],
    ["#00E676", "#00B8D4"], ["#FF3D57", "#FF9100"], ["#B388FF", "#00E5FF"],
    ["#FFEA00", "#FF3D71"], ["#45F0A6", "#7C4DFF"],
  ];
  const coloresPastel = [
    ["#FFD9F0", "#E7D9FF"], ["#C9F3FF", "#D2E0FF"], ["#FFF3B0", "#FFDFC2"],
    ["#C8FFE0", "#C6F5FF"], ["#FFD6DC", "#FFE6C2"], ["#E7D9FF", "#CFF7FF"],
    ["#FFF6B0", "#FFD6E0"], ["#CFFCE8", "#E7D9FF"],
  ];

  function pintarColores(i) {
    const [f1, f2] = coloresVivos[i % coloresVivos.length];
    const [t1, t2] = coloresPastel[i % coloresPastel.length];
    document.body.style.setProperty("--fondo1", f1);
    document.body.style.setProperty("--fondo2", f2);
    document.body.style.setProperty("--tarjeta1", t1);
    document.body.style.setProperty("--tarjeta2", t2);
  }

  function mezclar(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  function elegirAlAzar(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
  }

  const datosOraciones = {
      facil: [
        {texto: "The cat runs", es: "El gato corre", categoria: "animales"},
        {texto: "I eat bread", es: "Yo como pan", categoria: "verbos"}
      ],
      medio: [
        {texto: "The dogs plays in the park", es: "El perro juega en el parque", categoria: "mix"}
      ],
      dificil: [
        {texto: "She sings beautiful songs loudly", es: "Ella canta canciones hermosas en voz alta", categoria: "mix"}
      ]
  };

  // Banco de Preguntas y Respuestas organizadas por dificultad
const datosPreguntas = {
  facil: [
    { pregunta: "What is your name?", opciones: ["My name is Alex", "I am fine", "Yes, I do"], correcta: 0 },
    { pregunta: "How old are you?", opciones: ["I have 20 years", "I am 20 years old", "It is 20 o'clock"], correcta: 1 }
  ],
  medio: [
    { pregunta: "Where do you live?", opciones: ["I live in New York", "I live yesterday", "I am living happy"], correcta: 0 }
  ],
  dificil: [
    { pregunta: "What would you do if it rains?", opciones: ["I will bring an umbrella", "I stayed at home", "I would take an umbrella"], correcta: 2 }
  ]
};


  /* ============================================================
     FRASES DE USO FRECUENTE
     Las imágenes van en la carpeta "imagenes_frases" (junto a index.html).
     Cada frase tiene el nombre del archivo en "img" (sin la extensión).
     Si todavía no existe la imagen, se muestra un dibujo de respaldo con el "icono".
     Para agregar frases: copia una línea y cambia sus datos. Los niveles
     "medio" y "dificil" están vacíos a propósito (los hacen otros compañeros).
     ============================================================ */
  const CARPETA_IMAGENES_FRASES = "imagenes_frases/";
  const EXTENSION_IMAGENES_FRASES = ".jpeg";

  function rutaImagenFrase(nombre) {
    return CARPETA_IMAGENES_FRASES + nombre + EXTENSION_IMAGENES_FRASES;
  }

  // Dibujo de respaldo (SVG) mientras no exista la imagen de la frase
  function imagenRespaldoFrase(icono) {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" rx="40" fill="#EDE7FF"/><text x="200" y="250" font-size="170" text-anchor="middle">' + icono + '</text></svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  const datosFrases = {
    facil: [
      { texto: "Good morning",        es: "Buenos días",     img: "GoodMorning",      icono: "🌅" },
      { texto: "How are you?",        es: "¿Cómo estás?",    img: "HowAreYou",        icono: "🙂" },
      { texto: "What is your name?",  es: "¿Cómo te llamas?", img: "WhatIsYourName",  icono: "🏷️" },
      { texto: "Nice to meet you",    es: "Mucho gusto",     img: "NiceToMeetYou",    icono: "🤝" },
      { texto: "Thank you very much", es: "Muchas gracias",  img: "ThankYouVeryMuch", icono: "🙏" }
    ],
    medio: [],
    dificil: []
  };
