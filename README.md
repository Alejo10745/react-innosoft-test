# Resumen de cambios y cómo ejecutar el proyecto

Este README documenta los cambios que se aplicaron al proyecto para soportar:

- Persistencia de sesión (token) en `localStorage`.
- Restauración inmediata del estado `auth` al iniciar la aplicación para evitar condiciones de carrera.
- Envío automático del header `Authorization: Bearer <token>` en todas las peticiones.
- Uso de la variable de entorno `REACT_APP_BACKEND_URL` para configurar la base URL del backend.

Archivos modificados

- `src/context/AppContext.js`
  - Añadida la constante `AUTH_KEY = 'executive_auth'`.
  - `auth` ahora se inicializa con un initializer de `useState` que lee y valida el objeto guardado en `localStorage` (evita la condición de carrera donde otras páginas hacen peticiones antes de que el efecto restablezca el token).
  - Se mantiene un `useEffect` que persiste cualquier cambio de `auth` en `localStorage` (se elimina la entrada al cerrar sesión).

- `src/pages/Login.js`
  - Tras un login exitoso se guarda el objeto `auth` en `localStorage` (usuario, userid, token, expiration).
  - Se mantiene el guardado en memoria de las `credentials` para refresh silencioso (no se guardó la contraseña en `localStorage`).

- `src/services/api.js`
  - Ahora usa `process.env.REACT_APP_BACKEND_URL || ''` como `BASE_URL` en vez de `process.env.BACKEND_URL`.
  - `axios.create` usa la `baseURL` configurada para resolver correctamente las rutas relativas hacia el backend.
  - `updateApiState` sincroniza `api.defaults.headers.common.Authorization` y `axios.defaults.headers.common.Authorization` con el token del estado, asegurando que todas las peticiones (tanto `api` como llamadas directas `axios`) incluyan `Authorization: Bearer <token>`.
  - El interceptor de refresh actualiza también los headers por defecto tras obtener un nuevo token.

- `.env`
  - Se añadió/actualizó la variable: `REACT_APP_BACKEND_URL=https://pruebareactjs.test-class.com/Api` (este archivo no debería compartirse en producción si contiene secretos).

Por qué usar `REACT_APP_...`

- Create React App (CRA) expone automáticamente al bundle de cliente sólo las variables de entorno que empiezan con `REACT_APP_`. Es decir, `process.env.REACT_APP_FOO` estará disponible en `window.process.env` durante el build/desarrollo, pero `process.env.BACKEND_URL` no será inyectada y por lo tanto su valor será `undefined` en el cliente.
- Si no se usa `REACT_APP_` las peticiones con `axios` pueden terminar resolviéndose como rutas relativas (por ejemplo `http://localhost:3000/app/clientes/api/...`) y producir 404 en desarrollo.

Cómo ejecutar y verificar (PowerShell)

1. Instalar dependencias (si no lo hiciste aún):

```powershell
cd c:\Users\ale97\Desktop\react-innosoft-test
npm install
```

2. Asegúrate de que `.env` contiene la URL correcta del backend:

```text
REACT_APP_BACKEND_URL=https://pruebareactjs.test-class.com/Api
```

3. Reinicia el servidor de desarrollo (IMPORTANTE: CRA lee `.env` al arrancar):

```powershell
npm start
```

Verificaciones en el navegador

- Local Storage: DevTools → Application → Local Storage → `http://localhost:3000` → buscar clave `executive_auth`. Debe contener `token` y `expiration`.
- Network: al abrir `/app/clientes/nuevo` revisa la petición `api/Intereses/Listado`. Debe apuntar a:
  `https://pruebareactjs.test-class.com/Api/api/Intereses/Listado` y en Request Headers aparecer `Authorization: Bearer <token>`.
- Si ves aún peticiones a `http://localhost:3000/app/.../api/...`, reinicia el servidor y comprueba que `src/services/api.js` contiene `process.env.REACT_APP_BACKEND_URL`.

Notas de seguridad y consideraciones

- No guardes contraseñas en `localStorage`. En este proyecto sólo se guardan `credentials` en memoria para refresh silencioso; la persistencia en `localStorage` almacena únicamente el objeto `auth` (token, userid, username, expiration).
- Para una solución más segura se recomienda implementar un flujo de refresh token en el backend y almacenar únicamente el refresh token en una cookie HttpOnly (no accesible por JavaScript). Así se reduce el riesgo en caso de XSS.
- La sincronización de `axios.defaults` garantiza visibilidad del header en herramientas de depuración, pero si prefieres minimizar el alcance del header (por ejemplo no enviarlo en llamadas a endpoints públicos), se puede manejar por petición.

Problemas comunes y cómo resolverlos

- 404 en endpoints API desde el cliente: comprobar `REACT_APP_BACKEND_URL`, reiniciar `npm start`, y revisar que no existan rutas relativas construidas manualmente en las páginas.
- CORS: si el backend rechaza la petición por CORS, revisa la configuración del servidor (Access-Control-Allow-Origin) y las cabeceras permitidas.
- Token expirado: si `executive_auth.expiration` es pasada, la app eliminará la entrada y te pedirá login. Considera implementar refresh token para mejorar UX.

Siguientes mejoras sugeridas

- Implementar refresh-token seguro (backend + almacenamiento del refresh token en cookie HttpOnly).
- Manejar un indicador global que retrase peticiones hasta que `auth` haya sido restaurado (por si alguna petición arranca exactamente en el primer render fuera del control de React).
- Evitar mutar `axios.defaults` si prefieres control más fino: en su lugar, usar interceptores para añadir `Authorization` por petición.

Si quieres, puedo:

- Añadir un `.env.example` al repositorio con la variable `REACT_APP_BACKEND_URL` ya colocada.
- Cambiar todas las llamadas de login/otras páginas para usar rutas relativas consistentes (p. ej. `api.post('/api/Authenticate/login', ...)`) y así garantizar coherencia.
- Implementar la eliminación del header `Authorization` en la llamada de re-login por seguridad.

---

Archivo con cambios: `README.md`

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
