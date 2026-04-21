import axios from "axios";

export const BASE_URL = process.env.REACT_APP_BACKEND_URL || "";

const api = axios.create({
  baseURL: BASE_URL || undefined,
  headers: { "Content-Type": "application/json" },
});

// Estado del módulo (actualizado desde AppContext via updateApiState)
const _state = {
  token: null,
  credentials: null, // { username, password } — en memoria para refresh silencioso
  onRefresh: null, // callback para actualizar el token en el contexto
};

export const updateApiState = (updates) => {
  Object.assign(_state, updates);
  try {
    if (_state.token) {
      api.defaults.headers.common.Authorization = `Bearer ${_state.token}`;
      axios.defaults.headers.common.Authorization = `Bearer ${_state.token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
      try {
        delete axios.defaults.headers.common.Authorization;
      } catch (e) {}
    }
  } catch (ERROR) {
    console.warn("Error actualizando estado de API", ERROR);
  }
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

// ── Interceptor de petición: adjunta Bearer token ──────────────────────────
api.interceptors.request.use(
  (config) => {
    if (_state.token) {
      config.headers.Authorization = `Bearer ${_state.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Interceptor de respuesta: refresco silencioso del token en 401 ─────────
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      // Si ya está refrescando, encolar la petición
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
          })
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        if (!_state.credentials) throw new Error("no-credentials");

        // Re-login sin sacar al usuario de la aplicación
        const { data } = await axios.post(
          `${BASE_URL}/api/Authenticate/login`,
          _state.credentials,
        );

        _state.token = data.token;
        if (_state.onRefresh) _state.onRefresh(data);

        // Actualizar headers por defecto en `api` y `axios` global.
        try {
          if (data.token) {
            api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
            axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
          } else {
            delete api.defaults.headers.common.Authorization;
            try {
              delete axios.defaults.headers.common.Authorization;
            } catch (e) {}
          }
        } catch (e) {
          // no-op
        }

        processQueue(null, data.token);
        original.headers.Authorization = `Bearer ${data.token}`;
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
