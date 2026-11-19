/* ============================================================
   frases-datos.js
   Frequent phrases: categorías y frases por nivel.
   ============================================================ */

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
  const CARPETA_IMAGENES_FRASES = "frases/imagenes_frases/";
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
