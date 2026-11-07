/* ============================================================
   vocabulario.js
   FLASH CARDS: las palabras con emoji (animales, comida y cosas)
   y las funciones que eligen las palabras según el nivel.

   El NIVEL de una palabra depende de cuántas letras tiene:
     Easy   = hasta 4 letras      (cat, egg)
     Medium = de 5 a 7 letras     (tiger, banana)
     Hard   = 8 letras o más      (elephant, pineapple)

   Para agregar una palabra nueva, copia una línea y cambia:
     ["palabra", "emoji"]
   ============================================================ */

const VOCABULARIO = {
  animales: [
    ["cat", "🐱"], ["dog", "🐶"], ["pig", "🐷"], ["cow", "🐮"], ["fox", "🦊"],
    ["bee", "🐝"], ["owl", "🦉"], ["duck", "🦆"], ["frog", "🐸"], ["fish", "🐟"],
    ["bear", "🐻"], ["lion", "🦁"], ["wolf", "🐺"], ["crab", "🦀"], ["bird", "🐦"],
    ["deer", "🦌"], ["goat", "🐐"], ["swan", "🦢"], ["ant", "🐜"], ["bat", "🦇"],
    ["horse", "🐴"], ["tiger", "🐯"], ["sheep", "🐑"], ["mouse", "🐭"], ["zebra", "🦓"],
    ["snake", "🐍"], ["whale", "🐳"], ["shark", "🦈"], ["panda", "🐼"], ["koala", "🐨"],
    ["rabbit", "🐰"], ["monkey", "🐵"], ["turtle", "🐢"], ["parrot", "🦜"], ["camel", "🐫"],
    ["lizard", "🦎"], ["giraffe", "🦒"], ["penguin", "🐧"], ["dolphin", "🐬"], ["octopus", "🐙"],
    ["chicken", "🐔"], ["peacock", "🦚"], ["spider", "🕷️"], ["elephant", "🐘"], ["kangaroo", "🦘"],
    ["crocodile", "🐊"], ["butterfly", "🦋"], ["hedgehog", "🦔"], ["squirrel", "🐿️"], ["flamingo", "🦩"],
    ["dinosaur", "🦖"], ["scorpion", "🦂"], ["rhinoceros", "🦏"], ["hippopotamus", "🦛"], ["orangutan", "🦧"],
    ["caterpillar", "🐛"], ["grasshopper", "🦗"]
  ],

  comida: [
    ["egg", "🥚"], ["pie", "🥧"], ["tea", "🍵"], ["rice", "🍚"], ["milk", "🥛"],
    ["cake", "🍰"], ["corn", "🌽"], ["nut", "🥜"], ["meat", "🍖"], ["soup", "🍲"],
    ["pear", "🍐"], ["taco", "🌮"], ["kiwi", "🥝"], ["apple", "🍎"], ["bread", "🍞"],
    ["pizza", "🍕"], ["grape", "🍇"], ["lemon", "🍋"], ["mango", "🥭"], ["melon", "🍈"],
    ["peach", "🍑"], ["banana", "🍌"], ["cheese", "🧀"], ["burger", "🍔"], ["cookie", "🍪"],
    ["carrot", "🥕"], ["tomato", "🍅"], ["potato", "🥔"], ["orange", "🍊"], ["coffee", "☕"],
    ["cherry", "🍒"], ["onion", "🧅"], ["garlic", "🧄"], ["salad", "🥗"], ["honey", "🍯"],
    ["pasta", "🍝"], ["sushi", "🍣"], ["fries", "🍟"], ["candy", "🍬"], ["coconut", "🥥"],
    ["popcorn", "🍿"], ["avocado", "🥑"], ["bacon", "🥓"], ["cupcake", "🧁"], ["pineapple", "🍍"],
    ["strawberry", "🍓"], ["watermelon", "🍉"], ["broccoli", "🥦"], ["sandwich", "🥪"], ["chocolate", "🍫"],
    ["pancakes", "🥞"], ["doughnut", "🍩"], ["mushroom", "🍄"], ["cucumber", "🥒"], ["eggplant", "🍆"],
    ["croissant", "🥐"], ["dumpling", "🥟"]
  ],

  cosas: [
    ["bed", "🛏️"], ["key", "🔑"], ["door", "🚪"], ["book", "📖"], ["bell", "🔔"],
    ["ball", "⚽"], ["bag", "👜"], ["hat", "🎩"], ["sock", "🧦"], ["coat", "🧥"],
    ["boat", "⛵"], ["bike", "🚲"], ["car", "🚗"], ["bus", "🚌"], ["ship", "🚢"],
    ["star", "⭐"], ["tree", "🌳"], ["gift", "🎁"], ["ring", "💍"], ["drum", "🥁"],
    ["tent", "⛺"], ["pen", "🖊️"], ["rose", "🌹"], ["phone", "📱"], ["clock", "🕐"],
    ["couch", "🛋️"], ["shoes", "👟"], ["shirt", "👕"], ["dress", "👗"], ["jeans", "👖"],
    ["camera", "📷"], ["guitar", "🎸"], ["piano", "🎹"], ["flower", "🌸"], ["cloud", "☁️"],
    ["rocket", "🚀"], ["plane", "✈️"], ["train", "🚆"], ["truck", "🚚"], ["house", "🏠"],
    ["school", "🏫"], ["bridge", "🌉"], ["candle", "🕯️"], ["crown", "👑"], ["heart", "❤️"],
    ["globe", "🌍"], ["magnet", "🧲"], ["battery", "🔋"], ["trophy", "🏆"], ["basket", "🧺"],
    ["pencil", "✏️"], ["radio", "📻"], ["robot", "🤖"], ["glasses", "👓"], ["money", "💰"],
    ["umbrella", "☂️"], ["computer", "💻"], ["backpack", "🎒"], ["keyboard", "⌨️"], ["microscope", "🔬"],
    ["telescope", "🔭"], ["helicopter", "🚁"], ["ambulance", "🚑"], ["mountain", "⛰️"], ["scissors", "✂️"],
    ["sunglasses", "🕶️"], ["headphones", "🎧"], ["calendar", "📅"], ["envelope", "✉️"], ["hourglass", "⏳"],
    ["snowflake", "❄️"], ["motorcycle", "🏍️"]
  ]
};

// Categorías que se pueden elegir (la de verbos usa tus dibujos)
const CATEGORIAS = [
  { id: "verbos",   nombre: "Verbs",   emoji: "🎨" },
  { id: "animales", nombre: "Animals", emoji: "🐾" },
  { id: "comida",   nombre: "Food",    emoji: "🍎" },
  { id: "cosas",    nombre: "Things",  emoji: "🎒" },
  { id: "mix",      nombre: "Mix",     emoji: "🎲" }
];

// Los tres niveles
const NIVELES = {
  facil:   { nombre: "Easy",   emoji: "🟢" },
  medio:   { nombre: "Medium", emoji: "🟡" },
  dificil: { nombre: "Hard",   emoji: "🔴" }
};

/* ------------------------------------------------------------
   El emoji se convierte en una imagen (SVG) para poder mostrarlo
   igual que los dibujos de los verbos. El tamaño 300 es el tamaño
   del emoji: sube o baja ese número para hacerlo más grande o chico.
   ------------------------------------------------------------ */
function imagenEmoji(emoji) {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">' +
              '<text x="200" y="300" font-size="300" text-anchor="middle">' + emoji + '</text></svg>';
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

// Dice a qué nivel pertenece una palabra, según su largo
function nivelDePalabra(palabra) {
  if (palabra.length <= 4) return "facil";
  if (palabra.length <= 7) return "medio";
  return "dificil";
}

// Los 16 verbos con dibujo, como lista de palabras
function palabrasDeVerbos() {
  const lista = [];
  for (let i = 0; i < verbos.length; i++) {
    lista.push({ palabra: verbos[i].nombre, img: verbos[i].img });
  }
  return lista;
}

// Las palabras con emoji de una categoría ("animales", "comida" o "cosas")
function palabrasDeVocabulario(categoria) {
  const lista = [];
  const filas = VOCABULARIO[categoria];
  for (let i = 0; i < filas.length; i++) {
    const palabra = filas[i][0];
    lista.push({
      palabra: palabra.charAt(0).toUpperCase() + palabra.slice(1),  // "cat" -> "Cat"
      img: imagenEmoji(filas[i][1])
    });
  }
  return lista;
}

// Todas las palabras de una categoría (sin mirar el nivel)
function todasLasPalabras(categoria) {
  if (categoria === "verbos") return palabrasDeVerbos();
  if (categoria === "mix") {
    return palabrasDeVerbos()
      .concat(palabrasDeVocabulario("animales"))
      .concat(palabrasDeVocabulario("comida"))
      .concat(palabrasDeVocabulario("cosas"));
  }
  return palabrasDeVocabulario(categoria);
}

// Las palabras de una categoría que corresponden al nivel elegido
function palabrasDelNivel(categoria, nivel) {
  const todas = todasLasPalabras(categoria);
  const delNivel = [];
  const resto = [];

  for (let i = 0; i < todas.length; i++) {
    if (nivelDePalabra(todas[i].palabra) === nivel) delNivel.push(todas[i]);
    else resto.push(todas[i]);
  }

  // Si hay pocas palabras (pasa con los verbos), completamos hasta tener 8:
  // en Easy con las más cortas que sobran, en los otros niveles con las más largas
  if (delNivel.length < 8) {
    resto.sort(function (a, b) {
      if (nivel === "facil") return a.palabra.length - b.palabra.length;
      return b.palabra.length - a.palabra.length;
    });
    while (delNivel.length < 8 && resto.length > 0) {
      delNivel.push(resto.shift());
    }
  }
  return delNivel;
}
