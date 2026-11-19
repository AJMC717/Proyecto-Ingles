/* ============================================================
   oraciones-datos.js
   Build sentences: las oraciones por categoría y dificultad.
   ============================================================ */

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
