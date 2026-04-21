import React, { createContext, useState, useEffect } from "react";
import { updateApiState } from "../services/api";

const AUTH_KEY = "executive_auth";

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  // auth = { token, userid, username, expiration }
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.expiration) return null;
      const exp = new Date(parsed.expiration);
      if (isNaN(exp.getTime())) return null;
      return exp > new Date() ? parsed : null;
    } catch (e) {
      return null;
    }
  });
  // credentials = { username, password } — solo en memoria, para refresh silencioso
  const [credentials, setCredentials] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", sev: "success" });

  // Sincronizar estado con el módulo axios cada vez que cambia auth o credentials
  useEffect(() => {
    updateApiState({
      token: auth?.token || null,
      credentials,
      onRefresh: (data) =>
        setAuth((prev) => ({
          ...prev,
          token: data.token,
          expiration: data.expiration,
        })),
    });
  }, [auth, credentials]);

  // Persistir cambios en auth
  useEffect(() => {
    if (auth) {
      try {
        localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
      } catch (e) {
        // no-op on storage errors
      }
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [auth]);

  const showSnack = (msg, sev = "success") =>
    setSnack({ open: true, msg, sev });
  const hideSnack = () => setSnack((s) => ({ ...s, open: false }));

  // user = auth (alias para compatibilidad con Shell y rutas privadas)
  const user = auth;
  const setUser = (val) => {
    setAuth(val);
    if (!val) setCredentials(null); // limpiar credenciales al cerrar sesión
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        auth,
        setAuth,
        credentials,
        setCredentials,
        showSnack,
        snack,
        hideSnack,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
