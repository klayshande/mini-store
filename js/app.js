/* ============================================================
   Mini Store - app.js
   Practica: consumo de APIs externas, async/await, try/catch,
   manipulacion del DOM y almacenamiento local (localStorage).
   ============================================================ */

/* ------------------------------------------------------------
   Estado global de la aplicacion en memoria
   ------------------------------------------------------------ */
let apiUsers = [];      // usuarios que vienen de JSONPlaceholder
let localUsers = [];    // usuarios agregados manualmente (persisten en localStorage)
let productsData = [];  // productos que vienen de DummyJSON

const LOCAL_USERS_KEY = "miniStore_localUsers";

/* ------------------------------------------------------------
   Utilidad: mostrar mensajes de estado / error en pantalla
   ------------------------------------------------------------ */
function setStatus(elementId, message, type = "muted") {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.className = type === "error" ? "text-danger mb-2" : "text-muted mb-2";
}

/* ============================================================
   1) PERFIL: cargar imagen de perro automaticamente
   ============================================================
   Se ejecuta con el evento DOMContentLoaded (ver al final del archivo).
   Se eligio DOMContentLoaded porque dispara la funcion apenas el HTML
   termina de cargarse, sin esperar a imagenes u otros recursos, por lo
   que la foto de perfil aparece de inmediato sin que el usuario presione
   ningun boton.
*/
async function loadProfilePicture() {
  const img = document.getElementById("profile-picture");
  setStatus("profile-status", "");
  try {
    const response = await fetch("https://dog.ceo/api/breeds/image/random");
    if (!response.ok) throw new Error("Respuesta no valida de la API de perros");
    const data = await response.json();
    img.src = data.message;
  } catch (error) {
    console.error("Error al cargar la imagen de perfil:", error);
    setStatus("profile-status", "No se pudo cargar la imagen de perfil. Intenta de nuevo.", "error");
  }
}

/* ============================================================
   2) USUARIOS: cargar desde JSONPlaceholder
   ============================================================ */
async function loadUsers() {
  setStatus("users-status", "Cargando usuarios...");
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) throw new Error("Respuesta no valida de JSONPlaceholder");
    apiUsers = await response.json();
    renderUsersTable();
    setStatus("users-status", `Usuarios cargados: ${apiUsers.length} (API) + ${localUsers.length} (locales)`);
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    setStatus("users-status", "No se pudieron cargar los usuarios desde la API.", "error");
  }
}

function renderUsersTable() {
  const tbody = document.getElementById("users-table-body");
  tbody.innerHTML = "";

  // Usuarios de la API
  apiUsers.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${user.address ? user.address.city : "-"}</td>
      <td>${user.company ? user.company.name : "-"}</td>
      <td><span class="badge bg-primary">API</span></td>
    `;
    tbody.appendChild(row);
  });

  // Usuarios agregados localmente
  localUsers.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phone || "-"}</td>
      <td>${user.city || "-"}</td>
      <td>${user.company || "-"}</td>
      <td><span class="badge bg-success">Local</span></td>
    `;
    tbody.appendChild(row);
  });
}

/* ============================================================
   3) AGREGAR USUARIO LOCAL + localStorage
   ============================================================ */
function loadLocalUsersFromStorage() {
  try {
    const stored = localStorage.getItem(LOCAL_USERS_KEY);
    localUsers = stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error al leer localStorage:", error);
    localUsers = [];
  }
}

function saveLocalUsersToStorage() {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(localUsers));
  } catch (error) {
    console.error("Error al guardar en localStorage:", error);
  }
}

function handleAddUserForm(event) {
  event.preventDefault();

  const name = document.getElementById("new-user-name").value.trim();
  const email = document.getElementById("new-user-email").value.trim();
  const phone = document.getElementById("new-user-phone").value.trim();
  const city = document.getElementById("new-user-city").value.trim();
  const company = document.getElementById("new-user-company").value.trim();

  if (!name || !email) return;

  const newUser = { name, email, phone, city, company };
  localUsers.push(newUser);

  saveLocalUsersToStorage();   // persiste en localStorage
  renderUsersTable();          // refresca la tabla en pantalla
  setStatus("users-status", `Usuarios cargados: ${apiUsers.length} (API) + ${localUsers.length} (locales)`);

  document.getElementById("add-user-form").reset();
}

function handleClearLocalUsers() {
  localUsers = [];
  saveLocalUsersToStorage();
  renderUsersTable();
  setStatus("users-status", `Usuarios locales eliminados. Usuarios cargados: ${apiUsers.length} (API) + 0 (locales)`);
}

/* ============================================================
   4) PRODUCTOS: cargar desde DummyJSON
   ============================================================ */
async function loadProducts() {
  const container = document.getElementById("products-container");
  setStatus("products-status", "Cargando productos...");
  try {
    const response = await fetch("https://dummyjson.com/products?limit=12");
    if (!response.ok) throw new Error("Respuesta no valida de DummyJSON");
    const data = await response.json();
    productsData = data.products;
    renderProducts();
    setStatus("products-status", `Productos cargados: ${productsData.length}`);
  } catch (error) {
    console.error("Error al cargar productos:", error);
    container.innerHTML = "";
    setStatus("products-status", "No se pudieron cargar los productos desde la API.", "error");
  }
}

function renderProducts() {
  const container = document.getElementById("products-container");
  container.innerHTML = "";

  productsData.forEach((product) => {
    const col = document.createElement("div");
    col.className = "col-md-4 col-lg-3";
    col.innerHTML = `
      <div class="card product-card h-100 shadow-sm">
        <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
        <div class="card-body d-flex flex-column">
          <h6 class="card-title">${product.title}</h6>
          <span class="badge bg-secondary badge-category mb-2 align-self-start">${product.category}</span>
          <p class="card-text small text-muted flex-grow-1">${product.description}</p>
          <p class="fw-bold text-success mb-0">$${product.price}</p>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

/* ============================================================
   5) CAT FACTS
   ============================================================ */
async function loadCatFact() {
  const box = document.getElementById("cat-fact-box");
  box.innerHTML = `<div class="spinner-border spinner-inline text-warning" role="status"></div> Cargando dato curioso...`;
  try {
    const response = await fetch("https://catfact.ninja/fact");
    if (!response.ok) throw new Error("Respuesta no valida de Cat Facts");
    const data = await response.json();
    box.innerHTML = `<i class="bi bi-quote"></i> ${data.fact}`;
  } catch (error) {
    console.error("Error al cargar el dato curioso:", error);
    box.innerHTML = `<span class="text-danger">No se pudo obtener el dato curioso. Intenta de nuevo.</span>`;
  }
}

/* ============================================================
   6) MODAL JSON (JSON.stringify)
   ============================================================
   JSON.stringify(data, null, 2):
   - data: el objeto/arreglo de JavaScript que se quiere convertir a texto JSON.
   - null: segundo parametro (replacer); null significa que no se filtra
     ni transforma ninguna propiedad, se incluyen todas tal cual.
   - 2: tercer parametro (space); indica que se debe indentar el resultado
     con 2 espacios para que sea legible por una persona.
*/
function showJsonModal(title, data) {
  document.getElementById("json-modal-title").textContent = title;
  document.getElementById("json-modal-body").textContent = JSON.stringify(data, null, 2);
}

/* ============================================================
   EVENTOS: se ejecutan cuando el DOM ya esta listo
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {

  // 1. Cargar la foto de perfil automaticamente al iniciar la pagina
  loadProfilePicture();

  // 2. Cargar usuarios locales guardados previamente y luego los de la API
  loadLocalUsersFromStorage();
  loadUsers();

  // 3. Cargar productos (se puede cargar de una vez, o al abrir la pestaña)
  loadProducts();

  // Botones de recarga / interacciones
  document.getElementById("reload-avatar-btn").addEventListener("click", loadProfilePicture);
  document.getElementById("reload-users-btn").addEventListener("click", loadUsers);
  document.getElementById("reload-products-btn").addEventListener("click", loadProducts);
  document.getElementById("get-cat-fact-btn").addEventListener("click", loadCatFact);

  document.getElementById("add-user-form").addEventListener("submit", handleAddUserForm);
  document.getElementById("clear-local-users-btn").addEventListener("click", handleClearLocalUsers);

  document.getElementById("btn-view-users-json").addEventListener("click", () => {
    showJsonModal("JSON de usuarios (API + locales)", { apiUsers, localUsers });
  });

  document.getElementById("btn-view-products-json").addEventListener("click", () => {
    showJsonModal("JSON de productos", productsData);
  });
});