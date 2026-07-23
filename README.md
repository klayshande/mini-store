# Mini Store — APIs Externas, localStorage y Procesos Asíncronos

Mini aplicación web que simula una tienda en línea básica, construida con **HTML, Bootstrap 5 y JavaScript Vanilla**. Consume cuatro APIs externas, maneja datos JSON, carga información de forma asíncrona y persiste datos en el navegador con `localStorage`.

## Estructura del proyecto

```
MINI-STORE/
├── css/
│   └── style.css       Estilos propios (colores, tarjetas, avatar, etc.)
├── js/
│   └── app.js           Toda la lógica: fetch, async/await, try/catch, DOM, localStorage
├── index.html            Estructura de la página, pestañas Bootstrap y modal de JSON
└── README.md              Este archivo
```

## APIs utilizadas

- `https://jsonplaceholder.typicode.com/users` — usuarios simulados (pestaña Usuarios).
- `https://dummyjson.com/products` — productos simulados (pestaña Productos).
- `https://dog.ceo/api/breeds/image/random` — foto de perfil aleatoria (pestaña Perfil, se carga sola al iniciar).
- `https://catfact.ninja/fact` — dato curioso de gatos, al presionar un botón (pestaña Cat Facts).

## Funcionalidades clave

- **Carga automática**: la foto de perfil se pide a la API en el evento `DOMContentLoaded`, por lo que aparece sin que el usuario haga nada. Mientras carga, se muestra un placeholder SVG embebido (sin depender de servicios externos).
- **Usuarios API + locales**: la tabla combina los usuarios de JSONPlaceholder con los usuarios que el propio usuario agrega desde el formulario. Los usuarios locales **no se envían a ningún servidor**; solo viven en el navegador.
- **Persistencia con `localStorage`**: los usuarios agregados manualmente se guardan con `localStorage.setItem` y se recuperan con `localStorage.getItem` al recargar la página, para que no se pierdan.
- **Productos como tarjetas Bootstrap**: cada tarjeta muestra imagen, nombre, precio, categoría y descripción.
- **Cat Fact bajo demanda**: se pide un dato nuevo cada vez que se presiona el botón.
- **Modal de JSON**: dos botones ("Ver JSON de usuarios" / "Ver JSON de productos") abren un modal con `JSON.stringify(data, null, 2)` para inspeccionar los datos crudos.
- **Manejo de errores**: cada función que consume una API está envuelta en `try...catch` y muestra un mensaje claro si la petición falla.
