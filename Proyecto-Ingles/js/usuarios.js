/* ============================================================
   usuarios.js
   Cuentas y sesión: login, registro, cerrar sesión, historial y ventanas (modales).
   ============================================================ */

    // LOGIN
  function login() {
    const user = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;
    
    // Usuarios pre-cargados del equipo
    const usuariosPorDefecto = [
      { user: 'Jhojan', pass: '111111' },
      { user: 'Erick', pass: '222222' },
      { user: 'Dennis', pass: '333333' },
      { user: 'Belen', pass: '444444' },
      { user: 'Adriel', pass: '555555' }
    ];
    
    // Obtener usuarios guardados O usar los por defecto
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    if (!usuarios) {
      usuarios = usuariosPorDefecto;
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
  
    const encontrado = usuarios.find(u => u.user === user && u.pass === pass);
    
    if (encontrado) {
      localStorage.setItem('userActual', user);
      document.getElementById('login').style.display = 'none';
      document.getElementById('app').style.display = 'block';
      document.getElementById('nombreUser').textContent = user;
      document.getElementById('nombreUserMenu').textContent = user;
    } else {
      mostrarAlerta('Error de acceso', '❌ Usuario o contraseña incorrectos. Intenta de nuevo.');
    }
  }

  // REGISTRO
 function registro() {
    const user = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;

    // Validación: no se puede crear una cuenta con campos vacíos
    if (user.trim() === '' || pass.trim() === '') {
      mostrarAlerta('Campos vacíos', '⚠️ Escribe un usuario y una contraseña para crear tu cuenta.');
      return;
    }
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    if (usuarios.find(u => u.user === user)) {
      mostrarAlerta('Usuario existente', '⚠️ Ese nombre de usuario ya está en uso. Prueba con otro.');
      return;
    }

    // Antes de crear la cuenta, pedimos la palabra secreta
    document.getElementById('regSecreta').value = '';
    document.getElementById('pantallaSecreta').classList.remove('oculto');
    document.getElementById('pantallaSecreta').style.display = 'flex';
  }

  function cerrarSecreta() {
    document.getElementById('pantallaSecreta').classList.add('oculto');
    document.getElementById('pantallaSecreta').style.display = 'none';
  }

  // Se ejecuta al pulsar "Crear cuenta" dentro de la ventana de la palabra secreta
  function confirmarRegistro() {
    const user = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;
    const secreta = document.getElementById('regSecreta').value.trim().toLowerCase();

    if (secreta === '') {
      mostrarAlerta('Falta la palabra secreta', '🔑 Escribe una palabra secreta. La necesitarás si olvidas tu contraseña.');
      return;
    }

    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    usuarios.push({ user, pass, secreta });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    cerrarSecreta();
    mostrarAlerta('¡Cuenta creada!', '✅ Tu usuario fue registrado con éxito. Ahora inicia sesión.');
  }

  // === RECUPERAR CONTRASEÑA CON PALABRA SECRETA ===
  function abrirRecuperar() {
    document.getElementById('recUser').value = document.getElementById('user').value;
    document.getElementById('recSecreta').value = '';
    document.getElementById('recNueva').value = '';
    document.getElementById('pantallaRecuperar').classList.remove('oculto');
    document.getElementById('pantallaRecuperar').style.display = 'flex';
  }

  function cerrarRecuperar() {
    document.getElementById('pantallaRecuperar').classList.add('oculto');
    document.getElementById('pantallaRecuperar').style.display = 'none';
  }

  function cambiarContrasena() {
    const user = document.getElementById('recUser').value;
    const secreta = document.getElementById('recSecreta').value.trim().toLowerCase();
    const nueva = document.getElementById('recNueva').value;

    if (user.trim() === '' || secreta === '' || nueva.trim() === '') {
      mostrarAlerta('Campos vacíos', '⚠️ Completa el usuario, la palabra secreta y la nueva contraseña.');
      return;
    }

    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const cuenta = usuarios.find(u => u.user === user);

    if (!cuenta) {
      mostrarAlerta('Usuario no encontrado', '❌ No existe una cuenta con ese usuario.');
      return;
    }
    if (!cuenta.secreta) {
      mostrarAlerta('Sin palabra secreta', '⚠️ Esta cuenta no tiene palabra secreta, así que no se puede recuperar.');
      return;
    }
    if (cuenta.secreta !== secreta) {
      mostrarAlerta('Palabra incorrecta', '❌ La palabra secreta no coincide.');
      return;
    }

    cuenta.pass = nueva;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    cerrarRecuperar();
    document.getElementById('user').value = user;
    document.getElementById('pass').value = '';
    mostrarAlerta('¡Contraseña cambiada!', '✅ Ya puedes iniciar sesión con tu nueva contraseña.');
  }

  // GUARDAR PROGRESO
  function guardarProgreso(actividad) {
    const user = localStorage.getItem('userActual');
    let historial = JSON.parse(localStorage.getItem('hist_' + user) || '[]');
    historial.push({ fecha: new Date().toLocaleString(), actividad });
    localStorage.setItem('hist_' + user, JSON.stringify(historial));
  }
    // === SISTEMA DE MODALES BONITOS ===
  function mostrarModal(titulo, mensaje, botones) {
    document.getElementById('modalTitulo').textContent = titulo;
    document.getElementById('modalMensaje').innerHTML = mensaje;
    
    const contenedorBotones = document.getElementById('modalBotones');
    contenedorBotones.innerHTML = '';
    
    botones.forEach(boton => {
      const btn = document.createElement('button');
      btn.textContent = boton.texto;
      btn.style.cssText = `padding:12px 24px; border:none; border-radius:12px; font-size:15px; font-weight:bold; cursor:pointer; ${boton.estilo || 'background:#58CC02; color:white;'}`;
      btn.onclick = () => {
        cerrarModal();
        if (boton.accion) boton.accion();
      };
      contenedorBotones.appendChild(btn);
    });
    
    document.getElementById('modalGenerico').classList.remove('oculto');
    document.getElementById('modalGenerico').style.display = 'flex';
  }

  function cerrarModal() {
    document.getElementById('modalGenerico').classList.add('oculto');
    document.getElementById('modalGenerico').style.display = 'none';
  }

  // Reemplazo de alert()
  function mostrarAlerta(titulo, mensaje) {
    mostrarModal(titulo, mensaje, [
      { texto: 'Aceptar', estilo: 'background:#58CC02; color:white;' }
    ]);
  }

  // Reemplazo de confirm()
  function mostrarConfirm(titulo, mensaje, accionSi, accionNo) {
    mostrarModal(titulo, mensaje, [
      { texto: 'Cancelar', estilo: 'background:#E5E5E5; color:#1B1035;', accion: accionNo },
      { texto: 'Aceptar', estilo: 'background:#58CC02; color:white;', accion: accionSi }
    ]);
  }

  // === HISTORIAL MEJORADO (Guarda resumen al terminar) ===
  function guardarResumenEnHistorial() {
    const user = localStorage.getItem('userActual');
    let historial = JSON.parse(localStorage.getItem('hist_' + user) || '[]');
    
    const nombresModos = {
      'completo': 'Write, Listen and Speak',
      'escribir': 'Write the verb',
      'elegir': 'Choose the right word',
      'conjugar': 'Practice conjugations',
      'oraciones': 'Build sentences',
      'escuchar': 'Listen and write',
      'hablar': 'Speak'
    };

    historial.push({
      fecha: new Date().toLocaleString(),
      modo: nombresModos[modoActual] || modoActual,
      puntaje: puntos,
      rachaMaxima: mejorRacha
    });
    localStorage.setItem('hist_' + user, JSON.stringify(historial));
  }

    // VER HISTORIAL (Ahora como pantalla modal bonita)
  function verHistorial() {
    const user = localStorage.getItem('userActual');
    const historial = JSON.parse(localStorage.getItem('hist_' + user) || '[]');
    
    document.getElementById('historialUser').textContent = user;
    
    const contenedor = document.getElementById('listaHistorial');
    
    if (historial.length === 0) {
      contenedor.innerHTML = '<p style="text-align:center; color:#777; padding:20px;">📭 No hay registros aún. ¡Juega tu primera partida!</p>';
    } else {
      let html = '';
      // Mostramos las últimas 10 partidas (de la más reciente a la más antigua)
      historial.slice().reverse().slice(0, 10).forEach((h, index) => {
        html += `
          <div style="background:#f5f5f5; border-radius:12px; padding:15px; margin-bottom:10px; border-left:4px solid #58CC02;">
            <div style="font-weight:bold; color:#1B1035; margin-bottom:5px;"> ${h.modo}</div>
            <div style="font-size:0.85rem; color:#777; margin-bottom:8px;">📅 ${h.fecha}</div>
            <div style="display:flex; gap:15px;">
              <span style="color:#58CC02; font-weight:bold;">⭐ ${h.puntaje} pts</span>
              <span style="color:#FF6EC7; font-weight:bold;">🔥 Racha: ${h.rachaMaxima}</span>
            </div>
          </div>
        `;
      });
      contenedor.innerHTML = html;
    }
    
    // Mostrar la pantalla modal
    document.getElementById('pantallaHistorial').classList.remove('oculto');
    document.getElementById('pantallaHistorial').style.display = 'flex';
  }

  // Cerrar el modal de historial
  function cerrarHistorial() {
    document.getElementById('pantallaHistorial').classList.add('oculto');
    document.getElementById('pantallaHistorial').style.display = 'none';
  }

  // CERRAR SESIÓN
  function cerrarSesion() {
    const user = localStorage.getItem('userActual');
    localStorage.removeItem('userActual');
    localStorage.removeItem('estado_juego_' + user); // Borra partida pausada al salir
    location.reload();
  }

  // Al cargar, verificar si ya hay sesión
  if (localStorage.getItem('userActual')) {
    document.getElementById('login').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('nombreUser').textContent = localStorage.getItem('userActual');
    document.getElementById('nombreUserMenu').textContent = localStorage.getItem('userActual');
  }
    // === MENÚ DE PERFIL ===
  function toggleMenuPerfil() {
    const menu = document.getElementById('menuPerfil');
    if (menu.style.display === 'none' || menu.style.display === '') {
      menu.style.display = 'block';
    } else {
      menu.style.display = 'none';
    }
  }

  // Cerrar el menú si se hace clic fuera
  document.addEventListener('click', function(event) {
    const menu = document.getElementById('menuPerfil');
    const btn = document.getElementById('btnPerfil');
    if (menu && btn && !menu.contains(event.target) && !btn.contains(event.target)) {
      menu.style.display = 'none';
    }
  });