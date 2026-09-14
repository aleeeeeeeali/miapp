// Referencias a los elementos del DOM
const authSlide = document.getElementById('authSlide');
const dashboardSlide = document.getElementById('dashboardSlide');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginTabBtn = document.getElementById('loginTabBtn');
const registerTabBtn = document.getElementById('registerTabBtn');
const loginError = document.getElementById('loginError');
const userNameDisplay = document.getElementById('userNameDisplay');

// Comprobar si ya hay una sesión activa al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  const activeUser = JSON.parse(localStorage.getItem('activeUser'));
  if (activeUser) {
    mostrarDashboard(activeUser.username);
  }
});

// Cambiar entre la pestaña de Login y Registro
function mostrarTab(tab) {
  loginError.style.display = 'none';
  if (tab === 'login') {
    loginForm.style.display = 'flex';
    registerForm.style.display = 'none';
    loginTabBtn.classList.add('active');
    registerTabBtn.classList.remove('active');
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
    registerTabBtn.classList.add('active');
    loginTabBtn.classList.remove('active');
  }
}

// Proceso de Registro
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const username = document.getElementById('regUser').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  const newUser = { username, email, password };

  // Guardar el usuario en localStorage
  localStorage.setItem('registeredUser', JSON.stringify(newUser));
  localStorage.setItem('activeUser', JSON.stringify(newUser));

  // Limpiar formulario y entrar directamente a la Slide Azul
  registerForm.reset();
  mostrarDashboard(username);
});

// Proceso de Iniciar Sesión
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const emailInput = document.getElementById('loginEmail').value;
  const passwordInput = document.getElementById('loginPassword').value;

  const storedUser = JSON.parse(localStorage.getItem('registeredUser'));

  if (storedUser && storedUser.email === emailInput && storedUser.password === passwordInput) {
    loginError.style.display = 'none';
    localStorage.setItem('activeUser', JSON.stringify(storedUser));
    loginForm.reset();
    mostrarDashboard(storedUser.username);
  } else {
    loginError.style.display = 'block';
  }
});

// Función para cambiar a la Slide 2 (Dashboard Azul)
function mostrarDashboard(username) {
  userNameDisplay.textContent = username;
  authSlide.classList.remove('active');
  dashboardSlide.classList.add('active');
}

// Función para Cerrar Sesión y volver al Login
function cerrarSesion() {
  localStorage.removeItem('activeUser'); // Borrar la sesión activa
  dashboardSlide.classList.remove('active');
  authSlide.classList.add('active');
  mostrarTab('login'); // Volver a la pestaña de login
}
