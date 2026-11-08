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

  /* ============================================================
     BUILD SENTENCES: las oraciones por categoría y dificultad
     Cada categoría (verbos, animales, comida, cosas) tiene 10 oraciones por nivel.
     El modo "Mix" no tiene lista propia: junta 4 oraciones de cada categoría (16 en total).
     En "verbos" la oración habla del dibujo del verbo (verbo: "Play" -> imagenes_verbos/Play.jpeg).
     En las demás, la oración habla del emoji que se muestra (emoji: "🐱").
     Para agregar una oración: copia una línea y cambia texto, es y verbo/emoji.
     ============================================================ */
  const datosOraciones = {
    verbos: {
      facil: [
        { texto: "She plays with a cat", es: "Ella juega con un gato", verbo: "Play" },
        { texto: "She eats watermelon", es: "Ella come sandía", verbo: "Eat" },
        { texto: "She reads a book", es: "Ella lee un libro", verbo: "Read" },
        { texto: "She sings a song", es: "Ella canta una canción", verbo: "Sing" },
        { texto: "She writes in a notebook", es: "Ella escribe en un cuaderno", verbo: "Write" },
        { texto: "She sleeps in class", es: "Ella duerme en clase", verbo: "Sleep" },
        { texto: "He runs fast", es: "Él corre rápido", verbo: "Run" },
        { texto: "She talks on the phone", es: "Ella habla por teléfono", verbo: "Talk" },
        { texto: "She dances happily", es: "Ella baila felizmente", verbo: "Dance" },
        { texto: "She listens to music", es: "Ella escucha música", verbo: "Listen" }
      ],
      medio: [
        { texto: "She speaks on her pink phone", es: "Ella habla en su teléfono rosado", verbo: "Speak" },
        { texto: "She asks a difficult question", es: "Ella hace una pregunta difícil", verbo: "Ask" },
        { texto: "She answers every question clearly", es: "Ella responde cada pregunta con claridad", verbo: "Answer" },
        { texto: "They learn to draw people", es: "Ellos aprenden a dibujar personas", verbo: "Learn" },
        { texto: "She teaches the children with a book", es: "Ella enseña a los niños con un libro", verbo: "Teach" },
        { texto: "She practices hard at the table", es: "Ella practica mucho en la mesa", verbo: "Practice" },
        { texto: "She plays with her orange cat", es: "Ella juega con su gato naranja", verbo: "Play" },
        { texto: "She eats watermelon with a spoon", es: "Ella come sandía con una cuchara", verbo: "Eat" },
        { texto: "She reads a book with her cat", es: "Ella lee un libro con su gato", verbo: "Read" },
        { texto: "She sings into the microphone", es: "Ella canta en el micrófono", verbo: "Sing" }
      ],
      dificil: [
        { texto: "She writes in her notebook with a black pen", es: "Ella escribe en su cuaderno con un bolígrafo negro", verbo: "Write" },
        { texto: "She sleeps on her desk during the class", es: "Ella duerme sobre su escritorio durante la clase", verbo: "Sleep" },
        { texto: "He runs fast with a brown bag on his shoulder", es: "Él corre rápido con una bolsa marrón en el hombro", verbo: "Run" },
        { texto: "She practices very hard with many papers and books", es: "Ella practica muy duro con muchos papeles y libros", verbo: "Practice" },
        { texto: "She dances happily in a red dress under the stars", es: "Ella baila felizmente con un vestido rojo bajo las estrellas", verbo: "Dance" },
        { texto: "She closes her eyes and listens to music with headphones", es: "Ella cierra los ojos y escucha música con audífonos", verbo: "Listen" },
        { texto: "She wears glasses and asks many difficult questions", es: "Ella usa lentes y hace muchas preguntas difíciles", verbo: "Ask" },
        { texto: "She answers the questions and explains with her hands", es: "Ella responde las preguntas y explica con las manos", verbo: "Answer" },
        { texto: "They learn to draw a person in the art class", es: "Ellos aprenden a dibujar una persona en la clase de arte", verbo: "Learn" },
        { texto: "She teaches the small children with a story book", es: "Ella enseña a los niños pequeños con un libro de cuentos", verbo: "Teach" }
      ]
    },
    animales: {
      facil: [
        { texto: "The cat drinks milk", es: "El gato bebe leche", emoji: "🐱" },
        { texto: "The dog runs fast", es: "El perro corre rápido", emoji: "🐶" },
        { texto: "The pig is pink", es: "El cerdo es rosado", emoji: "🐷" },
        { texto: "The cow gives milk", es: "La vaca da leche", emoji: "🐮" },
        { texto: "The bee makes honey", es: "La abeja hace miel", emoji: "🐝" },
        { texto: "The owl sees at night", es: "El búho ve de noche", emoji: "🦉" },
        { texto: "The duck swims", es: "El pato nada", emoji: "🦆" },
        { texto: "The frog is green", es: "La rana es verde", emoji: "🐸" },
        { texto: "The fish lives in water", es: "El pez vive en el agua", emoji: "🐟" },
        { texto: "The bear eats honey", es: "El oso come miel", emoji: "🐻" }
      ],
      medio: [
        { texto: "The lion is the king of animals", es: "El león es el rey de los animales", emoji: "🦁" },
        { texto: "The wolf howls at the moon", es: "El lobo aúlla a la luna", emoji: "🐺" },
        { texto: "The crab walks on the sand", es: "El cangrejo camina en la arena", emoji: "🦀" },
        { texto: "The bird sings in the tree", es: "El pájaro canta en el árbol", emoji: "🐦" },
        { texto: "The deer eats green grass", es: "El venado come pasto verde", emoji: "🦌" },
        { texto: "The goat climbs the high mountain", es: "La cabra sube la montaña alta", emoji: "🐐" },
        { texto: "The white swan swims in the lake", es: "El cisne blanco nada en el lago", emoji: "🦢" },
        { texto: "The ant carries a small leaf", es: "La hormiga lleva una hoja pequeña", emoji: "🐜" },
        { texto: "The bat sleeps during the day", es: "El murciélago duerme durante el día", emoji: "🦇" },
        { texto: "The horse runs in the field", es: "El caballo corre en el campo", emoji: "🐴" }
      ],
      dificil: [
        { texto: "The tiger has orange fur with black stripes", es: "El tigre tiene pelo naranja con rayas negras", emoji: "🐯" },
        { texto: "The sheep gives us soft wool in winter", es: "La oveja nos da lana suave en invierno", emoji: "🐑" },
        { texto: "The zebra has black and white stripes on its body", es: "La cebra tiene rayas blancas y negras en su cuerpo", emoji: "🦓" },
        { texto: "The panda eats bamboo all day in the forest", es: "El panda come bambú todo el día en el bosque", emoji: "🐼" },
        { texto: "The koala sleeps in a tree for many hours", es: "El koala duerme en un árbol por muchas horas", emoji: "🐨" },
        { texto: "The penguin swims very fast in cold water", es: "El pingüino nada muy rápido en agua fría", emoji: "🐧" },
        { texto: "The elephant uses its long nose to drink water", es: "El elefante usa su larga nariz para beber agua", emoji: "🐘" },
        { texto: "The giraffe has a very long neck", es: "La jirafa tiene un cuello muy largo", emoji: "🦒" },
        { texto: "The kangaroo carries its baby in a pocket", es: "El canguro lleva a su bebé en una bolsa", emoji: "🦘" },
        { texto: "The dolphin jumps out of the water", es: "El delfín salta fuera del agua", emoji: "🐬" }
      ]
    },
    comida: {
      facil: [
        { texto: "I eat an apple", es: "Yo como una manzana", emoji: "🍎" },
        { texto: "I like bread", es: "Me gusta el pan", emoji: "🍞" },
        { texto: "The egg is white", es: "El huevo es blanco", emoji: "🥚" },
        { texto: "The pizza is hot", es: "La pizza está caliente", emoji: "🍕" },
        { texto: "The banana is yellow", es: "La banana es amarilla", emoji: "🍌" },
        { texto: "I drink cold milk", es: "Yo bebo leche fría", emoji: "🥛" },
        { texto: "The cake is sweet", es: "El pastel es dulce", emoji: "🍰" },
        { texto: "The orange is round", es: "La naranja es redonda", emoji: "🍊" },
        { texto: "The cheese is yellow", es: "El queso es amarillo", emoji: "🧀" },
        { texto: "The strawberry is red", es: "La fresa es roja", emoji: "🍓" }
      ],
      medio: [
        { texto: "We eat sweet grapes at lunch", es: "Comemos uvas dulces en el almuerzo", emoji: "🍇" },
        { texto: "The watermelon is big and juicy", es: "La sandía es grande y jugosa", emoji: "🍉" },
        { texto: "He eats a burger with cheese", es: "Él come una hamburguesa con queso", emoji: "🍔" },
        { texto: "She eats hot fries with salt", es: "Ella come papas fritas calientes con sal", emoji: "🍟" },
        { texto: "Rabbits like to eat carrots", es: "A los conejos les gusta comer zanahorias", emoji: "🥕" },
        { texto: "The chocolate is sweet and brown", es: "El chocolate es dulce y marrón", emoji: "🍫" },
        { texto: "My father drinks coffee every morning", es: "Mi papá toma café cada mañana", emoji: "☕" },
        { texto: "I eat a cookie after lunch", es: "Yo como una galleta después del almuerzo", emoji: "🍪" },
        { texto: "The corn is yellow and sweet", es: "El maíz es amarillo y dulce", emoji: "🌽" },
        { texto: "The pineapple is a tropical fruit", es: "La piña es una fruta tropical", emoji: "🍍" }
      ],
      dificil: [
        { texto: "We cook pasta with tomato sauce for dinner", es: "Cocinamos pasta con salsa de tomate para la cena", emoji: "🍝" },
        { texto: "I make a fresh salad with lettuce and tomato", es: "Preparo una ensalada fresca con lechuga y tomate", emoji: "🥗" },
        { texto: "Sushi is made with rice and fresh fish", es: "El sushi se hace con arroz y pescado fresco", emoji: "🍣" },
        { texto: "She bakes a hot apple pie in the oven", es: "Ella hornea un pastel de manzana caliente en el horno", emoji: "🥧" },
        { texto: "I eat a warm croissant for breakfast", es: "Yo como un croissant caliente en el desayuno", emoji: "🥐" },
        { texto: "The avocado is green and healthy for your body", es: "El aguacate es verde y saludable para tu cuerpo", emoji: "🥑" },
        { texto: "We eat popcorn at the movies on Friday night", es: "Comemos palomitas en el cine el viernes por la noche", emoji: "🍿" },
        { texto: "My mother bakes a chocolate cupcake for my birthday", es: "Mi mamá hornea un cupcake de chocolate para mi cumpleaños", emoji: "🧁" },
        { texto: "He makes hot pancakes with honey on Sunday", es: "Él hace panqueques calientes con miel el domingo", emoji: "🥞" },
        { texto: "She makes a sandwich with cheese and tomato for lunch", es: "Ella hace un sándwich con queso y tomate para el almuerzo", emoji: "🥪" }
      ]
    },
    cosas: {
      facil: [
        { texto: "The key opens the door", es: "La llave abre la puerta", emoji: "🔑" },
        { texto: "I ride a bike", es: "Yo monto una bicicleta", emoji: "🚲" },
        { texto: "The car is red", es: "El carro es rojo", emoji: "🚗" },
        { texto: "I kick the ball", es: "Yo pateo la pelota", emoji: "⚽" },
        { texto: "I sleep in my bed", es: "Yo duermo en mi cama", emoji: "🛏️" },
        { texto: "The bell rings", es: "La campana suena", emoji: "🔔" },
        { texto: "The tree is tall", es: "El árbol es alto", emoji: "🌳" },
        { texto: "This gift is for you", es: "Este regalo es para ti", emoji: "🎁" },
        { texto: "The star is bright", es: "La estrella es brillante", emoji: "⭐" },
        { texto: "My house is big", es: "Mi casa es grande", emoji: "🏠" }
      ],
      medio: [
        { texto: "I read a book every night", es: "Yo leo un libro cada noche", emoji: "📖" },
        { texto: "My phone is on the table", es: "Mi teléfono está sobre la mesa", emoji: "📱" },
        { texto: "The clock is on the wall", es: "El reloj está en la pared", emoji: "🕐" },
        { texto: "He plays the guitar very well", es: "Él toca la guitarra muy bien", emoji: "🎸" },
        { texto: "She plays the piano every day", es: "Ella toca el piano todos los días", emoji: "🎹" },
        { texto: "I take photos with my camera", es: "Yo tomo fotos con mi cámara", emoji: "📷" },
        { texto: "The rocket goes to the moon", es: "El cohete va a la luna", emoji: "🚀" },
        { texto: "The plane flies over the clouds", es: "El avión vuela sobre las nubes", emoji: "✈️" },
        { texto: "The queen wears a golden crown", es: "La reina usa una corona dorada", emoji: "👑" },
        { texto: "I listen to music with headphones", es: "Yo escucho música con audífonos", emoji: "🎧" }
      ],
      dificil: [
        { texto: "I take my umbrella when it rains in the city", es: "Llevo mi paraguas cuando llueve en la ciudad", emoji: "☂️" },
        { texto: "My father works on his computer every morning", es: "Mi papá trabaja en su computadora cada mañana", emoji: "💻" },
        { texto: "The student carries books in a heavy backpack", es: "El estudiante lleva libros en una mochila pesada", emoji: "🎒" },
        { texto: "We look at the stars with a big telescope", es: "Miramos las estrellas con un telescopio grande", emoji: "🔭" },
        { texto: "The helicopter flies over the mountain and the lake", es: "El helicóptero vuela sobre la montaña y el lago", emoji: "🚁" },
        { texto: "The winner of the game receives a golden trophy", es: "El ganador del juego recibe un trofeo dorado", emoji: "🏆" },
        { texto: "The scientist looks at small things with a microscope", es: "El científico mira cosas pequeñas con un microscopio", emoji: "🔬" },
        { texto: "He rides his motorcycle to work every day", es: "Él maneja su moto al trabajo todos los días", emoji: "🏍️" },
        { texto: "The ambulance drives fast to help sick people", es: "La ambulancia va rápido para ayudar a los enfermos", emoji: "🚑" },
        { texto: "Many cars cross the long bridge at night", es: "Muchos carros cruzan el puente largo de noche", emoji: "🌉" }
      ]
    }
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
     - Las frases se agrupan por categoría (CATEGORIAS_FRASES) y por nivel.
     - Niveles: facil = 2 a 3 palabras, medio = 4 a 6, dificil = 7 o más.
     - Cada frase lleva: texto (inglés), es (español) y emoji.
       "img" es opcional: es el nombre del archivo en la carpeta imagenes_frases
       (sin la extensión). Si la imagen no existe, se usa el emoji.
     - Para agregar una frase: copia una línea, cambia sus datos y revisa la coma.
     - Para agregar una categoría: suma una línea en CATEGORIAS_FRASES y un
       bloque nuevo en frasesPorCategoria con el mismo id. "mix" no lleva bloque.
     ============================================================ */
  const CARPETA_IMAGENES_FRASES = "imagenes_frases/";
  const EXTENSION_IMAGENES_FRASES = ".jpeg";

  function rutaImagenFrase(nombre) {
    return CARPETA_IMAGENES_FRASES + nombre + EXTENSION_IMAGENES_FRASES;
  }

  // Dibujo de respaldo (SVG con el emoji) mientras no exista la imagen de la frase
  function imagenRespaldoFrase(emoji) {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" rx="40" fill="#EDE7FF"/><text x="200" y="250" font-size="170" text-anchor="middle">' + emoji + '</text></svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  const CATEGORIAS_FRASES = [
    {id: "saludos", nombre: "Greetings",  emoji: "👋"},
    {id: "escuela", nombre: "School",     emoji: "🏫"},
    {id: "trabajo", nombre: "Work",       emoji: "💼"},
    {id: "diario",  nombre: "Daily life", emoji: "🏠"},
    {id: "mix",     nombre: "Mix",        emoji: "🎲"}
  ];

  const frasesPorCategoria = {

    // ---------------------------------------------------------
    saludos: {
      facil: [
        {texto: "Good morning",    es: "Buenos días",        emoji: "🌅"},
        {texto: "Good afternoon",  es: "Buenas tardes",      emoji: "☀️"},
        {texto: "Good night",      es: "Buenas noches",      emoji: "🌙"},
        {texto: "Hello, friend",   es: "Hola, amigo",        emoji: "👋", img: "HelloFriend"},
        {texto: "See you later",   es: "Hasta luego",        emoji: "🔜"},
        {texto: "How are you?",    es: "¿Cómo estás?",       emoji: "🙂", img: "HowAreYou"},
        {texto: "Thank you",       es: "Gracias",            emoji: "🙏"},
        {texto: "You are welcome", es: "De nada",            emoji: "😊", img: "YouAreWelcome"},
        {texto: "Bye, my friend",  es: "Adiós, amigo",       emoji: "🖐️"},
        {texto: "Welcome home",    es: "Bienvenido a casa",  emoji: "🏠", img: "WelcomeHome"}
      ],
      medio: [
        {texto: "How are you today?",     es: "¿Cómo estás hoy?",                emoji: "😀"},
        {texto: "Nice to meet you",       es: "Mucho gusto",                     emoji: "🤝"},
        {texto: "Have a nice day",        es: "Que tengas un buen día",          emoji: "🌞"},
        {texto: "What is your name?",     es: "¿Cómo te llamas?",                emoji: "🏷️", img: "WhatIsYourName"},
        {texto: "My name is Ana",         es: "Me llamo Ana",                    emoji: "📛"},
        {texto: "Thank you very much",    es: "Muchas gracias",                  emoji: "🎁"},
        {texto: "See you tomorrow morning", es: "Nos vemos mañana por la mañana", emoji: "🌄"},
        {texto: "I am fine, thank you",   es: "Estoy bien, gracias",             emoji: "😊"},
        {texto: "Where are you from?",    es: "¿De dónde eres?",                 emoji: "🌎", img: "WhereAreYouFrom"},
        {texto: "Good to see you again",  es: "Qué bueno verte otra vez",        emoji: "🤗"}
      ],
      dificil: [
        {texto: "I am fine, thank you, and you?",                  es: "Estoy bien, gracias, ¿y tú?",                          emoji: "😁"},
        {texto: "It is a pleasure to meet you",                    es: "Es un placer conocerte",                               emoji: "🤝"},
        {texto: "Have a great day and see you tomorrow",           es: "Que tengas un gran día y hasta mañana",                emoji: "🌻"},
        {texto: "Excuse me, could you tell me your name?",         es: "Disculpa, ¿podrías decirme tu nombre?",                emoji: "🙋"},
        {texto: "I am from Bolivia and I live in Cochabamba",      es: "Soy de Bolivia y vivo en Cochabamba",                  emoji: "🗺️"},
        {texto: "Hello, how was your weekend with your family?",   es: "Hola, ¿cómo estuvo tu fin de semana con tu familia?",  emoji: "👪"},
        {texto: "Thank you so much for all your help today",       es: "Muchas gracias por toda tu ayuda hoy",                 emoji: "🤲"},
        {texto: "I am sorry, I did not catch your name",           es: "Lo siento, no escuché tu nombre",                      emoji: "🙇"},
        {texto: "Welcome to our house, please come in and sit down", es: "Bienvenido a nuestra casa, pasa y siéntate",         emoji: "🚪"},
        {texto: "It was very nice talking to you, see you soon",   es: "Fue muy agradable hablar contigo, nos vemos pronto",   emoji: "💬"}
      ]
    },

    // ---------------------------------------------------------
    escuela: {
      facil: [
        {texto: "Open your book",   es: "Abre tu libro",              emoji: "📖"},
        {texto: "Close your book",  es: "Cierra tu libro",            emoji: "📕"},
        {texto: "Sit down, please", es: "Siéntate, por favor",        emoji: "🪑", img: "SitDownPlease"},
        {texto: "Stand up",         es: "Ponte de pie",               emoji: "🧍"},
        {texto: "I have homework",  es: "Tengo tarea",                emoji: "📝"},
        {texto: "Listen, please",   es: "Escucha, por favor",         emoji: "👂", img: "ListenPlease"},
        {texto: "Raise your hand",  es: "Levanta la mano",            emoji: "✋"},
        {texto: "Write your name",  es: "Escribe tu nombre",          emoji: "✍️"},
        {texto: "Read the text",    es: "Lee el texto",               emoji: "📄"},
        {texto: "I like math",      es: "Me gustan las matemáticas",  emoji: "➗"}
      ],
      medio: [
        {texto: "May I go to the bathroom?",       es: "¿Puedo ir al baño?",                emoji: "🚻"},
        {texto: "I do not understand",             es: "No entiendo",                       emoji: "❓", img: "IDoNotUnderstand"},
        {texto: "Can you repeat that, please?",    es: "¿Puede repetir eso, por favor?",    emoji: "🔁", img: "CanYouRepeatThatPlease"},
        {texto: "Please open your notebook",       es: "Por favor abre tu cuaderno",        emoji: "📓"},
        {texto: "The teacher is in class",         es: "El profesor está en clase",         emoji: "🧑‍🏫"},
        {texto: "I forgot my pencil",              es: "Olvidé mi lápiz",                   emoji: "✏️"},
        {texto: "What time is the break?",         es: "¿A qué hora es el recreo?",         emoji: "⏰"},
        {texto: "We have a test tomorrow",         es: "Tenemos un examen mañana",          emoji: "📋", img: "WeHaveATestTomorrow"},
        {texto: "Please be quiet in class",        es: "Por favor guarden silencio en clase", emoji: "🤫"},
        {texto: "My favorite subject is science",  es: "Mi materia favorita es ciencias",   emoji: "🔬"}
      ],
      dificil: [
        {texto: "Could you explain the lesson again, please?",    es: "¿Podría explicar la lección otra vez, por favor?", emoji: "💡"},
        {texto: "I forgot my notebook at home today",             es: "Olvidé mi cuaderno en casa hoy",                   emoji: "🎒"},
        {texto: "My teacher gave us a lot of homework",           es: "Mi profesor nos dio mucha tarea",                  emoji: "📚"},
        {texto: "Please take out your books and open page ten",   es: "Saquen sus libros y abran la página diez",         emoji: "🔟"},
        {texto: "I study English every day after school",         es: "Estudio inglés todos los días después de la escuela", emoji: "🔤"},
        {texto: "We have to finish the project before Friday",    es: "Tenemos que terminar el proyecto antes del viernes", emoji: "📅"},
        {texto: "Can I borrow your pen for a moment, please?",    es: "¿Me prestas tu bolígrafo un momento, por favor?",  emoji: "🖊️"},
        {texto: "The students are working together in small groups", es: "Los estudiantes trabajan juntos en grupos pequeños", emoji: "👥"},
        {texto: "I need more time to finish the exam",            es: "Necesito más tiempo para terminar el examen",      emoji: "⌛"},
        {texto: "Our school has a big library and a soccer field", es: "Nuestra escuela tiene una biblioteca grande y una cancha de fútbol", emoji: "⚽"}
      ]
    },

    // ---------------------------------------------------------
    trabajo: {
      facil: [
        {texto: "I work here",         es: "Trabajo aquí",            emoji: "💼", img: "IWorkHere"},
        {texto: "Open the door",       es: "Abre la puerta",          emoji: "🚪"},
        {texto: "Answer the phone",    es: "Contesta el teléfono",    emoji: "☎️"},
        {texto: "Send an email",       es: "Envía un correo",         emoji: "📧"},
        {texto: "Call the boss",       es: "Llama al jefe",           emoji: "📞"},
        {texto: "Good job",            es: "Buen trabajo",            emoji: "👍"},
        {texto: "Time to work",        es: "Hora de trabajar",        emoji: "🕘"},
        {texto: "Print the document",  es: "Imprime el documento",    emoji: "🖨️"},
        {texto: "Take a break",        es: "Toma un descanso",        emoji: "☕"},
        {texto: "I am busy",           es: "Estoy ocupado",           emoji: "⏳", img: "IAmBusy"}
      ],
      medio: [
        {texto: "I have a meeting today",       es: "Tengo una reunión hoy",             emoji: "📅", img: "IHaveAMeetingToday"},
        {texto: "Please send me the report",    es: "Por favor envíame el informe",      emoji: "📊"},
        {texto: "What time does it start?",     es: "¿A qué hora empieza?",              emoji: "🕒"},
        {texto: "My boss is very kind",         es: "Mi jefe es muy amable",             emoji: "🧑‍💼", img: "MyBossIsVeryKind"},
        {texto: "I work from nine to five",     es: "Trabajo de nueve a cinco",          emoji: "🏢"},
        {texto: "Can you help me, please?",     es: "¿Puedes ayudarme, por favor?",      emoji: "🙋", img: "CanYouHelpMePlease"},
        {texto: "The computer is not working",  es: "La computadora no funciona",        emoji: "💻"},
        {texto: "I will call you later",        es: "Te llamaré más tarde",              emoji: "📲"},
        {texto: "We need a new printer",        es: "Necesitamos una impresora nueva",   emoji: "📦"},
        {texto: "Let us start the meeting",     es: "Empecemos la reunión",              emoji: "🎤"}
      ],
      dificil: [
        {texto: "I would like to schedule a meeting for tomorrow",  es: "Quisiera programar una reunión para mañana",         emoji: "🗓️"},
        {texto: "Could you please send me the file by email",       es: "¿Podría enviarme el archivo por correo, por favor?", emoji: "📎"},
        {texto: "I am applying for a job in your company",          es: "Estoy postulando a un trabajo en su empresa",        emoji: "📨"},
        {texto: "My manager asked me to finish the report today",   es: "Mi gerente me pidió terminar el informe hoy",        emoji: "✅"},
        {texto: "We are waiting for the client to arrive",          es: "Estamos esperando que llegue el cliente",            emoji: "⌚"},
        {texto: "I need to talk to you about the project",          es: "Necesito hablar contigo sobre el proyecto",          emoji: "🗨️"},
        {texto: "The office closes at six and I go home",           es: "La oficina cierra a las seis y me voy a casa",       emoji: "🌆"},
        {texto: "Thank you for your time and have a nice day",      es: "Gracias por su tiempo y que tenga un buen día",      emoji: "🙏"},
        {texto: "Please remember to save your work before you leave", es: "Por favor recuerda guardar tu trabajo antes de irte", emoji: "💾"},
        {texto: "Our team works hard to finish every project on time", es: "Nuestro equipo trabaja duro para terminar cada proyecto a tiempo", emoji: "🏁"}
      ]
    },

    // ---------------------------------------------------------
    diario: {
      facil: [
        {texto: "I am hungry",       es: "Tengo hambre",       emoji: "🍽️"},
        {texto: "Drink some water",  es: "Toma agua",          emoji: "💧"},
        {texto: "Open the window",   es: "Abre la ventana",    emoji: "🪟"},
        {texto: "I like pizza",      es: "Me gusta la pizza",  emoji: "🍕"},
        {texto: "How much?",         es: "¿Cuánto cuesta?",    emoji: "💰", img: "HowMuch"},
        {texto: "I am tired",        es: "Estoy cansado",      emoji: "😴"},
        {texto: "Wake up",           es: "Despierta",          emoji: "⏰"},
        {texto: "Let us go",         es: "Vamos",              emoji: "🚶", img: "LetUsGo"},
        {texto: "I need help",       es: "Necesito ayuda",     emoji: "🆘"},
        {texto: "It is raining",     es: "Está lloviendo",     emoji: "🌧️"}
      ],
      medio: [
        {texto: "Where is the bathroom?",       es: "¿Dónde está el baño?",          emoji: "🚽"},
        {texto: "I would like some water",      es: "Quisiera un poco de agua",      emoji: "🥤", img: "IWouldLikeSomeWater"},
        {texto: "How much does it cost?",       es: "¿Cuánto cuesta?",               emoji: "💵", img: "HowMuchDoesItCost"},
        {texto: "I take the bus to work",       es: "Tomo el bus al trabajo",        emoji: "🚌"},
        {texto: "The store opens at nine",      es: "La tienda abre a las nueve",    emoji: "🏪"},
        {texto: "Can I pay with cash?",         es: "¿Puedo pagar en efectivo?",     emoji: "💳", img: "CanIPayWithCash"},
        {texto: "I am going to the market",     es: "Voy al mercado",                emoji: "🛒"},
        {texto: "We eat dinner at eight",       es: "Cenamos a las ocho",            emoji: "🍝"},
        {texto: "Please turn off the light",    es: "Por favor apaga la luz",        emoji: "💡"},
        {texto: "What is the weather like?",    es: "¿Cómo está el clima?",          emoji: "🌤️"}
      ],
      dificil: [
        {texto: "Excuse me, where is the nearest bus stop?",          es: "Disculpa, ¿dónde está la parada de bus más cercana?", emoji: "🚏"},
        {texto: "I would like a table for two people, please",        es: "Quisiera una mesa para dos personas, por favor",      emoji: "🥂"},
        {texto: "Can you tell me how to get to the station?",         es: "¿Puedes decirme cómo llegar a la estación?",          emoji: "🧭"},
        {texto: "I usually wake up early and drink a cup of coffee",  es: "Normalmente me levanto temprano y tomo una taza de café", emoji: "☕"},
        {texto: "We are going to visit my grandmother this weekend",  es: "Vamos a visitar a mi abuela este fin de semana",      emoji: "👵"},
        {texto: "I forgot my keys and I cannot open the door",        es: "Olvidé mis llaves y no puedo abrir la puerta",        emoji: "🔑"},
        {texto: "The doctor told me to rest and drink a lot of water", es: "El doctor me dijo que descanse y tome mucha agua",   emoji: "🩺"},
        {texto: "Do you know a good restaurant near here?",           es: "¿Conoces un buen restaurante cerca de aquí?",         emoji: "🍴"},
        {texto: "It is going to rain this afternoon, so take an umbrella", es: "Va a llover esta tarde, así que lleva un paraguas", emoji: "☔"},
        {texto: "I need to buy some bread, milk and eggs at the store", es: "Necesito comprar pan, leche y huevos en la tienda", emoji: "🛍️"}
      ]
    }
  };
