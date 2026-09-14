// Referencias al DOM
const authSlide = document.getElementById('authSlide');
const photoSlide = document.getElementById('photoSlide');
const profileSlide = document.getElementById('profileSlide');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const photoForm = document.getElementById('photoForm');

const loginTabBtn = document.getElementById('loginTabBtn');
const registerTabBtn = document.getElementById('registerTabBtn');
const loginError = document.getElementById('loginError');

const photoInput = document.getElementById('photoInput');
const avatarPreview = document.getElementById('avatarPreview');
const profileAvatar = document.getElementById('profileAvatar');
const profileUsername = document.getElementById('profileUsername');

const DEFAULT_AVATAR = 'https://via.placeholder.com/150';
let tempAvatarBase64 = null;

// Comprobar sesión activa al cargar
window.addEventListener('DOMContentLoaded', () => {
  const activeUser = JSON.parse(localStorage.getItem('activeUser'));
  if (activeUser) {
    if (activeUser.hasSetupPhoto) {
      mostrarPerfil(activeUser);
    } else {
      cambiarSlide(photoSlide);
    }
  }
});

// Cambiar entre pestañas Login y Registro
function mostrarTab(tab) {
  loginError.classList.remove('visible');
  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginTabBtn.classList.add('active');
    registerTabBtn.classList.remove('active');
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    registerTabBtn.classList.add('active');
    loginTabBtn.classList.remove('active');
  }
}

// Cambiar visualización de slides
function cambiarSlide(targetSlide) {
  [authSlide, photoSlide, profileSlide].forEach(slide => {
    slide.classList.remove('active');
  });
  targetSlide.classList.add('active');
}

// 1. REGISTRO
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('regUser').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const password = document.getElementById('regPassword').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  if (users.some(u => u.email === email)) {
    alert('Este correo electrónico ya está registrado.');
    return;
  }

  const newUser = { 
    username, 
    email, 
    password, 
    avatar: DEFAULT_AVATAR,
    hasSetupPhoto: false 
  };
  
  users.push(newUser);

  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('activeUser', JSON.stringify(newUser));

  registerForm.reset();
  cambiarSlide(photoSlide);
});

// 2. INICIO DE SESIÓN
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const emailInput = document.getElementById('loginEmail').value.trim().toLowerCase();
  const passwordInput = document.getElementById('loginPassword').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const foundUser = users.find(u => u.email === emailInput && u.password === passwordInput);

  if (foundUser) {
    loginError.classList.remove('visible');
    localStorage.setItem('activeUser', JSON.stringify(foundUser));
    loginForm.reset();

    if (foundUser.hasSetupPhoto) {
      mostrarPerfil(foundUser);
    } else {
      cambiarSlide(photoSlide);
    }
  } else {
    loginError.classList.add('visible');
  }
});

// 3. PREVISUALIZAR FOTO SUBIDA
photoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      tempAvatarBase64 = event.target.result;
      avatarPreview.src = tempAvatarBase64;
    };
    reader.readAsDataURL(file);
  }
});

// 4. GUARDAR FOTO DE PERFIL
photoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const avatarToSave = tempAvatarBase64 || DEFAULT_AVATAR;
  actualizarUsuarioActivo({ avatar: avatarToSave, hasSetupPhoto: true });
  
  const activeUser = JSON.parse(localStorage.getItem('activeUser'));
  mostrarPerfil(activeUser);
});

function saltarFoto() {
  actualizarUsuarioActivo({ avatar: DEFAULT_AVATAR, hasSetupPhoto: true });
  const activeUser = JSON.parse(localStorage.getItem('activeUser'));
  mostrarPerfil(activeUser);
}

// FUNCIONES DE APOYO
function actualizarUsuarioActivo(datos) {
  let activeUser = JSON.parse(localStorage.getItem('activeUser'));
  activeUser = { ...activeUser, ...datos };

  let users = JSON.parse(localStorage.getItem('users')) || [];
  users = users.map(u => u.email === activeUser.email ? activeUser : u);

  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('activeUser', JSON.stringify(activeUser));
}

function mostrarPerfil(user) {
  profileUsername.textContent = `@${user.username}`;
  profileAvatar.src = user.avatar || DEFAULT_AVATAR;
  cambiarSlide(profileSlide);
}

function cerrarSesion() {
  localStorage.removeItem('activeUser');
  tempAvatarBase64 = null;
  avatarPreview.src = DEFAULT_AVATAR;
  cambiarSlide(authSlide);
  mostrarTab('login');
}
